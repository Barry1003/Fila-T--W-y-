'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from '@/lib/router';
import AccountShell from '../components/AccountShell';
import { C, DISPLAY, UI, label } from '../tokens';

type Message = {
  id: string;
  sender: 'buyer' | 'support';
  text: string;
  timestamp: string;
};

type Conversation = {
  id: string;
  subject: string;
  order: string | null;
  preview: string;
  date: string;
  unread: boolean;
  messages: Message[];
};

const INITIAL: Conversation[] = [
  {
    id: 'c1',
    subject: 'Question about Order #FTW-10492',
    order: '#FTW-10492',
    preview: "Hi! I wanted to check on my order — has it shipped yet?",
    date: 'Today, 10:42 AM',
    unread: true,
    messages: [
      {
        id: 'm1',
        sender: 'buyer',
        text: "Hi! I wanted to check on my order — has it shipped yet? I placed it about a week ago and haven't received any tracking info.",
        timestamp: 'Today, 10:42 AM',
      },
      {
        id: 'm2',
        sender: 'support',
        text: "Hello Adunola! Thank you for reaching out. Your order #FTW-10492 is currently being prepared and will ship within 1–2 business days. We'll send your tracking number as soon as it's dispatched.",
        timestamp: 'Today, 11:15 AM',
      },
      {
        id: 'm3',
        sender: 'buyer',
        text: "That's great, thank you! Will it arrive before the weekend?",
        timestamp: 'Today, 11:28 AM',
      },
    ],
  },
  {
    id: 'c2',
    subject: 'Sizing help — Igbo Gele',
    order: null,
    preview: "Thank you! We recommend measuring around the fullest part…",
    date: 'Aug 28',
    unread: false,
    messages: [
      {
        id: 'm1',
        sender: 'buyer',
        text: "Hello, I'm interested in the Igbo Gele headwrap but I'm not sure what size to get. I have a 22-inch head circumference.",
        timestamp: 'Aug 28, 2:14 PM',
      },
      {
        id: 'm2',
        sender: 'support',
        text: "Thank you for reaching out! We recommend measuring around the fullest part of your head, just above the ears. For a 22-inch circumference, our Standard size fits perfectly — it has a 7-yard wrap length for plenty of styling options.",
        timestamp: 'Aug 28, 3:30 PM',
      },
      {
        id: 'm3',
        sender: 'buyer',
        text: "Perfect, thank you so much! I'll go ahead and order the Standard.",
        timestamp: 'Aug 28, 3:45 PM',
      },
      {
        id: 'm4',
        sender: 'support',
        text: "Wonderful! If you have any other questions after your order arrives, we're here to help. Enjoy!",
        timestamp: 'Aug 28, 4:00 PM',
      },
    ],
  },
  {
    id: 'c3',
    subject: 'Return request for #FTW-10389',
    order: '#FTW-10389',
    preview: "Your return has been approved. Please use the label…",
    date: 'Aug 19',
    unread: false,
    messages: [
      {
        id: 'm1',
        sender: 'buyer',
        text: "I'd like to return the Aso-Oke shawl from order #FTW-10389. The colour is slightly different from what I expected.",
        timestamp: 'Aug 19, 9:00 AM',
      },
      {
        id: 'm2',
        sender: 'support',
        text: "We're sorry to hear that! Your return has been approved. Please use the prepaid label — pack the item, affix it, and drop it at any Canada Post location. Your refund will be processed within 5–7 business days of receipt.",
        timestamp: 'Aug 19, 10:22 AM',
      },
      {
        id: 'm3',
        sender: 'buyer',
        text: "Thank you for the quick response! I'll drop it off today.",
        timestamp: 'Aug 19, 10:35 AM',
      },
    ],
  },
];

const ORDERS = ['#FTW-10492', '#FTW-10389', '#FTW-10201'];

