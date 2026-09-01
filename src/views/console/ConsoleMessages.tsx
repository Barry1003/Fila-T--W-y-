'use client';

import { useState, useRef, useEffect } from "react";
import { C, UI } from "../../tokens";

// ── Types ─────────────────────────────────────────────────────────────────────

type Sender = "customer" | "owner";
type ConvTag = "order" | "custom" | null;
type Filter = "all" | "unread" | "order" | "custom";

interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  customerName: string;
  subject: string;
  tag: ConvTag;
  tagLabel?: string;
  preview: string;
  date: string;
  unread: boolean;
  resolved: boolean;
  messages: Message[];
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const INITIAL_CONVS: Conversation[] = [
  {
    id: "c1",
    customerName: "Chiamaka Eze",
    subject: "Shipping update for my Gele set",
    tag: "order",
    tagLabel: "#FTW-2891",
    preview: "Hi, I placed order #FTW-2891 three days ago — any shipping update?",
    date: "Today, 10:42",
    unread: true,
    resolved: false,
    messages: [
      { id: "m1", sender: "customer", text: "Hi! I placed order #FTW-2891 three days ago for a Gele set. Do you have a shipping update? I haven't received any tracking info yet.", timestamp: "Today, 10:42" },
      { id: "m2", sender: "owner", text: "Hi Chiamaka! Your order is packed and ready to go — we're dispatching it today and you'll receive your tracking number by this evening. Thank you for your patience!", timestamp: "Today, 11:10" },
      { id: "m3", sender: "customer", text: "Wonderful, thank you so much! Really looking forward to receiving it.", timestamp: "Today, 11:18" },
    ],
  },
  {
    id: "c2",
    customerName: "David Mensah",
    subject: "Measurement correction — Custom Agbada",
    tag: "custom",
    tagLabel: "Custom Request",
    preview: "Hello, I think I put the wrong sleeve length in my request...",
    date: "Yesterday, 15:15",
    unread: true,
    resolved: false,
    messages: [
      { id: "m1", sender: "customer", text: "Hello, I submitted a custom Agbada request but I think I put the wrong sleeve length. Can it still be corrected?", timestamp: "Yesterday, 15:15" },
      { id: "m2", sender: "owner", text: "Yes of course! Your request is still in New status so no cutting has started. Just confirm the correct measurement and I'll update it straight away.", timestamp: "Yesterday, 15:42" },
      { id: "m3", sender: "customer", text: "That's a relief! The sleeve should be 28.5 inches, not 27. Really appreciate the flexibility.", timestamp: "Yesterday, 15:58" },
      { id: "m4", sender: "owner", text: "Updated — I have 28.5 inches noted on your request. We'll be in touch once the quote is ready. Looking forward to creating this for you!", timestamp: "Yesterday, 16:05" },
    ],
  },
  {
    id: "c3",
    customerName: "Ngozi Obi",
    subject: "Return policy question",
    tag: null,
    preview: "If an item's colour doesn't match the listing, can I return it?",
    date: "28 Aug",
    unread: false,
    resolved: false,
    messages: [
      { id: "m1", sender: "customer", text: "Hello! If I receive an item and the colour doesn't match what I see online, am I able to return it?", timestamp: "28 Aug, 14:30" },
      { id: "m2", sender: "owner", text: "Hello Ngozi! Absolutely — we accept returns within 14 days for any item that doesn't match its listing. We provide a prepaid return label and process refunds within 5–7 business days of receiving the item back. Please do reach out as soon as you receive it if there's any concern.", timestamp: "28 Aug, 15:00" },
    ],
  },
  {
    id: "c4",
    customerName: "Kwame Asante",
    subject: "Delivery delay — Order #FTW-2869",
    tag: "order",
    tagLabel: "#FTW-2869",
    preview: "My order was supposed to arrive by now...",
    date: "26 Aug",
    unread: false,
    resolved: true,
    messages: [
      { id: "m1", sender: "customer", text: "Hi, my order was supposed to arrive by now and I haven't received anything. Is everything okay?", timestamp: "26 Aug, 09:00" },
      { id: "m2", sender: "owner", text: "Hi Kwame, I sincerely apologise for the delay. Your parcel was held at customs — it's now been cleared and is out for delivery. You should receive it tomorrow. I'm sorry for any inconvenience caused.", timestamp: "26 Aug, 10:15" },
      { id: "m3", sender: "customer", text: "Thank you for the quick update and explanation. I'll keep an eye out for it.", timestamp: "26 Aug, 10:28" },
      { id: "m4", sender: "owner", text: "Of course! Please let me know once it arrives and confirm everything is in order.", timestamp: "26 Aug, 10:30" },
    ],
  },
  {
    id: "c5",
    customerName: "Temi Fadare",
    subject: "Size guide — Gele headwrap",
    tag: null,
    preview: "What does 'yards' mean in the size guide?",
    date: "22 Aug",
    unread: false,
    resolved: false,
    messages: [
      { id: "m1", sender: "customer", text: "I'm a bit confused by the size guide. What does 'yards' mean in terms of how much fabric comes with the gele?", timestamp: "22 Aug, 11:00" },
      { id: "m2", sender: "owner", text: "Great question! One yard is roughly 91cm. Our Standard size (5 yards) gives you about 4.5 metres of fabric — plenty for most styles. The Large (7 yards) is ideal if you prefer elaborate sculptured folds that need more volume. Hope that helps!", timestamp: "22 Aug, 11:45" },
      { id: "m3", sender: "customer", text: "That's really helpful, thank you! I'll go with the Standard.", timestamp: "22 Aug, 11:52" },
    ],
  },
];

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
      style={{
        width: size, height: size,
        borderRadius: "50%",
        backgroundColor: color,
        color: textColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: `${size * 0.38}px`,
        fontWeight: 700,
        flexShrink: 0,
        fontFamily: UI,
        letterSpacing: "0.02em",
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
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        fontSize: "0.62rem",
        fontWeight: 500,
        padding: "1px 6px",
        borderRadius: 4,
        backgroundColor: isOrder ? "rgba(46,74,158,0.08)" : "rgba(212,169,78,0.12)",
        color: isOrder ? "#2E4A9E" : "#8A6818",
        border: `1px solid ${isOrder ? "rgba(46,74,158,0.14)" : "rgba(212,169,78,0.22)"}`,
        whiteSpace: "nowrap",
        letterSpacing: "0.01em",
      }}
    >
      {isOrder ? <PackageIcon /> : <PenIcon />}
      {tagLabel ?? (isOrder ? "Order" : "Custom Request")}
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ConsoleMessages() {
  const [convs, setConvs] = useState<Conversation[]>(INITIAL_CONVS);
  const [activeId, setActiveId] = useState<string>("c1");
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
    <div className="console-page" style={{ padding: "1.75rem", fontFamily: UI, display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* ── Header row ────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: UI, fontSize: "1.35rem", fontWeight: 600, color: C.charcoal, letterSpacing: "-0.02em", margin: 0 }}>
            Messages
          </h1>
          <p style={{ fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.45)", margin: "4px 0 0" }}>
            Customer conversations and support threads
          </p>
        </div>

        {/* Filter dropdown */}
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            style={{
              fontFamily: UI,
              fontSize: "0.8rem",
              color: C.charcoal,
              backgroundColor: "#fff",
              border: "1px solid rgba(43,35,32,0.16)",
              borderRadius: 6,
              padding: "0.5rem 2.25rem 0.5rem 0.875rem",
              appearance: "none",
              cursor: "pointer",
              outline: "none",
              fontWeight: 500,
            }}
          >
            {(["all", "unread", "order", "custom"] as Filter[]).map((f) => (
              <option key={f} value={f}>
                {FILTER_LABELS[f]} ({filterCounts[f]})
              </option>
            ))}
          </select>
          <span style={{ position: "absolute", right: "0.625rem", pointerEvents: "none", color: "rgba(43,35,32,0.4)", lineHeight: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {/* ── Two-panel layout ─────────────────────────── */}
      <div className="rg-split console-messages"
        style={{
          display: "grid",
          gridTemplateColumns: "288px 1fr",
          border: "1px solid rgba(43,35,32,0.09)",
          borderRadius: 10,
          overflow: "hidden",
          backgroundColor: "#fff",
          height: panelHeight,
          minHeight: 520,
        }}
      >
        {/* ── Left: conversation list ─────────────────── */}
        <div
          style={{
            borderRight: "1px solid rgba(43,35,32,0.09)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Search */}
          <div style={{ padding: "0.875rem", borderBottom: "1px solid rgba(43,35,32,0.07)", flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "0.625rem", top: "50%", transform: "translateY(-50%)", color: "rgba(43,35,32,0.32)", lineHeight: 0 }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                style={{
                  width: "100%",
                  padding: "0.48rem 0.625rem 0.48rem 2rem",
                  border: "1px solid rgba(43,35,32,0.12)",
                  borderRadius: 6,
                  fontSize: "0.78rem",
                  fontFamily: UI,
                  color: C.charcoal,
                  backgroundColor: "rgba(43,35,32,0.025)",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.12s",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.gold)}
                onBlur={(e) => (e.target.style.borderColor = "rgba(43,35,32,0.12)")}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "2rem 1rem", textAlign: "center" }}>
                <p style={{ fontSize: "0.82rem", color: "rgba(43,35,32,0.4)", margin: 0 }}>No conversations found</p>
              </div>
            ) : (
              filtered.map((conv) => {
                const isActive = conv.id === activeId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => selectConv(conv.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "0.875rem 0.875rem 0.875rem 0",
                      paddingLeft: 0,
                      background: isActive ? "rgba(212,169,78,0.07)" : "transparent",
                      borderLeft: `3px solid ${isActive ? C.gold : "transparent"}`,
                      borderRight: "none",
                      borderTop: "none",
                      borderBottom: "1px solid rgba(43,35,32,0.06)",
                      cursor: "pointer",
                      transition: "background 0.12s",
                      display: "flex",
                      gap: "0.625rem",
                      alignItems: "flex-start",
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(43,35,32,0.025)"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ paddingLeft: "0.75rem" }}>
                      <CustomerAvatar name={conv.customerName} size={32} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0, paddingRight: "0.75rem" }}>
                      {/* Name + timestamp row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.25rem", marginBottom: "2px" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: conv.unread ? 700 : 500, color: C.charcoal, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
                          {conv.customerName}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
                          {conv.unread && (
                            <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: C.gold, display: "block", flexShrink: 0 }} />
                          )}
                          <span style={{ fontSize: "0.65rem", color: "rgba(43,35,32,0.35)", whiteSpace: "nowrap" }}>{conv.date}</span>
                        </div>
                      </div>

                      {/* Subject */}
                      <div style={{ fontSize: "0.75rem", fontWeight: conv.unread ? 600 : 400, color: conv.unread ? C.charcoal : "rgba(43,35,32,0.6)", marginBottom: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {conv.subject}
                      </div>

                      {/* Preview + tag row */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.375rem" }}>
                        <span style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.42)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
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
          <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>

            {/* Thread header */}
            <div
              style={{
                padding: "0.875rem 1.25rem",
                borderBottom: "1px solid rgba(43,35,32,0.09)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexShrink: 0,
                backgroundColor: "#fff",
              }}
            >
              <CustomerAvatar name={active.customerName} size={34} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: C.charcoal, marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {active.customerName}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {active.subject}
                  </span>
                  {active.tag && <TagChip tag={active.tag} tagLabel={active.tagLabel} />}
                </div>
              </div>

              {/* Resolved toggle */}
              <button
                onClick={() => markResolved(active.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  border: active.resolved ? `1.5px solid ${C.teal}` : "1.5px solid rgba(43,35,32,0.18)",
                  backgroundColor: active.resolved ? "rgba(59,138,147,0.08)" : "transparent",
                  color: active.resolved ? C.teal : "rgba(43,35,32,0.55)",
                  borderRadius: 6,
                  padding: "0.38rem 0.75rem",
                  fontSize: "0.74rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: UI,
                  flexShrink: 0,
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                <CheckIcon />
                {active.resolved ? "Resolved" : "Mark Resolved"}
              </button>
            </div>

            {/* Messages area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.375rem 1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.1rem",
                minHeight: 0,
                backgroundColor: "rgba(43,35,32,0.012)",
              }}
            >
              {active.messages.map((msg) => {
                const isOwner = msg.sender === "owner";
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      flexDirection: isOwner ? "row-reverse" : "row",
                      alignItems: "flex-end",
                      gap: "0.5rem",
                    }}
                  >
                    {/* Avatars */}
                    {isOwner ? (
                      <div
                        style={{
                          width: 28, height: 28,
                          borderRadius: "50%",
                          backgroundColor: C.gold,
                          color: C.charcoal,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.55rem",
                          fontWeight: 700,
                          flexShrink: 0,
                          marginBottom: 18,
                          letterSpacing: "0.03em",
                        }}
                      >
                        AO
                      </div>
                    ) : (
                      <div style={{ marginBottom: 18, flexShrink: 0 }}>
                        <CustomerAvatar name={active.customerName} size={28} />
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      style={{
                        maxWidth: "68%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isOwner ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          padding: "0.7rem 1rem",
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
                      <span style={{ fontFamily: UI, fontSize: "0.67rem", color: "rgba(43,35,32,0.35)", marginTop: "0.3rem" }}>
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
              style={{
                padding: "0.625rem 1.25rem 0",
                display: "flex",
                gap: "0.4rem",
                flexWrap: "wrap",
                borderTop: "1px solid rgba(43,35,32,0.06)",
                backgroundColor: "#fff",
              }}
            >
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => setDraft((prev) => (prev ? prev + " " + reply : reply))}
                  style={{
                    background: "rgba(43,35,32,0.04)",
                    border: "1px solid rgba(43,35,32,0.12)",
                    borderRadius: 100,
                    padding: "3px 10px",
                    fontSize: "0.7rem",
                    color: "rgba(43,35,32,0.65)",
                    cursor: "pointer",
                    fontFamily: UI,
                    whiteSpace: "nowrap",
                    transition: "background 0.12s, border-color 0.12s",
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
              style={{
                padding: "0.625rem 1.25rem 1rem",
                display: "flex",
                gap: "0.5rem",
                alignItems: "flex-end",
                flexShrink: 0,
                backgroundColor: "#fff",
              }}
            >
              <button
                title="Attach file"
                style={{
                  background: "none",
                  border: "1px solid rgba(43,35,32,0.14)",
                  borderRadius: 8,
                  padding: "0.5rem",
                  cursor: "pointer",
                  color: "rgba(43,35,32,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "color 0.12s, border-color 0.12s",
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
                style={{
                  flex: 1,
                  resize: "none",
                  border: "1px solid rgba(43,35,32,0.14)",
                  borderRadius: 8,
                  padding: "0.52rem 0.75rem",
                  fontFamily: UI,
                  fontSize: "0.845rem",
                  color: C.charcoal,
                  backgroundColor: "rgba(43,35,32,0.02)",
                  outline: "none",
                  lineHeight: 1.5,
                  transition: "border-color 0.12s",
                  overflowY: "hidden",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.gold)}
                onBlur={(e) => (e.target.style.borderColor = "rgba(43,35,32,0.14)")}
              />

              <button
                onClick={sendMessage}
                style={{
                  backgroundColor: draft.trim() ? C.gold : "rgba(43,35,32,0.08)",
                  color: draft.trim() ? C.charcoal : "rgba(43,35,32,0.3)",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.52rem 1rem",
                  cursor: draft.trim() ? "pointer" : "default",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  fontFamily: UI,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  flexShrink: 0,
                  transition: "all 0.12s",
                  letterSpacing: "0.01em",
                }}
              >
                Send
                <SendIcon />
              </button>
            </div>
          </div>
        ) : (
          /* No conversation selected */
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.75rem", color: "rgba(43,35,32,0.28)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p style={{ fontFamily: UI, fontSize: "0.85rem", color: "rgba(43,35,32,0.38)", margin: 0 }}>
              Select a conversation to view messages
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
