import 'server-only';
import { Resend } from 'resend';

/**
 * Transactional email, or a no-op when RESEND_API_KEY is not set.
 *
 * Null-safe like the other integrations: without a key the app still runs and
 * callers just get `{ ok: false, skipped: true }` — a support message is saved
 * to the database regardless, so nothing is lost when email is unconfigured.
 *
 * Set RESEND_API_KEY (and optionally EMAIL_FROM / OWNER_EMAIL) to turn it on.
 */

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

/** Whether transactional email is configured. */
export const emailEnabled = !!resend;

/** Verified sender. Resend's shared onboarding address works for testing; use a
 *  verified domain address in production. */
const FROM = process.env.EMAIL_FROM || 'AdeClassics <onboarding@resend.dev>';

/** Where owner notifications go. Falls back to the console-owner address. */
function ownerAddress(): string | null {
  return process.env.OWNER_EMAIL?.trim() || null;
}

export type SendResult = { ok: true; id?: string } | { ok: false; skipped?: boolean; message?: string };

/** Emails the store owner. Returns `{ ok:false, skipped:true }` when email is off. */
export async function sendOwnerEmail(opts: {
  subject: string;
  /** Plain-text body; also wrapped in a minimal HTML shell. */
  text: string;
  /** Optional Reply-To so the owner can reply straight to the customer. */
  replyTo?: string;
}): Promise<SendResult> {
  if (!resend) return { ok: false, skipped: true };
  const to = ownerAddress();
  if (!to) return { ok: false, message: 'OWNER_EMAIL is not set.' };

  try {
    const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#2b2320">${opts.text
      .split('\n')
      .map(l => (l.trim() ? `<p style="margin:0 0 0.6rem">${escapeHtml(l)}</p>` : '<br/>'))
      .join('')}</div>`;

    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject: opts.subject,
      text: opts.text,
      html,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, id: data?.id };
  } catch (error) {
    console.error('[email] send failed', error);
    return { ok: false, message: 'Email send failed.' };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
