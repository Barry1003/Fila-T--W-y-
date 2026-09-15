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

export default function Support({
  initialConversations = [],
  orderNumbers = [],
}: {
  initialConversations?: Conversation[];
  orderNumbers?: string[];
}) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(initialConversations[0]?.id ?? null);
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
      <div className="flex items-start justify-between mb-[1.75rem] gap-4 flex-wrap">
        <div>
          <h1 className="mb-[0.3rem] font-medium tracking-[-0.01em] leading-[1.1]" style={{ fontFamily: DISPLAY, fontSize: '2rem', color: C.charcoal }}>
            Support Inbox
          </h1>
          <p className="tracking-[0.01em]" style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.45)' }}>
            Direct messages with our customer care team
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-[0.4rem] py-[0.6rem] px-[1.1rem] shrink-0 whitespace-nowrap cursor-pointer rounded-[6px] border-none transition-opacity duration-150"
          style={{
            ...label,
            backgroundColor: C.gold,
            color: C.charcoal,
            fontSize: '0.72rem',
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
        <div className="py-20 px-8 text-center rounded-[10px] bg-white border border-solid border-[rgba(43,35,32,0.09)]">
          <div className="mb-5 text-[rgba(43,35,32,0.15)]">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="mb-2 font-medium" style={{ fontFamily: DISPLAY, fontSize: '1.3rem', color: C.charcoal }}>
            No messages yet
          </p>
          <p className="mb-7 leading-[1.65]" style={{ fontFamily: UI, fontSize: '0.875rem', color: 'rgba(43,35,32,0.48)' }}>
            Reach out if you need help with anything — we're here.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="py-[0.65rem] px-6 cursor-pointer rounded-[6px] border-none"
            style={{ ...label, backgroundColor: C.gold, color: C.charcoal, fontSize: '0.72rem' }}
          >
            New Message
          </button>
        </div>

      ) : (
        /* ── Two-panel layout ─────────────────────────────── */
        <div className="rg-split h-[calc(100vh-272px)] min-h-[520px] rounded-[10px] overflow-hidden grid grid-cols-[300px_1fr] border border-solid border-[rgba(43,35,32,0.09)] bg-white">
          {/* ── Conversation list ──────────────────── */}
          <div className="flex flex-col overflow-y-auto border-r border-solid border-[rgba(43,35,32,0.09)]">
            {conversations.map(conv => {
              const isActive = conv.id === activeId;
              return (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className="w-full text-left py-[0.9rem] px-4 shrink-0 cursor-pointer border-r-0 border-t-0 border-b border-solid border-b-[rgba(43,35,32,0.07)] transition-colors duration-150"
                  style={{
                    background: isActive ? 'rgba(122,46,56,0.05)' : 'transparent',
                    borderLeft: isActive ? `3px solid ${C.maroon}` : '3px solid transparent',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(43,35,32,0.025)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div className="flex justify-between items-center gap-2 mb-[0.22rem]">
                    <span className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap leading-[1.3] ${conv.unread ? 'font-semibold' : 'font-medium'}`} style={{ fontFamily: UI, fontSize: '0.81rem', color: C.charcoal }}>
                      {conv.subject}
                    </span>
                    <div className="flex items-center gap-[0.35rem] shrink-0">
                      {conv.unread && (
                        <div className="w-[7px] h-[7px] shrink-0 rounded-full" style={{ backgroundColor: C.gold }} />
                      )}
                      <span className="whitespace-nowrap" style={{ fontFamily: UI, fontSize: '0.68rem', color: 'rgba(43,35,32,0.36)' }}>
                        {conv.date}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontFamily: UI, fontSize: '0.76rem', color: 'rgba(43,35,32,0.44)' }}>
                    {conv.preview}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Message thread ─────────────────────── */}
          {active && (
            <div className="flex flex-col h-full min-h-0">

              {/* Thread header */}
              <div className="flex items-center gap-3 py-[0.875rem] px-5 shrink-0 border-b border-solid border-[rgba(43,35,32,0.09)] bg-white">
                <div className="flex-1 min-w-0">
                  <div className={`overflow-hidden text-ellipsis whitespace-nowrap font-semibold ${active.order ? 'mb-1' : ''}`} style={{ fontFamily: UI, fontSize: '0.875rem', color: C.charcoal }}>
                    {active.subject}
                  </div>
                  {active.order && (
                    <Link
                      to="/account/orders"
                      className="inline-flex items-center gap-[0.28rem] py-[0.18rem] px-2 rounded-[4px] no-underline font-medium tracking-[0.04em] border border-solid border-[rgba(46,74,158,0.14)] bg-[rgba(46,74,158,0.06)]"
                      style={{
                        fontFamily: UI,
                        fontSize: '0.69rem',
                        color: C.indigo,
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
              <div className="flex-1 overflow-y-auto py-6 px-5 flex flex-col gap-[1.1rem] min-h-0">
                {active.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.sender === 'buyer' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Support avatar */}
                    {msg.sender === 'support' && (
                      <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mb-[18px]" style={{
                        backgroundColor: C.teal,
                      }}>
                        <span className="font-semibold tracking-[0.02em]" style={{ fontFamily: DISPLAY, fontSize: '0.58rem', color: '#fff' }}>FT</span>
                      </div>
                    )}

                    <div className={`max-w-[68%] flex flex-col ${msg.sender === 'buyer' ? 'items-end' : 'items-start'}`}>
                      <div className={`py-[0.7rem] px-4 leading-[1.58] ${msg.sender === 'buyer' ? 'rounded-[14px_14px_4px_14px]' : 'rounded-[14px_14px_14px_4px]'}`} style={{
                        backgroundColor: msg.sender === 'buyer' ? C.maroon : 'rgba(43,35,32,0.055)',
                        color: msg.sender === 'buyer' ? C.cream : C.charcoal,
                        fontFamily: UI,
                        fontSize: '0.845rem',
                      }}>
                        {msg.text}
                      </div>
                      <span className="mt-[0.3rem]" style={{ fontFamily: UI, fontSize: '0.67rem', color: 'rgba(43,35,32,0.36)' }}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Composer */}
              <div className="flex items-end gap-2 py-[0.875rem] px-5 shrink-0 border-t border-solid border-[rgba(43,35,32,0.09)] bg-white">
                <button
                  title="Attach file"
                  className="flex items-center justify-center shrink-0 p-2 rounded-lg cursor-pointer bg-none border border-solid transition-colors duration-150"
                  style={{
                    borderColor: 'rgba(43,35,32,0.14)',
                    color: 'rgba(43,35,32,0.38)',
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
                  className="flex-1 py-[0.52rem] px-3 rounded-lg overflow-y-hidden outline-none resize-none border border-solid border-[rgba(43,35,32,0.14)] bg-[rgba(43,35,32,0.02)] leading-[1.5] transition-colors duration-150"
                  style={{
                    fontFamily: UI,
                    fontSize: '0.845rem',
                    color: C.charcoal,
                  }}
                  onFocus={e => (e.target.style.borderColor = C.gold)}
                  onBlur={e => (e.target.style.borderColor = 'rgba(43,35,32,0.14)')}
                />
                <button
                  onClick={sendMessage}
                  className={`flex items-center gap-[0.35rem] shrink-0 py-[0.52rem] px-4 rounded-lg border-none transition-all duration-150 ${draft.trim() ? 'cursor-pointer' : 'cursor-default'}`}
                  style={{
                    ...label,
                    backgroundColor: draft.trim() ? C.gold : 'rgba(43,35,32,0.08)',
                    color: draft.trim() ? C.charcoal : 'rgba(43,35,32,0.32)',
                    fontSize: '0.72rem',
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(43,35,32,0.38)]"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="w-full max-w-[520px] p-8 rounded-[12px] bg-white shadow-[0_24px_64px_rgba(43,35,32,0.16)]">
            {/* Modal header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-medium tracking-[-0.01em]" style={{ fontFamily: DISPLAY, fontSize: '1.4rem', color: C.charcoal }}>
                New Message
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 cursor-pointer bg-none border-none leading-none transition-colors duration-150"
                style={{ color: 'rgba(43,35,32,0.35)' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.charcoal)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(43,35,32,0.35)')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-[1.1rem]">
              {/* Subject */}
              <div>
                <label className="block mb-[0.4rem]" style={{ ...label, color: 'rgba(43,35,32,0.5)', fontSize: '0.66rem' }}>
                  Subject
                </label>
                <input
                  value={modalSubject}
                  onChange={e => setModalSubject(e.target.value)}
                  placeholder="What can we help you with?"
                  className="w-full py-[0.65rem] px-[0.875rem] rounded-lg box-border outline-none border border-solid border-[rgba(43,35,32,0.15)] transition-colors duration-150"
                  style={{
                    fontFamily: UI,
                    fontSize: '0.875rem',
                    color: C.charcoal,
                  }}
                  onFocus={e => (e.target.style.borderColor = C.gold)}
                  onBlur={e => (e.target.style.borderColor = 'rgba(43,35,32,0.15)')}
                />
              </div>

              {/* Related order */}
              <div>
                <label className="block mb-[0.4rem]" style={{ ...label, color: 'rgba(43,35,32,0.5)', fontSize: '0.66rem' }}>
                  Related Order (optional)
                </label>
                <div className="relative">
                  <select
                    value={modalOrder}
                    onChange={e => setModalOrder(e.target.value)}
                    className="w-full py-[0.65rem] pl-[0.875rem] pr-8 rounded-lg outline-none appearance-none cursor-pointer box-border border border-solid border-[rgba(43,35,32,0.15)] bg-white"
                    style={{
                      fontFamily: UI,
                      fontSize: '0.875rem',
                      color: modalOrder ? C.charcoal : 'rgba(43,35,32,0.38)',
                    }}
                  >
                    <option value="">Select an order…</option>
                    {orderNumbers.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(43,35,32,0.38)' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block mb-[0.4rem]" style={{ ...label, color: 'rgba(43,35,32,0.5)', fontSize: '0.66rem' }}>
                  Message
                </label>
                <textarea
                  value={modalBody}
                  onChange={e => setModalBody(e.target.value)}
                  placeholder="Describe your question or issue…"
                  rows={5}
                  className="w-full py-[0.65rem] px-[0.875rem] rounded-lg box-border outline-none resize-y leading-[1.6] border border-solid border-[rgba(43,35,32,0.15)] transition-colors duration-150"
                  style={{
                    fontFamily: UI,
                    fontSize: '0.875rem',
                    color: C.charcoal,
                  }}
                  onFocus={e => (e.target.style.borderColor = C.gold)}
                  onBlur={e => (e.target.style.borderColor = 'rgba(43,35,32,0.15)')}
                />
              </div>

              <button
                onClick={sendNewMessage}
                className="w-full py-3 px-6 rounded-lg cursor-pointer border-none transition-opacity duration-150"
                style={{
                  ...label,
                  backgroundColor: C.gold,
                  color: C.charcoal,
                  fontSize: '0.72rem',
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
