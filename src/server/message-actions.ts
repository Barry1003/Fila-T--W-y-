'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';
import { getCurrentUser } from './auth';

/** Owner actions on customer conversations. Owner-gated. */

export type MessageActionResult = { ok: true } | { ok: false; message: string };

async function requireOwner() {
  const user = await getCurrentUser().catch(() => null);
  return user?.role === 'OWNER';
}

/** Posts an owner reply into a conversation. */
export async function sendConsoleMessage(conversationId: string, body: string): Promise<MessageActionResult> {
  if (!(await requireOwner())) return { ok: false, message: 'You do not have permission to reply.' };
  const text = body.trim();
  if (!text) return { ok: false, message: 'Message cannot be empty.' };

  try {
    await withDbRetry('send message', () =>
      prisma.$transaction([
        prisma.message.create({
          data: { conversationId, sender: 'STORE', body: text },
        }),
        // Touch the conversation so it rises to the top and clears its unread flag.
        prisma.conversation.update({
          where: { id: conversationId },
          data: { unread: false },
        }),
      ])
    );
    revalidatePath('/console/messages');
    return { ok: true };
  } catch (error) {
    console.error('[message send] failed', error);
    return { ok: false, message: 'Could not send your message just now. Please try again.' };
  }
}

/** Marks a conversation resolved or reopens it. */
export async function setConversationResolved(
  conversationId: string,
  resolved: boolean
): Promise<MessageActionResult> {
  if (!(await requireOwner())) return { ok: false, message: 'You do not have permission to do that.' };

  try {
    await withDbRetry('resolve conversation', () =>
      prisma.conversation.update({ where: { id: conversationId }, data: { resolved } })
    );
    revalidatePath('/console/messages');
    return { ok: true };
  } catch (error) {
    console.error('[conversation resolve] failed', error);
    return { ok: false, message: 'Could not update the conversation just now. Please try again.' };
  }
}

/** Clears a conversation's unread flag when the owner opens it. */
export async function markConversationRead(conversationId: string): Promise<MessageActionResult> {
  if (!(await requireOwner())) return { ok: false, message: 'Unauthorized' };

  try {
    await withDbRetry('mark conversation read', () =>
      prisma.conversation.update({ where: { id: conversationId }, data: { unread: false } })
    );
    revalidatePath('/console/messages');
    return { ok: true };
  } catch (error) {
    console.error('[conversation read] failed', error);
    return { ok: false, message: 'Could not update the conversation.' };
  }
}
