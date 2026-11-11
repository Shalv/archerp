/**
 * Build Storys ERP - API client helper
 * ------------------------------------
 * Every API call in the app goes through here so a non-JSON response can never
 * surface as "Unexpected token 'T', \"The page c\"... is not valid JSON".
 *
 * That message means the request never reached the Express app: the host
 * answered with its own HTML 404 (a missing /api rewrite, or a deployment
 * running an older build). The helper turns that into one readable sentence
 * that names the path and the likely cause.
 */

export class ApiUnavailableError extends Error {
  code = 'API_UNAVAILABLE' as const;
  status: number;
  path: string;
  hint: string;

  constructor(path: string, status: number, hint: string) {
    super(`The API route ${path} is not reachable (HTTP ${status}). ${hint}`);
    this.name = 'ApiUnavailableError';
    this.status = status;
    this.path = path;
    this.hint = hint;
  }
}

const DEFAULT_HINT =
  'The server answered with HTML instead of JSON, which means /api is not routed to the application. ' +
  'On Vercel add the rewrite in vercel.json (source /api/:path* → /api/index?erpPath=:path*), ' +
  'or start the app with `npm run dev` so Express serves the API itself.';

function looksLikeHtml(text: string): boolean {
  const head = text.trimStart().slice(0, 200).toLowerCase();
  return head.startsWith('<!doctype') || head.startsWith('<html') || head.includes('<body');
}

export async function apiJson<T = any>(
  path: string,
  init: RequestInit = {},
  options: { hint?: string } = {}
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}) }
    });
  } catch (err: any) {
    throw new ApiUnavailableError(path, 0, `The request could not be sent (${err?.message || 'network error'}). ${options.hint || ''}`.trim());
  }

  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  const raw = await res.text();

  if (!contentType.includes('json')) {
    // Surface what the host actually said - "FUNCTION_INVOCATION_FAILED" tells
    // you the serverless function crashed, which is a different problem from a
    // missing route.
    const snippet = raw.replace(/\s+/g, ' ').trim().slice(0, 160);
    if (looksLikeHtml(raw) || res.status === 404) {
      throw new ApiUnavailableError(path, res.status, options.hint || DEFAULT_HINT);
    }
    throw new ApiUnavailableError(
      path,
      res.status,
      options.hint ||
        `The server returned a non-JSON response (${contentType || 'no content-type'}). ` +
          (snippet ? `Host said: "${snippet}". ` : '') +
          'A 500 here usually means the API function crashed while starting - sign in and open /api/system/diagnostics for the build, database and AI status.'
    );
  }

  let body: any = null;
  try {
    body = raw ? JSON.parse(raw) : null;
  } catch {
    throw new ApiUnavailableError(path, res.status, 'The server returned malformed JSON.');
  }

  if (!res.ok) {
    const message = body?.error || body?.message || `Request failed with HTTP ${res.status}.`;
    const error: any = new Error(message);
    error.status = res.status;
    error.payload = body;
    throw error;
  }

  return body as T;
}

/** True when a caught error is the "API not routed" case, so the UI can show setup help. */
export function isApiUnavailable(error: unknown): error is ApiUnavailableError {
  return Boolean(error) && (error as any).code === 'API_UNAVAILABLE';
}
