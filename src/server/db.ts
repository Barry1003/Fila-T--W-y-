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
  return (error as { type?: string } | null)?.type === 'error';
}

/**
 * Neon suspends idle computes, and waking one takes upwards of two seconds —
 * longer than a tight retry budget, so the first request after a quiet spell
 * would fail even though the database is healthy. The schedule below spans
 * roughly nine seconds, which covers a cold start without leaving a genuinely
 * broken page hanging.
 */
export async function withDbRetry<T>(operation: string, fn: () => Promise<T>, attempts = 6): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (!isTransient(error) || attempt >= attempts) throw error;
      const wait = Math.min(2 ** attempt * 250, 3000);
      console.warn(`[db] ${operation} hit a transient error (${attempt}/${attempts}), retrying in ${wait}ms`);
      await new Promise(resolve => setTimeout(resolve, wait));
    }
  }
}
