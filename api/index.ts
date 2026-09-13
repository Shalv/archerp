import type { IncomingMessage, ServerResponse } from 'node:http';
import { Pool, type PoolClient } from 'pg';
import { createApp } from '../server';
import { dbService, databaseContext } from '../src/server/db';

let pool: Pool;
let appPromise: ReturnType<typeof createApp>;
let ready: Promise<void>;
function jsonError(res: ServerResponse, message: string) {
  res.statusCode = 503;
  res.removeHeader('Set-Cookie');
  res.removeHeader('Content-Length');
  res.removeHeader('ETag');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: message }));
}
/** The row lock serializes existing JSON-store operations across function instances.
 * Replies are held until commit, so a successful save always means a durable save. */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    return jsonError(res, 'Server setup incomplete. Configure DATABASE_URL and SESSION_SECRET in Vercel, then redeploy.');
  }
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3, connectionTimeoutMillis: 10000, idleTimeoutMillis: 10000 });
    pool.on('error', error => console.error('Idle database connection failed', error.message));
  }
  const url = new URL(req.url || '/', 'http://localhost');
  const route = url.searchParams.get('erpPath');
  if (route !== null) { url.pathname = '/api/' + route; url.searchParams.delete('erpPath'); req.url = url.pathname + url.search; }

  appPromise ||= createApp(true);
  let client: PoolClient | undefined;
  try {
    ready ||= (async () => {
      await pool.query('CREATE TABLE IF NOT EXISTS buildstorys_state (id integer PRIMARY KEY, data jsonb NOT NULL)');
      await pool.query('INSERT INTO buildstorys_state (id, data) VALUES (1, $1::jsonb) ON CONFLICT (id) DO NOTHING', [JSON.stringify(dbService.snapshot())]);
    })().catch(error => { ready = undefined; throw error; });
    await ready;
    client = await pool.connect();
    await client.query('BEGIN');
    await client.query("SET LOCAL statement_timeout = '50000'");
    const result = await client.query('SELECT data FROM buildstorys_state WHERE id = 1 FOR UPDATE');
    if (!result.rows[0]?.data) throw new Error('Database state missing');
    const context = { data: result.rows[0].data };
    const originalEnd = res.end.bind(res);
    await new Promise<void>((resolve, reject) => {
      let ending = false;
      res.end = ((...args: any[]) => {
        if (ending) return res;
        ending = true;
        (async () => {
          if (res.statusCode < 400) {
            await client!.query('UPDATE buildstorys_state SET data = $1::jsonb WHERE id = 1', [JSON.stringify(context.data)]);
            await client!.query('COMMIT');
          } else await client!.query('ROLLBACK');
          res.end = originalEnd;
          (originalEnd as any)(...args);
          resolve();
        })().catch(error => { res.end = originalEnd; reject(error); });
        return res;
      }) as typeof res.end;
      databaseContext.run(context, () => {
        appPromise.then(app => app(req as any, res as any)).catch(error => { res.end = originalEnd; reject(error); });
      });
    });
  } catch (error) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error('ERP persistence request failed', error instanceof Error ? error.message : 'Unknown error');
    if (!res.headersSent) jsonError(res, 'The database service is unavailable. No changes were confirmed. Please retry or contact your administrator.');
  } finally { client?.release(); }
}