export default function Support() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL);
  const [activeId, setActiveId] = useState<string | null>('c1');
  const [draft, setDraft] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalSubject, setModalSubject] = useState('');
  const [modalOrder, setModalOrder] = useState('');
  const [modalBody, setModalBody] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const active = conversations.find(c => c.id === activeId) ?? null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages.length]);

  const selectConversation = (id: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: false } : c));
    setActiveId(id);
  };

  const sendMessage = () => {
    if (!draft.trim() || !activeId) return;
    const msg: Message = { id: `m${Date.now()}`, sender: 'buyer', text: draft.trim(), timestamp: 'Just now' };
    setConversations(prev => prev.map(c =>
      c.id === activeId ? { ...c, messages: [...c.messages, msg], preview: draft.trim().slice(0, 64) } : c
    ));
    setDraft('');
  };

  const sendNewMessage = () => {
    if (!modalSubject.trim() || !modalBody.trim()) return;
    const newConv: Conversation = {
      id: `c${Date.now()}`,
      subject: modalSubject.trim(),
      order: modalOrder || null,
      preview: modalBody.trim().slice(0, 64),
      date: 'Just now',
      unread: false,
      messages: [{ id: 'm1', sender: 'buyer', text: modalBody.trim(), timestamp: 'Just now' }],
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveId(newConv.id);
    setShowModal(false);
    setModalSubject('');
    setModalOrder('');
    setModalBody('');
  };

  return (
    <AccountShell>

      {/* ── Page header ──────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: DISPLAY, fontSize: '2rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: '0.3rem' }}>
            Support Inbox
          </h1>
          <p style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.45)', letterSpacing: '0.01em' }}>
            Direct messages with our customer care team
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            ...label,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: C.gold,
            color: C.charcoal,
            border: 'none',
            borderRadius: '6px',
            padding: '0.6rem 1.1rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            fontSize: '0.72rem',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Message
        </button>
      </div>

      {/* ── Empty state ──────────────────────────────────── */}
      {conversations.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: `1px solid rgba(43,35,32,0.09)`, padding: '5rem 2rem', textAlign: 'center' }}>
          <div style={{ color: 'rgba(43,35,32,0.15)', marginBottom: '1.25rem' }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p style={{ fontFamily: DISPLAY, fontSize: '1.3rem', fontWeight: 500, color: C.charcoal, marginBottom: '0.5rem' }}>
            No messages yet
          </p>
          <p style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(43,35,32,0.48)', lineHeight: 1.65, marginBottom: '1.75rem' }}>
            Reach out if you need help with anything — we're here.
          </p>
          <button
            onClick={() => setShowModal(true)}
            style={{ ...label, backgroundColor: C.gold, color: C.charcoal, border: 'none', borderRadius: '6px', padding: '0.65rem 1.5rem', cursor: 'pointer', fontSize: '0.72rem' }}
          >
            New Message
          </button>
        </div>

      ) : (
        /* ── Two-panel layout ─────────────────────────────── */
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          border: `1px solid rgba(43,35,32,0.09)`,
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: '#fff',
          height: 'calc(100vh - 272px)',
          minHeight: '520px',
        }}>

          {/* ── Conversation list ──────────────────── */}
          <div style={{ borderRight: `1px solid rgba(43,35,32,0.09)`, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {conversations.map(conv => {
              const isActive = conv.id === activeId;
              return (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.9rem 1rem',
                    background: isActive ? 'rgba(122,46,56,0.05)' : 'transparent',
                    borderLeft: isActive ? `3px solid ${C.maroon}` : '3px solid transparent',
                    borderRight: 'none',
                    borderTop: 'none',
                    borderBottom: `1px solid rgba(43,35,32,0.07)`,
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(43,35,32,0.025)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.22rem' }}>
                    <span style={{ fontFamily: UI, fontSize: '0.81rem', fontWeight: conv.unread ? 600 : 500, color: C.charcoal, lineHeight: 1.3, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.subject}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                      {conv.unread && (
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: C.gold, flexShrink: 0 }} />
                      )}
                      <span style={{ fontFamily: UI, fontSize: '0.68rem', color: 'rgba(43,35,32,0.36)', whiteSpace: 'nowrap' }}>
                        {conv.date}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontFamily: UI, fontSize: '0.76rem', color: 'rgba(43,35,32,0.44)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.preview}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Message thread ─────────────────────── */}
          {active && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

              {/* Thread header */}
              <div style={{
                padding: '0.875rem 1.25rem',
                borderBottom: `1px solid rgba(43,35,32,0.09)`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexShrink: 0,
                backgroundColor: '#fff',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: UI, fontSize: '0.875rem', fontWeight: 600, color: C.charcoal, marginBottom: active.order ? '0.25rem' : 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {active.subject}
                  </div>
                  {active.order && (
                    <Link
                      to="/account/orders"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.28rem',
                        fontFamily: UI,
                        fontSize: '0.69rem',
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                        color: C.indigo,
                        textDecorationLine: 'none',
                        backgroundColor: 'rgba(46,74,158,0.06)',
                        borderRadius: '4px',
                        padding: '0.18rem 0.5rem',
                        border: `1px solid rgba(46,74,158,0.14)`,
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                      </svg>
                      Order {active.order}
                    </Link>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', minHeight: 0 }}>
                {active.messages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: msg.sender === 'buyer' ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: '0.5rem',
                    }}
                  >
                    {/* Support avatar */}
                    {msg.sender === 'support' && (
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: C.teal,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginBottom: '18px',
                      }}>
                        <span style={{ fontFamily: DISPLAY, fontSize: '0.58rem', color: '#fff', fontWeight: 600, letterSpacing: '0.02em' }}>FT</span>
                      </div>
                    )}

                    <div style={{ maxWidth: '68%', display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'buyer' ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        padding: '0.7rem 1rem',
                        borderRadius: msg.sender === 'buyer' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        backgroundColor: msg.sender === 'buyer' ? C.maroon : 'rgba(43,35,32,0.055)',
                        color: msg.sender === 'buyer' ? C.cream : C.charcoal,
                        fontFamily: UI,
                        fontSize: '0.845rem',
                        lineHeight: 1.58,
                      }}>
                        {msg.text}
                      </div>
                      <span style={{ fontFamily: UI, fontSize: '0.67rem', color: 'rgba(43,35,32,0.36)', marginTop: '0.3rem' }}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Composer */}
              <div style={{
                padding: '0.875rem 1.25rem',
                borderTop: `1px solid rgba(43,35,32,0.09)`,
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-end',
                flexShrink: 0,
                backgroundColor: '#fff',
              }}>
                <button
                  title="Attach file"
                  style={{
                    background: 'none',
                    border: `1px solid rgba(43,35,32,0.14)`,
                    borderRadius: '8px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    color: 'rgba(43,35,32,0.38)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'color 0.12s, border-color 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.charcoal; e.currentTarget.style.borderColor = 'rgba(43,35,32,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(43,35,32,0.38)'; e.currentTarget.style.borderColor = 'rgba(43,35,32,0.14)'; }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                  rows={1}
                  style={{
                    flex: 1,
                    resize: 'none',
                    border: `1px solid rgba(43,35,32,0.14)`,
                    borderRadius: '8px',
                    padding: '0.52rem 0.75rem',
                    fontFamily: UI,
                    fontSize: '0.845rem',
                    color: C.charcoal,
                    backgroundColor: 'rgba(43,35,32,0.02)',
                    outline: 'none',
                    lineHeight: 1.5,
                    overflowY: 'hidden',
                    transition: 'border-color 0.12s',
                  }}
                  onFocus={e => (e.target.style.borderColor = C.gold)}
                  onBlur={e => (e.target.style.borderColor = 'rgba(43,35,32,0.14)')}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    ...label,
                    backgroundColor: draft.trim() ? C.gold : 'rgba(43,35,32,0.08)',
                    color: draft.trim() ? C.charcoal : 'rgba(43,35,32,0.32)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.52rem 1rem',
                    cursor: draft.trim() ? 'pointer' : 'default',
                    fontSize: '0.72rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    flexShrink: 0,
                    transition: 'all 0.12s',
                  }}
                >
                  Send
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── New Message modal ────────────────────────────── */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(43,35,32,0.38)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '520px',
            padding: '2rem',
            boxShadow: '0 24px 64px rgba(43,35,32,0.16)',
          }}>
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: DISPLAY, fontSize: '1.4rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.01em' }}>
                New Message
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(43,35,32,0.35)', padding: '0.25rem', lineHeight: 0, transition: 'color 0.12s' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.charcoal)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(43,35,32,0.35)')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Subject */}
              <div>
                <label style={{ ...label, display: 'block', marginBottom: '0.4rem', color: 'rgba(43,35,32,0.5)', fontSize: '0.66rem' }}>
                  Subject
                </label>
                <input
                  value={modalSubject}
                  onChange={e => setModalSubject(e.target.value)}
                  placeholder="What can we help you with?"
                  style={{
                    width: '100%',
                    border: `1px solid rgba(43,35,32,0.15)`,
                    borderRadius: '8px',
                    padding: '0.65rem 0.875rem',
                    fontFamily: UI,
                    fontSize: '0.875rem',
                    color: C.charcoal,
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.12s',
                  }}
                  onFocus={e => (e.target.style.borderColor = C.gold)}
                  onBlur={e => (e.target.style.borderColor = 'rgba(43,35,32,0.15)')}
                />
              </div>

              {/* Related order */}
              <div>
                <label style={{ ...label, display: 'block', marginBottom: '0.4rem', color: 'rgba(43,35,32,0.5)', fontSize: '0.66rem' }}>
                  Related Order (optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={modalOrder}
                    onChange={e => setModalOrder(e.target.value)}
                    style={{
                      width: '100%',
                      border: `1px solid rgba(43,35,32,0.15)`,
                      borderRadius: '8px',
                      padding: '0.65rem 2rem 0.65rem 0.875rem',
                      fontFamily: UI,
                      fontSize: '0.875rem',
                      color: modalOrder ? C.charcoal : 'rgba(43,35,32,0.38)',
                      backgroundColor: '#fff',
                      outline: 'none',
                      appearance: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="">Select an order…</option>
                    {ORDERS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <svg style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(43,35,32,0.38)' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{ ...label, display: 'block', marginBottom: '0.4rem', color: 'rgba(43,35,32,0.5)', fontSize: '0.66rem' }}>
                  Message
                </label>
                <textarea
                  value={modalBody}
                  onChange={e => setModalBody(e.target.value)}
                  placeholder="Describe your question or issue…"
                  rows={5}
                  style={{
                    width: '100%',
                    border: `1px solid rgba(43,35,32,0.15)`,
                    borderRadius: '8px',
                    padding: '0.65rem 0.875rem',
                    fontFamily: UI,
                    fontSize: '0.875rem',
                    color: C.charcoal,
                    resize: 'vertical',
                    outline: 'none',
                    lineHeight: 1.6,
                    boxSizing: 'border-box',
                    transition: 'border-color 0.12s',
                  }}
                  onFocus={e => (e.target.style.borderColor = C.gold)}
                  onBlur={e => (e.target.style.borderColor = 'rgba(43,35,32,0.15)')}
                />
              </div>

              <button
                onClick={sendNewMessage}
                style={{
                  ...label,
                  backgroundColor: C.gold,
                  color: C.charcoal,
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  width: '100%',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

    </AccountShell>
  );
}
