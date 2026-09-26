'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { getCurrentUser } from './auth';
import { sendOwnerEmail } from '@/lib/email';

/**
 * Customer support messaging. A signed-in customer opens a conversation or
 * replies to one; every message is saved to the database (so it shows in the
 * owner console's Messages tab) and, when email is configured, the owner is
 * notified by email with the customer's address as Reply-To.
 */

export type SupportResult =
  | { ok: true; conversationId: string }
  | { ok: false; message: string };

const MAX_SUBJECT = 160;
const MAX_BODY = 4000;

/** Opens a new support conversation. */
export async function createSupportConversation(data: {
  subject: string;
  orderNumber?: string | null;
  body: string;
}): Promise<SupportResult> {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return { ok: false, message: 'Please sign in to contact support.' };

  const subject = data.subject.trim().slice(0, MAX_SUBJECT);
  const body = data.body.trim().slice(0, MAX_BODY);
  if (!subject) return { ok: false, message: 'Add a subject.' };
  if (!body) return { ok: false, message: 'Write your message.' };

  try {
    // Link to an order if the customer picked one (and it is theirs).
    let orderId: string | null = null;
    if (data.orderNumber) {
      const order = await withDbRetry('support: find order', () =>
        prisma.order.findFirst({ where: { number: data.orderNumber!, userId: user.id }, select: { id: true } })
      );
      orderId = order?.id ?? null;
    }

    const conversation = await withDbRetry('support: create conversation', () =>
      prisma.conversation.create({
        data: {
          userId: user.id,
          orderId,
          customerName: user.name,
          customerEmail: user.email,
          subject,
          tag: orderId ? 'ORDER' : 'GENERAL',
          unread: true,
          resolved: false,
          messages: { create: [{ sender: 'CUSTOMER', body }] },
        },
        select: { id: true },
      })
    );

    // Best-effort owner notification; a failed email must not lose the message.
    await sendOwnerEmail({
      subject: `New support message: ${subject}`,
      text: `From: ${user.name} <${user.email}>\n${data.orderNumber ? `Order: ${data.orderNumber}\n` : ''}\n${body}\n\n— View in the console: /console/messages`,
      replyTo: user.email,
    }).catch(() => {});

    revalidatePath('/console/messages');
    revalidatePath('/account/support');
    return { ok: true, conversationId: conversation.id };
  } catch (error) {
    console.error('[support] create failed', error);
    return { ok: false, message: 'Could not send your message just now. Please try again.' };
  }
}

/** Appends a customer reply to one of their conversations. */
export async function replyToSupport(conversationId: string, body: string): Promise<SupportResult> {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return { ok: false, message: 'Please sign in.' };

  const text = body.trim().slice(0, MAX_BODY);
  if (!text) return { ok: false, message: 'Write your message.' };

  try {
    // Only the conversation's owner may append to it.
    const convo = await withDbRetry('support: load conversation', () =>
      prisma.conversation.findFirst({ where: { id: conversationId, userId: user.id }, select: { id: true, subject: true } })
    );
    if (!convo) return { ok: false, message: 'Conversation not found.' };

    await withDbRetry('support: reply', () =>
      prisma.$transaction([
        prisma.message.create({ data: { conversationId, sender: 'CUSTOMER', body: text } }),
        prisma.conversation.update({ where: { id: conversationId }, data: { unread: true, resolved: false } }),
      ])
    );

    await sendOwnerEmail({
      subject: `Support reply: ${convo.subject}`,
      text: `From: ${user.name} <${user.email}>\n\n${text}\n\n— View in the console: /console/messages`,
      replyTo: user.email,
    }).catch(() => {});

    revalidatePath('/console/messages');
    revalidatePath('/account/support');
    return { ok: true, conversationId };
  } catch (error) {
    console.error('[support] reply failed', error);
    return { ok: false, message: 'Could not send your reply just now. Please try again.' };
  }
}
