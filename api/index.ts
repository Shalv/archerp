import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../server';
import { dbService, databaseContext } from '../src/server/db';
import { mongoDBService } from '../src/server/mongoService';

let appPromise: ReturnType<typeof createApp>;
let ready: Promise<void> | undefined;

function jsonError(res: ServerResponse, message: string) {
  res.statusCode = 503;
  res.removeHeader('Set-Cookie');
  res.removeHeader('Content-Length');
  res.removeHeader('ETag');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: message }));
}

/**
 * Serverless API Gateway with exclusive MongoDB Atlas persistence synchronization.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || '/', 'http://localhost');
  const route = url.searchParams.get('erpPath');
  if (route !== null) {
    url.pathname = '/api/' + route;
    url.searchParams.delete('erpPath');
    req.url = url.pathname + url.search;
  }

  appPromise ||= createApp(true);

  try {
    if (!ready) {
      ready = (async () => {
        // Hydrate from MongoDB Atlas if remote state exists
        const remoteData = await mongoDBService.loadFromMongoDB();
        if (remoteData) {
          dbService.hydrateFromRemote(remoteData);
        }
      })().catch(error => {
        ready = undefined;
        console.warn('[MongoDB Atlas] Remote hydration note:', error instanceof Error ? error.message : 'Unknown error');
      });
    }
    await ready;

    const context = { data: dbService.snapshot() };
    const originalEnd = res.end.bind(res);

    await new Promise<void>((resolve, reject) => {
      let ending = false;
      res.end = ((...args: any[]) => {
        if (ending) return res;
        ending = true;
        (async () => {
          if (res.statusCode < 400 && mongoDBService.getStatus().connected) {
            await mongoDBService.syncToMongoDB(context.data).catch(err => {
              console.warn('[MongoDB Atlas] Background sync note:', err instanceof Error ? err.message : 'Unknown error');
            });
          }
          res.end = originalEnd;
          (originalEnd as any)(...args);
          resolve();
        })().catch(error => {
          res.end = originalEnd;
          reject(error);
        });
        return res;
      }) as typeof res.end;

      databaseContext.run(context, () => {
        appPromise.then(app => app(req as any, res as any)).catch(error => {
          res.end = originalEnd;
          reject(error);
        });
      });
    });
  } catch (error) {
    console.error('ERP persistence request failed', error instanceof Error ? error.message : 'Unknown error');
    if (!res.headersSent) {
      jsonError(res, 'The MongoDB database service is unavailable. No changes were confirmed. Please retry or contact your administrator.');
    }
  }
}
