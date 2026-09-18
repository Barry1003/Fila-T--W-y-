'use client';

import { useState, useRef, useEffect } from "react";
import { C, UI } from "../../tokens";
import type { ConsoleConversation as Conversation, ConsoleMessage as Message } from "@/server/console";

// ── Types ─────────────────────────────────────────────────────────────────────

type ConvTag = "order" | "custom" | null;
type Filter = "all" | "unread" | "order" | "custom";


const QUICK_REPLIES = [
  "Thanks for reaching out!",
  "Your order has shipped.",
  "We'll look into this right away.",
  "Please send your measurements.",
  "Happy to help with a return.",
];

const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  unread: "Unread",
  order: "Order-Related",
  custom: "Custom Order",
};

// ── Inline icons ──────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4 7.55 4.24" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

// ── Customer initial avatar ────────────────────────────────────────────────────

function CustomerAvatar({ name, size = 28 }: { name: string; size?: number }) {
  const initial = name.charAt(0).toUpperCase();
  const colors = [
    "rgba(59,138,147,0.18)",
    "rgba(46,74,158,0.15)",
    "rgba(122,46,56,0.12)",
    "rgba(212,169,78,0.2)",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const textColor = [C.teal, "#2E4A9E", C.maroon, "#8A6818"][name.charCodeAt(0) % 4];
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-bold tracking-[0.02em]"
      style={{
        width: size, height: size,
        backgroundColor: color,
        color: textColor,
        fontSize: `${size * 0.38}px`,
        fontFamily: UI,
      }}
    >
      {initial}
    </div>
  );
}

// ── Tag chip ──────────────────────────────────────────────────────────────────

