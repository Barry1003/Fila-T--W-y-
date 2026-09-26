import 'server-only';
import { prisma } from '@/lib/prisma';
import { withDbRetry } from './db';

/** Read model for the customer's own support inbox (/account/support). */

export type SupportMessage = { id: string; sender: 'buyer' | 'support'; text: string; timestamp: string };
export type SupportConversation = {
  id: string;
  subject: string;
  order: string | null;
  preview: string;
  date: string;
  unread: boolean;
  messages: SupportMessage[];
};

function fmt(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
}

/** The signed-in customer's conversations, newest first. */
export async function listMyConversations(userId: string): Promise<SupportConversation[]> {
  const rows = await withDbRetry('support: list my conversations', () =>
    prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        order: { select: { number: true } },
        messages: { orderBy: { sentAt: 'asc' } },
      },
    })
  );

  return rows.map(c => {
    const last = c.messages[c.messages.length - 1];
    return {
      id: c.id,
      subject: c.subject,
      order: c.order?.number ?? null,
      preview: last ? last.body.slice(0, 72) : '',
      date: fmt(c.updatedAt),
      // For the customer, "unread" means support replied since — i.e. the last
      // message is from the store.
      unread: last?.sender === 'STORE',
      messages: c.messages.map(m => ({
        id: m.id,
        sender: m.sender === 'CUSTOMER' ? 'buyer' : 'support',
        text: m.body,
        timestamp: fmt(m.sentAt),
      })),
    };
  });
}
