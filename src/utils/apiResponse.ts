/** Reads API replies without exposing HTML proxy pages or JSON parser errors to users. */
export async function readApiResponse(response: Response): Promise<any> {
  const raw = await response.text();
  let data: any;
  try { data = JSON.parse(raw); } catch {
    const err = new Error(`The service is unavailable (HTTP ${response.status}). Please try again.`);
    (err as any).status = response.status;
    throw err;
  }
  if (!data || typeof data !== 'object') {
    const err = new Error('The server returned an unexpected response. Please try again.');
    (err as any).status = response.status;
    throw err;
  }
  if (!response.ok) {
    const message = typeof data.error === 'string' ? data.error :
      typeof data.message === 'string' ? data.message :
      `Request failed (HTTP ${response.status}). Please try again.`;
    const err = new Error(message);
    (err as any).status = response.status;
    throw err;
  }
  return data;
}