function TagChip({ tag, tagLabel }: { tag: ConvTag; tagLabel?: string }) {
  if (!tag) return null;
  const isOrder = tag === "order";
  return (
    <span
      className="inline-flex items-center gap-[3px] font-medium px-[6px] py-[1px] rounded whitespace-nowrap tracking-[0.01em] border border-solid"
      style={{
        fontSize: "0.62rem",
        backgroundColor: isOrder ? "rgba(46,74,158,0.08)" : "rgba(212,169,78,0.12)",
        color: isOrder ? "#2E4A9E" : "#8A6818",
        borderColor: isOrder ? "rgba(46,74,158,0.14)" : "rgba(212,169,78,0.22)",
      }}
    >
      {isOrder ? <PackageIcon /> : <PenIcon />}
      {tagLabel ?? (isOrder ? "Order" : "Custom Request")}
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ConsoleMessages({ conversations = [] }: { conversations?: Conversation[] }) {
  const [convs, setConvs] = useState<Conversation[]>(conversations);
  const [activeId, setActiveId] = useState<string>(conversations[0]?.id ?? "");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const active = convs.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length, activeId]);

  // Filter + search
  const filtered = convs.filter((c) => {
    const matchFilter =
      filter === "all" ||
      (filter === "unread" && c.unread) ||
      (filter === "order" && c.tag === "order") ||
      (filter === "custom" && c.tag === "custom");
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.customerName.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const filterCounts: Record<Filter, number> = {
    all: convs.length,
    unread: convs.filter((c) => c.unread).length,
    order: convs.filter((c) => c.tag === "order").length,
    custom: convs.filter((c) => c.tag === "custom").length,
  };

  function selectConv(id: string) {
    setConvs((prev) => prev.map((c) => (c.id === id ? { ...c, unread: false } : c)));
    setActiveId(id);
    setDraft("");
  }

  function sendMessage() {
    if (!draft.trim() || !activeId) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      sender: "owner",
      text: draft.trim(),
      timestamp: "Just now",
    };
    setConvs((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, msg], preview: draft.trim().slice(0, 64) }
          : c
      )
    );
    setDraft("");
  }

  function markResolved(id: string) {
    setConvs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c))
    );
  }

  // Approximate panel height: 100vh minus shell top bar (52px) and page header (~130px)
  const panelHeight = "calc(100vh - 200px)";

  return (
    <div className="console-page p-7 flex flex-col gap-4" style={{ fontFamily: UI }}>

      {/* ── Header row ────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-semibold m-0 tracking-[-0.02em]" style={{ fontFamily: UI, fontSize: "1.35rem", color: C.charcoal }}>
            Messages
          </h1>
          <p className="m-[4px_0_0]" style={{ fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.45)" }}>
            Customer conversations and support threads
          </p>
        </div>

        {/* Filter dropdown */}
        <div className="relative inline-flex items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            className="font-medium bg-white rounded-md cursor-pointer outline-none appearance-none border border-solid border-[rgba(43,35,32,0.16)] py-2 pl-[0.875rem] pr-9"
            style={{
              fontFamily: UI,
              fontSize: "0.8rem",
              color: C.charcoal,
            }}
          >
            {(["all", "unread", "order", "custom"] as Filter[]).map((f) => (
              <option key={f} value={f}>
                {FILTER_LABELS[f]} ({filterCounts[f]})
              </option>
            ))}
          </select>
          <span className="absolute right-[0.625rem] pointer-events-none leading-none" style={{ color: "rgba(43,35,32,0.4)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {/* ── Two-panel layout ─────────────────────────── */}
      <div className="rg-split console-messages bg-white rounded-[10px] overflow-hidden border border-solid border-[rgba(43,35,32,0.09)] min-h-[520px] grid grid-cols-[288px_1fr]"
        style={{
          height: panelHeight,
        }}
      >
        {/* ── Left: conversation list ─────────────────── */}
        <div className="flex flex-col overflow-hidden border-r border-solid border-[rgba(43,35,32,0.09)]"
        >
          {/* Search */}
          <div className="p-[0.875rem] shrink-0 border-b border-solid border-[rgba(43,35,32,0.07)]">
            <div className="relative">
              <span className="absolute left-[0.625rem] top-1/2 -translate-y-1/2 leading-none" style={{ color: "rgba(43,35,32,0.32)" }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-md outline-none box-border transition-colors duration-150 py-[0.48rem] pr-[0.625rem] pl-[2rem] border border-solid border-[rgba(43,35,32,0.12)] bg-[rgba(43,35,32,0.025)]"
                style={{
                  fontSize: "0.78rem",
                  fontFamily: UI,
                  color: C.charcoal,
                }}
                onFocus={(e) => (e.target.style.borderColor = C.gold)}
                onBlur={(e) => (e.target.style.borderColor = "rgba(43,35,32,0.12)")}
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-[2rem_1rem] text-center">
                <p className="m-0" style={{ fontSize: "0.82rem", color: "rgba(43,35,32,0.4)" }}>No conversations found</p>
              </div>
            ) : (
              filtered.map((conv) => {
                const isActive = conv.id === activeId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => selectConv(conv.id)}
                    className="w-full text-left p-[0.875rem_0.875rem_0.875rem_0] cursor-pointer flex gap-[0.625rem] items-start transition-colors duration-150 border-none border-b border-solid border-b-[rgba(43,35,32,0.06)] border-l-[3px]"
                    style={{
                      background: isActive ? "rgba(212,169,78,0.07)" : "transparent",
                      borderLeftColor: isActive ? C.gold : "transparent",
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(43,35,32,0.025)"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div className="pl-3">
                      <CustomerAvatar name={conv.customerName} size={32} />
                    </div>

                    <div className="flex-1 min-w-0 pr-3">
                      {/* Name + timestamp row */}
                      <div className="flex justify-between items-center gap-1 mb-[2px]">
                        <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: "0.8rem", fontWeight: conv.unread ? 700 : 500, color: C.charcoal }}>
                          {conv.customerName}
                        </span>
                        <div className="flex items-center gap-[5px] shrink-0">
                          {conv.unread && (
                            <span className="w-[7px] h-[7px] rounded-full block shrink-0" style={{ backgroundColor: C.gold }} />
                          )}
                          <span className="whitespace-nowrap" style={{ fontSize: "0.65rem", color: "rgba(43,35,32,0.35)" }}>{conv.date}</span>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="mb-[3px] whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: "0.75rem", fontWeight: conv.unread ? 600 : 400, color: conv.unread ? C.charcoal : "rgba(43,35,32,0.6)" }}>
                        {conv.subject}
                      </div>

                      {/* Preview + tag row */}
                      <div className="flex items-center justify-between gap-[0.375rem]">
                        <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.42)" }}>
                          {conv.preview}
                        </span>
                        {conv.tag && <TagChip tag={conv.tag} tagLabel={conv.tagLabel} />}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right: message thread ───────────────────── */}
        {active ? (
          <div className="flex flex-col h-full min-h-0">

            {/* Thread header */}
            <div
              className="p-[0.875rem_1.25rem] flex items-center gap-3 shrink-0 bg-white border-b border-solid border-[rgba(43,35,32,0.09)]"
            >
              <CustomerAvatar name={active.customerName} size={34} />

              <div className="flex-1 min-w-0">
                <div className="font-semibold mb-[3px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: "0.875rem", color: C.charcoal }}>
                  {active.customerName}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.45)" }}>
                    {active.subject}
                  </span>
                  {active.tag && <TagChip tag={active.tag} tagLabel={active.tagLabel} />}
                </div>
              </div>

              {/* Resolved toggle */}
              <button
                onClick={() => markResolved(active.id)}
                className="inline-flex items-center gap-[5px] rounded-md px-[0.75rem] py-[0.38rem] font-medium cursor-pointer shrink-0 transition-all duration-150 whitespace-nowrap border-[1.5px] border-solid"
                style={{
                  borderColor: active.resolved ? C.teal : "rgba(43,35,32,0.18)",
                  backgroundColor: active.resolved ? "rgba(59,138,147,0.08)" : "transparent",
                  color: active.resolved ? C.teal : "rgba(43,35,32,0.55)",
                  fontSize: "0.74rem",
                  fontFamily: UI,
                }}
              >
                <CheckIcon />
                {active.resolved ? "Resolved" : "Mark Resolved"}
              </button>
            </div>

            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto p-[1.375rem_1.25rem] flex flex-col gap-[1.1rem] min-h-0 bg-[rgba(43,35,32,0.012)]"
            >
              {active.messages.map((msg) => {
                const isOwner = msg.sender === "owner";
                return (
                  <div
                    key={msg.id}
                    className="flex items-end gap-2"
                    style={{
                      flexDirection: isOwner ? "row-reverse" : "row",
                    }}
                  >
                    {/* Avatars */}
                    {isOwner ? (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-[18px] font-bold tracking-[0.03em]"
                        style={{
                          backgroundColor: C.gold,
                          color: C.charcoal,
                          fontSize: "0.55rem",
                        }}
                      >
                        AO
                      </div>
                    ) : (
                      <div className="mb-[18px] shrink-0">
                        <CustomerAvatar name={active.customerName} size={28} />
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className="max-w-[68%] flex flex-col"
                      style={{
                        alignItems: isOwner ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        className="px-4 py-[0.7rem]"
                        style={{
                          borderRadius: isOwner ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                          backgroundColor: isOwner ? C.maroon : "rgba(43,35,32,0.06)",
                          color: isOwner ? C.cream : C.charcoal,
                          fontFamily: UI,
                          fontSize: "0.845rem",
                          lineHeight: 1.58,
                        }}
                      >
                        {msg.text}
                      </div>
                      <span className="mt-[0.3rem]" style={{ fontFamily: UI, fontSize: "0.67rem", color: "rgba(43,35,32,0.35)" }}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick-reply templates */}
            <div
              className="p-[0.625rem_1.25rem_0] flex gap-[0.4rem] flex-wrap bg-white border-t border-solid border-[rgba(43,35,32,0.06)]"
            >
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => setDraft((prev) => (prev ? prev + " " + reply : reply))}
                  className="rounded-full px-[10px] py-[3px] cursor-pointer whitespace-nowrap transition-colors duration-150 bg-[rgba(43,35,32,0.04)] border border-solid border-[rgba(43,35,32,0.12)]"
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(43,35,32,0.65)",
                    fontFamily: UI,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,169,78,0.1)"; e.currentTarget.style.borderColor = "rgba(212,169,78,0.25)"; e.currentTarget.style.color = "#8A6818"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(43,35,32,0.04)"; e.currentTarget.style.borderColor = "rgba(43,35,32,0.12)"; e.currentTarget.style.color = "rgba(43,35,32,0.65)"; }}
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Composer */}
            <div
              className="p-[0.625rem_1.25rem_1rem] flex gap-2 items-end shrink-0 bg-white"
            >
              <button
                title="Attach file"
                className="bg-none rounded-lg p-2 cursor-pointer flex items-center justify-center shrink-0 transition-colors duration-150 border border-solid border-[rgba(43,35,32,0.14)]"
                style={{
                  color: "rgba(43,35,32,0.35)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.charcoal; e.currentTarget.style.borderColor = "rgba(43,35,32,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(43,35,32,0.35)"; e.currentTarget.style.borderColor = "rgba(43,35,32,0.14)"; }}
              >
                <AttachIcon />
              </button>

              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Reply to customer… (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="flex-1 resize-none rounded-lg p-[0.52rem_0.75rem] outline-none transition-colors duration-150 overflow-y-hidden box-border border border-solid border-[rgba(43,35,32,0.14)] bg-[rgba(43,35,32,0.02)]"
                style={{
                  fontFamily: UI,
                  fontSize: "0.845rem",
                  color: C.charcoal,
                  lineHeight: 1.5,
                }}
                onFocus={(e) => (e.target.style.borderColor = C.gold)}
                onBlur={(e) => (e.target.style.borderColor = "rgba(43,35,32,0.14)")}
              />

              <button
                onClick={sendMessage}
                className="border-none rounded-lg p-[0.52rem_1rem] font-semibold flex items-center gap-[0.35rem] shrink-0 transition-all duration-120 tracking-[0.01em]"
                style={{
                  backgroundColor: draft.trim() ? C.gold : "rgba(43,35,32,0.08)",
                  color: draft.trim() ? C.charcoal : "rgba(43,35,32,0.3)",
                  cursor: draft.trim() ? "pointer" : "default",
                  fontSize: "0.78rem",
                  fontFamily: UI,
                }}
              >
                Send
                <SendIcon />
              </button>
            </div>
          </div>
        ) : (
          /* No conversation selected */
          <div className="flex items-center justify-center flex-col gap-3" style={{ color: "rgba(43,35,32,0.28)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="m-0" style={{ fontFamily: UI, fontSize: "0.85rem", color: "rgba(43,35,32,0.38)" }}>
              Select a conversation to view messages
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
