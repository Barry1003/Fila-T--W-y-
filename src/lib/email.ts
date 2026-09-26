import 'server-only';
import { Resend } from 'resend';
import { siteUrl } from './site';

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
 *  verified domain address (e.g. "AdeClassics <Help@adeclassics.ca>") in
 *  production. */
const FROM = process.env.EMAIL_FROM || 'AdeClassics <onboarding@resend.dev>';

/** Where owner notifications go. Falls back to the console-owner address. */
function ownerAddress(): string | null {
  return process.env.OWNER_EMAIL?.trim() || null;
}

export type SendResult = { ok: true; id?: string } | { ok: false; skipped?: boolean; message?: string };

/**
 * The branded HTML shell — the AdeClassics logo on a maroon header, the message
 * body, and a small footer. Exported so a test send or any other sender renders
 * the identical email.
 *
 * The logo is loaded from the live site (`/logo-loader.png`) by absolute URL, so
 * it resolves the same way in every mail client.
 */
export function renderBrandedEmail(subject: string, text: string): string {
  const site = siteUrl();
  const logo = `${site}/logo-loader.png`;
  const host = site.replace(/^https?:\/\//, '');
  const body = text
    .split('\n')
    .map(line =>
      line.trim()
        ? `<p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#2b2320">${escapeHtml(line)}</p>`
        : '<div style="height:6px;line-height:6px">&nbsp;</div>'
    )
    .join('');

  return `<div style="margin:0;padding:24px 12px;background:#f2ede6;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
  <table role="presentation" align="center" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;margin:0 auto;background:#ffffff;border:1px solid #e7dfd5;border-radius:14px;overflow:hidden">
    <tr>
      <td style="background:#7A2E38;padding:24px 24px;text-align:center">
        <img src="${logo}" width="160" alt="AdeClassics — Timeless Elegance" style="display:inline-block;width:160px;max-width:70%;height:auto;border:0;outline:none;text-decoration:none" />
      </td>
    </tr>
    <tr>
      <td style="padding:28px 30px 4px">
        <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#D4A94E;font-weight:600;margin:0 0 8px">AdeClassics</div>
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:600;color:#2b2320;margin:0 0 16px;line-height:1.28">${escapeHtml(subject)}</h1>
        ${body}
      </td>
    </tr>
    <tr>
      <td style="padding:14px 30px 30px">
        <div style="border-top:1px solid #efe6db;margin-top:8px;padding-top:16px;font-size:12px;line-height:1.6;color:#9b8f86">
          AdeClassics &middot; Timeless Elegance<br/>
          <a href="${site}" style="color:#7A2E38;text-decoration:none">${escapeHtml(host)}</a>
        </div>
      </td>
    </tr>
  </table>
</div>`;
}

/** Sends one branded email to any address. No-op when email is unconfigured. */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  /** Plain-text body; also wrapped in the branded HTML shell. */
  text: string;
  replyTo?: string;
}): Promise<SendResult> {
  if (!resend) return { ok: false, skipped: true };
  if (!opts.to.trim()) return { ok: false, message: 'No recipient address.' };

  try {
    const html = renderBrandedEmail(opts.subject, opts.text);

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: opts.to,
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

/** Emails the store owner (OWNER_EMAIL). Returns `{ ok:false, skipped:true }` when email is off. */
export async function sendOwnerEmail(opts: {
  subject: string;
  text: string;
  /** Optional Reply-To so the owner can reply straight to the customer. */
  replyTo?: string;
}): Promise<SendResult> {
  const to = ownerAddress();
  if (!to) return { ok: false, message: 'OWNER_EMAIL is not set.' };
  return sendEmail({ to, ...opts });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
