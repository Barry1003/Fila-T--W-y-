/**
 * Neon's serverless driver reaches Postgres over a WebSocket, and that socket
 * can drop — the compute sleeps when idle, and a dropped connection surfaces as
 * a DOM ErrorEvent carrying no error code. A single dropped socket should not
 * lose an owner's edit, so database work goes through here.
 */

const RETRYABLE_CODES = new Set(['ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED', 'EPIPE']);

function isTransient(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  if (code && RETRYABLE_CODES.has(code)) return true;
  // The driver's dropped-socket ErrorEvent has a `type` of 'error' and no code.
  if ((error as { type?: string } | null)?.type === 'error') return true;
  // The HTTP transport reports a waking compute as a NeonDbError, which carries
  // neither a code nor a type — only the constructor name distinguishes it.
  return (error as object | null)?.constructor?.name === 'NeonDbError';
}

/**
 * The retry schedule, in milliseconds to wait *after* a failed attempt.
 *
 * These numbers come from measurement, not guesswork. Forcing a suspend and
 * timing the wake gave 2.6s, 9.4s, 10.5s and 22.2s across four cold starts —
 * so a wake is not "roughly two seconds" but anything up to about half a
 * minute, and a budget that covers the median still fails a quarter of the
 * time. The schedule below spans ~27s, which covered every wake observed.
 *
 * Waits start at a full second because nothing is gained by asking again
 * 250ms into a wake that has seconds left to run; each early retry just burns
 * an attempt against a compute that cannot answer yet.
 */
const BACKOFF_MS = [1000, 2000, 3000, 4000, 5000, 6000, 6000];

/**
 * Note for deployment: this budget can outlive a serverless function timeout
 * (10s on Vercel Hobby, 15s on Pro by default). Where the platform kills the
 * request first, raise `maxDuration` on the route or the retry never finishes.
 */
export async function withDbRetry<T>(
  operation: string,
  fn: () => Promise<T>,
  attempts = BACKOFF_MS.length + 1,
): Promise<T> {
  const started = Date.now();

  for (let attempt = 1; ; attempt++) {
    try {
      const result = await fn();
      if (attempt > 1) {
        console.warn(`[db] ${operation} recovered on attempt ${attempt} after ${Date.now() - started}ms`);
      }
      return result;
    } catch (error) {
      if (!isTransient(error) || attempt >= attempts) throw error;
      const wait = BACKOFF_MS[Math.min(attempt - 1, BACKOFF_MS.length - 1)];
      console.warn(`[db] ${operation} hit a transient error (${attempt}/${attempts}), retrying in ${wait}ms`);
      await new Promise(resolve => setTimeout(resolve, wait));
    }
  }
}
