'use client';

import { useState } from "react";
import { C, UI, label } from "../../tokens";

// ── Types ─────────────────────────────────────────────────────────────────────

type Review = {
  id: string;
  customer: { name: string; initials: string; location: string };
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  product: { name: string; img: string };
  text: string;
  photos: string[];
  reply: string | null;
  repliedAt?: string;
  flagged: boolean;
};

// ── Seed data ─────────────────────────────────────────────────────────────────

const REVIEWS: Review[] = [
  {
    id: "rv1",
    customer: { name: "Chiamaka Eze", initials: "CE", location: "London, UK" },
    rating: 5,
    date: "Aug 28, 2026",
    product: { name: "Aso-Oke Gele — Ivory & Gold Set", img: "photo-1714124731489-7eb16af0ac91" },
    text: "Absolutely stunning craftsmanship. The Gele drapes perfectly and the colour is exactly what I wanted. AdeClassics truly delivers on their promise of quality. I wore this to my cousin's traditional ceremony and received compliments all evening. Will definitely order again for my sister's wedding.",
    photos: [],
    reply: "Thank you so much, Chiamaka! We're overjoyed that the Gele was everything you hoped for — and congratulations on the ceremony! We can't wait to create something special for your sister's celebration too.",
    repliedAt: "Aug 29, 2026",
    flagged: false,
  },
  {
    id: "rv2",
    customer: { name: "David Mensah", initials: "DM", location: "Birmingham, UK" },
    rating: 4,
    date: "Aug 25, 2026",
    product: { name: "Embroidered Agbada Kaftan", img: "photo-1765910083971-aa0e3688be46" },
    text: "Very well made and the embroidery is exquisite. Delivery was a little slower than expected — arrived on day 8 when I was told 5–7 days — but the quality more than makes up for it. The packaging felt like a luxury gift. I photographed the unboxing.",
    photos: ["#8A6818", "#2E4A9E"],
    reply: null,
    flagged: false,
  },
  {
    id: "rv3",
    customer: { name: "Bola Adeyemi", initials: "BA", location: "Toronto, Canada" },
    rating: 5,
    date: "Aug 20, 2026",
    product: { name: "Adire Roundneck — Indigo", img: "photo-1632948056627-41482f69c38c" },
    text: "The Adire fabric is gorgeous — rich indigo with such intricate patterns. I've received so many compliments every time I wear this. True artistry. You can see the care that went into each hand-drawn detail.",
    photos: ["#1A3D7A"],
    reply: "Thank you Bola! Those Adire patterns are hand-drawn by our master artisan in Lagos — we're so glad you love it. We'd love to see you in it. Feel free to tag us on Instagram!",
    repliedAt: "Aug 21, 2026",
    flagged: false,
  },
  {
    id: "rv4",
    customer: { name: "Ola Balogun", initials: "OB", location: "Manchester, UK" },
    rating: 5,
    date: "Aug 15, 2026",
    product: { name: "Gobi Filà Cap — Burgundy Velvet", img: "photo-1763823133159-c6f8ec380e33" },
    text: "Perfect fit on the first try. The velvet is rich and the cap holds its shape beautifully. I ordered the Large and it fits my head exactly as described in the sizing guide. The burgundy colour is deeper and richer in person than the photos show — in a good way.",
    photos: [],
    reply: null,
    flagged: false,
  },
  {
    id: "rv5",
    customer: { name: "Tunde Bakare", initials: "TB", location: "Bristol, UK" },
    rating: 3,
    date: "Aug 10, 2026",
    product: { name: "Embroidered Agbada Kaftan", img: "photo-1765910083971-aa0e3688be46" },
    text: "The garment itself is beautiful but the sizing runs larger than expected. I had to have it taken in by a local tailor. The size chart could do with more detail — perhaps a chest measurement table. Would still recommend the quality but check the measurements carefully.",
    photos: [],
    reply: null,
    flagged: false,
  },
  {
    id: "rv6",
    customer: { name: "Ngozi Obi", initials: "NO", location: "Lagos, Nigeria" },
    rating: 2,
    date: "Aug 5, 2026",
    product: { name: "Hand-tooled Pam Slippers", img: "photo-1646133512747-babfd708d662" },
    text: "Very disappointed. The leather started cracking after just 3 wears and the stitching came loose on the right slipper. Expected much better quality for this price point. I've left photos below.",
    photos: ["#C4501A", "#8B3A1A"],
    reply: "Hi Ngozi, we are truly sorry — this is not the quality standard we hold ourselves to and we want to make this right immediately. We've sent you a direct email with options for a replacement or full refund. Thank you for giving us the opportunity to resolve this.",
    repliedAt: "Aug 6, 2026",
    flagged: true,
  },
  {
    id: "rv7",
    customer: { name: "Kwame Asante", initials: "KA", location: "Leeds, UK" },
    rating: 5,
    date: "Jul 30, 2026",
    product: { name: "Yoruba Filà (Custom)", img: "photo-1763823133159-c6f8ec380e33" },
    text: "My custom Filà arrived and it is beyond perfect. The measurements were spot on, the embroidery is incredibly detailed, and the fabric is premium. Ordering a second one in navy blue.",
    photos: [],
    reply: "Kwame, thank you! We put extra care into your custom piece and it's wonderful to hear it arrived exactly right. Your navy blue order is already on our list — we'll reach out once we confirm fabric availability.",
    repliedAt: "Jul 31, 2026",
    flagged: false,
  },
  {
    id: "rv8",
    customer: { name: "Adaeze Obi", initials: "AO", location: "Glasgow, UK" },
    rating: 4,
    date: "Jul 22, 2026",
    product: { name: "Ọjọ Ipele — Crimson Drape", img: "photo-1760086626077-55da1cb1ecb3" },
    text: "Beautiful drape with vibrant colour. Fits well and the fabric is high quality. Minor point: I wish the care instructions were printed rather than just on the website, as I nearly washed it incorrectly. Five stars for the product, four stars overall.",
    photos: [],
    reply: null,
    flagged: false,
  },
];

// ── Store summary stats ───────────────────────────────────────────────────────

const STORE_STATS = {
  average: 4.8,
  total: 47,
  breakdown: [
    { stars: 5, count: 40, pct: 85 },
    { stars: 4, count: 4,  pct: 9  },
    { stars: 3, count: 2,  pct: 4  },
    { stars: 2, count: 1,  pct: 2  },
    { stars: 1, count: 0,  pct: 0  },
  ],
  responseRate: 68,
  responded: 32,
};

// ── Star renderer ─────────────────────────────────────────────────────────────

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map(n => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24">
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            fill={n <= rating ? C.gold : "rgba(43,35,32,0.12)"}
            stroke={n <= rating ? C.gold : "rgba(43,35,32,0.15)"}
            strokeWidth="1"
          />
        </svg>
      ))}
    </span>
  );
}

// ── Summary block ─────────────────────────────────────────────────────────────

function SummaryBlock({ filtered, needsResponse }: { filtered: boolean; needsResponse: boolean }) {
  const s = STORE_STATS;
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        border: "1px solid rgba(43,35,32,0.07)",
        padding: "1.5rem",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: "2.5rem",
        alignItems: "center",
        marginBottom: "1.25rem",
      }}
    >
      {/* Big rating */}
      <div style={{ textAlign: "center", paddingRight: "2rem", borderRight: "1px solid rgba(43,35,32,0.08)" }}>
        <div
          style={{
            fontFamily: UI,
            fontSize: "3rem",
            fontWeight: 700,
            color: C.charcoal,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            marginBottom: "0.4rem",
          }}
        >
          {s.average.toFixed(1)}
        </div>
        <Stars rating={Math.round(s.average)} size={15} />
        <div
          style={{
            fontFamily: UI,
            fontSize: "0.68rem",
            color: "rgba(43,35,32,0.4)",
            marginTop: "0.4rem",
            letterSpacing: "0.02em",
          }}
        >
          {s.total} reviews
        </div>
      </div>

      {/* Breakdown bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {s.breakdown.map(row => (
          <div key={row.stars} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <span
              style={{
                fontFamily: UI,
                fontSize: "0.68rem",
                color: "rgba(43,35,32,0.5)",
                minWidth: 32,
                textAlign: "right",
                display: "flex",
                alignItems: "center",
                gap: "2px",
                justifyContent: "flex-end",
              }}
            >
              {row.stars}
              <svg width="9" height="9" viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={C.gold} />
              </svg>
            </span>
            <div
              style={{
                flex: 1,
                height: 6,
                backgroundColor: "rgba(43,35,32,0.08)",
                borderRadius: 100,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${row.pct}%`,
                  backgroundColor: row.stars >= 4 ? C.gold : row.stars === 3 ? "rgba(212,169,78,0.45)" : C.maroon,
                  borderRadius: 100,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: UI,
                fontSize: "0.65rem",
                color: "rgba(43,35,32,0.38)",
                minWidth: 28,
              }}
            >
              {row.count}
            </span>
          </div>
        ))}
      </div>

      {/* Response rate */}
      <div
        style={{
          textAlign: "center",
          paddingLeft: "2rem",
          borderLeft: "1px solid rgba(43,35,32,0.08)",
        }}
      >
        {/* Ring SVG */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: "0.5rem" }}>
          <svg width="68" height="68" viewBox="0 0 68 68">
            <circle cx="34" cy="34" r="28" fill="none" stroke="rgba(43,35,32,0.08)" strokeWidth="7" />
            <circle
              cx="34" cy="34" r="28"
              fill="none"
              stroke={C.teal}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - s.responseRate / 100)}`}
              transform="rotate(-90 34 34)"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: UI,
              fontSize: "0.88rem",
              fontWeight: 700,
              color: C.charcoal,
              letterSpacing: "-0.02em",
            }}
          >
            {s.responseRate}%
          </div>
        </div>
        <div style={{ fontFamily: UI, fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(43,35,32,0.42)", fontWeight: 500, lineHeight: 1.4 }}>
          Response<br />Rate
        </div>
        <div style={{ fontFamily: UI, fontSize: "0.65rem", color: "rgba(43,35,32,0.35)", marginTop: "0.35rem" }}>
          {s.responded} of {s.total}
        </div>
      </div>
    </div>
  );
}

// ── Review card ───────────────────────────────────────────────────────────────

function ReviewCard({ review, onReplyPosted }: {
  review: Review;
  onReplyPosted: (id: string, text: string) => void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [focused, setFocused] = useState(false);
  const [posted, setPosted] = useState(false);

  function handlePost() {
    if (!replyText.trim()) return;
    onReplyPosted(review.id, replyText.trim());
    setPosted(true);
    setReplyOpen(false);
    setReplyText("");
    setTimeout(() => setPosted(false), 3000);
  }

  const ratingColor = review.rating >= 4 ? C.teal : review.rating === 3 ? "#8A6818" : C.maroon;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 10,
        border: `1px solid rgba(43,35,32,0.09)`,
        boxShadow: "0 1px 8px rgba(43,35,32,0.04)",
        overflow: "hidden",
        transition: "box-shadow 0.18s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 3px 14px rgba(43,35,32,0.08)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 8px rgba(43,35,32,0.04)"; }}
    >
      <div style={{ padding: "1.25rem 1.5rem" }}>
        {/* ── Top row: avatar + meta + rating badge + flag ── */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", marginBottom: "0.875rem" }}>
          {/* Avatar */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: `${C.maroon}18`,
              color: C.maroon,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: UI,
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              flexShrink: 0,
            }}
          >
            {review.customer.initials}
          </div>

          {/* Name + date + location */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2px" }}>
              <span style={{ fontFamily: UI, fontSize: "0.84rem", fontWeight: 600, color: C.charcoal }}>
                {review.customer.name}
              </span>
              <span style={{ fontFamily: UI, fontSize: "0.68rem", color: "rgba(43,35,32,0.38)" }}>
                · {review.customer.location}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <Stars rating={review.rating} size={12} />
              <span
                style={{
                  fontFamily: UI,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: ratingColor,
                }}
              >
                {review.rating}.0
              </span>
              <span style={{ fontFamily: UI, fontSize: "0.65rem", color: "rgba(43,35,32,0.35)" }}>
                · {review.date}
              </span>
            </div>
          </div>

          {/* Flag + rating chip */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            {review.flagged && (
              <div
                title="Flagged for moderation review"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  padding: "3px 7px",
                  borderRadius: 100,
                  border: `1px solid rgba(122,46,56,0.28)`,
                  backgroundColor: "rgba(122,46,56,0.06)",
                  color: C.maroon,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                <span style={{ fontFamily: UI, fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Flagged
                </span>
              </div>
            )}
            {!review.flagged && (
              <button
                title="Flag this review for moderation"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  color: "rgba(43,35,32,0.22)",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 4,
                  transition: "color 0.12s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = C.maroon; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(43,35,32,0.22)"; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ── Product link ── */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.375rem 0.625rem",
            borderRadius: 5,
            backgroundColor: "rgba(43,35,32,0.03)",
            border: "1px solid rgba(43,35,32,0.07)",
            marginBottom: "0.875rem",
            cursor: "pointer",
            textDecorationLine: "none",
            transition: "background-color 0.12s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(43,35,32,0.06)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(43,35,32,0.03)"; }}
        >
          <img
            src={`https://images.unsplash.com/${review.product.img}?w=40&h=40&fit=crop&auto=format`}
            alt=""
            style={{ width: 24, height: 24, borderRadius: 3, objectFit: "cover", flexShrink: 0, backgroundColor: "rgba(43,35,32,0.08)" }}
          />
          <span style={{ fontFamily: UI, fontSize: "0.72rem", fontWeight: 500, color: C.charcoal }}>
            {review.product.name}
          </span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(43,35,32,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </div>

        {/* ── Review text ── */}
        <p
          style={{
            fontFamily: UI,
            fontSize: "0.83rem",
            color: "rgba(43,35,32,0.75)",
            lineHeight: 1.65,
            margin: 0,
            marginBottom: review.photos.length > 0 || review.reply || !review.reply ? "0.875rem" : 0,
          }}
        >
          {review.text}
        </p>

        {/* ── Customer photos ── */}
        {review.photos.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.875rem" }}>
            {review.photos.map((bg, i) => (
              <div
                key={i}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 6,
                  backgroundColor: bg,
                  border: "1px solid rgba(43,35,32,0.12)",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <svg width="52" height="52" style={{ position: "absolute", inset: 0, opacity: 0.12 }}>
                  <pattern id={`hatch-rv-${review.id}-${i}`} width="6" height="6" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="6" x2="6" y2="0" stroke="#fff" strokeWidth="0.8" />
                  </pattern>
                  <rect width="52" height="52" fill={`url(#hatch-rv-${review.id}-${i})`} />
                </svg>
              </div>
            ))}
            <span
              style={{
                alignSelf: "center",
                fontFamily: UI,
                fontSize: "0.68rem",
                color: "rgba(43,35,32,0.4)",
                marginLeft: "0.25rem",
              }}
            >
              {review.photos.length} customer photo{review.photos.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* ── Existing store reply ── */}
        {review.reply && (
          <div
            style={{
              marginLeft: "1.25rem",
              borderLeft: `3px solid rgba(212,169,78,0.5)`,
              backgroundColor: "rgba(212,169,78,0.05)",
              borderRadius: "0 6px 6px 0",
              padding: "0.875rem 1rem",
              marginBottom: "0.125rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span
                style={{
                  ...label,
                  fontSize: "0.58rem",
                  letterSpacing: "0.12em",
                  color: "#8A6818",
                  fontWeight: 600,
                }}
              >
                Store Reply
              </span>
              {review.repliedAt && (
                <span style={{ fontFamily: UI, fontSize: "0.62rem", color: "rgba(43,35,32,0.35)" }}>
                  · {review.repliedAt}
                </span>
              )}
            </div>
            <p
              style={{
                fontFamily: UI,
                fontSize: "0.81rem",
                color: "rgba(43,35,32,0.72)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {review.reply}
            </p>
          </div>
        )}

        {/* ── Reply posted feedback ── */}
        {posted && (
          <div
            style={{
              marginLeft: "1.25rem",
              backgroundColor: "rgba(59,138,147,0.08)",
              border: "1px solid rgba(59,138,147,0.22)",
              borderRadius: 6,
              padding: "0.6rem 0.875rem",
              fontFamily: UI,
              fontSize: "0.75rem",
              color: C.teal,
              fontWeight: 500,
            }}
          >
            ✓ Your reply has been posted.
          </div>
        )}

        {/* ── Reply form / button ── */}
        {!review.reply && !posted && (
          <div style={{ marginTop: "0.25rem" }}>
            {replyOpen ? (
              <div style={{ marginLeft: "1.25rem" }}>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  rows={3}
                  placeholder={`Reply to ${review.customer.name.split(" ")[0]}…`}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    border: `1px solid ${focused ? C.gold : "rgba(43,35,32,0.15)"}`,
                    borderRadius: 6,
                    fontFamily: UI,
                    fontSize: "0.81rem",
                    color: C.charcoal,
                    lineHeight: 1.6,
                    resize: "vertical",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.12s",
                    backgroundColor: "#fff",
                  }}
                />
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button
                    onClick={handlePost}
                    disabled={!replyText.trim()}
                    style={{
                      backgroundColor: replyText.trim() ? C.gold : "rgba(43,35,32,0.1)",
                      color: replyText.trim() ? C.charcoal : "rgba(43,35,32,0.35)",
                      border: "none",
                      borderRadius: 5,
                      padding: "0.45rem 1rem",
                      fontFamily: UI,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.03em",
                      cursor: replyText.trim() ? "pointer" : "not-allowed",
                      transition: "background-color 0.12s",
                    }}
                  >
                    Post Reply
                  </button>
                  <button
                    onClick={() => { setReplyOpen(false); setReplyText(""); }}
                    style={{
                      backgroundColor: "transparent",
                      color: "rgba(43,35,32,0.45)",
                      border: "1px solid rgba(43,35,32,0.15)",
                      borderRadius: 5,
                      padding: "0.45rem 0.75rem",
                      fontFamily: UI,
                      fontSize: "0.73rem",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setReplyOpen(true)}
                style={{
                  backgroundColor: "transparent",
                  color: C.maroon,
                  border: `1.5px solid ${C.maroon}`,
                  borderRadius: 5,
                  padding: "0.42rem 0.875rem",
                  fontFamily: UI,
                  fontSize: "0.73rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  transition: "background-color 0.12s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(122,46,56,0.06)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Reply
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ label: msg }: { label: string }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        border: "1px solid rgba(43,35,32,0.07)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        gap: "0.75rem",
        textAlign: "center",
      }}
    >
      <div style={{ opacity: 0.2, color: C.charcoal }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
      <p style={{ fontFamily: UI, fontSize: "0.9rem", fontWeight: 600, color: C.charcoal, margin: 0 }}>
        {msg}
      </p>
      <p style={{ fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.42)", margin: 0 }}>
        Try adjusting your filters.
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type RatingFilter = "all" | 5 | 4 | 3 | 2 | 1;

export default function ConsoleReviews() {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [needsResponse, setNeedsResponse] = useState(false);

  const selectStyle: React.CSSProperties = {
    fontFamily: UI,
    fontSize: "0.77rem",
    color: C.charcoal,
    backgroundColor: "#fff",
    border: "1px solid rgba(43,35,32,0.15)",
    borderRadius: 6,
    padding: "0.45rem 2rem 0.45rem 0.75rem",
    appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(43,35,32,0.4)'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.625rem center",
    cursor: "pointer",
    outline: "none",
  };

  const filtered = reviews.filter(r => {
    if (ratingFilter !== "all" && r.rating !== ratingFilter) return false;
    if (needsResponse && r.reply !== null) return false;
    return true;
  });

  const needsResponseCount = reviews.filter(r => r.reply === null).length;

  function handleReplyPosted(id: string, text: string) {
    setReviews(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, reply: text, repliedAt: "Just now" }
          : r
      )
    );
  }

  return (
    <div className="console-page" style={{ padding: "1.75rem", fontFamily: UI }}>

      {/* ── Controls row ──────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontFamily: UI, fontSize: "0.72rem", color: "rgba(43,35,32,0.42)", letterSpacing: "0.02em" }}>
          Showing <strong style={{ color: C.charcoal }}>{filtered.length}</strong> of {reviews.length} reviews
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          {/* Rating filter */}
          <select
            value={String(ratingFilter)}
            onChange={e => setRatingFilter(e.target.value === "all" ? "all" : Number(e.target.value) as RatingFilter)}
            style={selectStyle}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Star</option>
            <option value="4">4 Star</option>
            <option value="3">3 Star</option>
            <option value="2">2 Star</option>
            <option value="1">1 Star</option>
          </select>

          {/* Needs response toggle */}
          <button
            onClick={() => setNeedsResponse(v => !v)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.875rem",
              borderRadius: 6,
              border: `1.5px solid ${needsResponse ? C.maroon : "rgba(43,35,32,0.15)"}`,
              backgroundColor: needsResponse ? "rgba(122,46,56,0.07)" : "#fff",
              color: needsResponse ? C.maroon : "rgba(43,35,32,0.55)",
              fontFamily: UI,
              fontSize: "0.75rem",
              fontWeight: needsResponse ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.14s",
              whiteSpace: "nowrap",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Needs Response
            {needsResponseCount > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: needsResponse ? C.maroon : "rgba(43,35,32,0.12)",
                  color: needsResponse ? "#fff" : "rgba(43,35,32,0.55)",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  padding: "0 3px",
                }}
              >
                {needsResponseCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Summary block ──────────────────────────────────── */}
      <SummaryBlock filtered={ratingFilter !== "all"} needsResponse={needsResponse} />

      {/* ── Review list ────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          label={
            needsResponse && ratingFilter !== "all"
              ? `No unanswered ${ratingFilter}-star reviews`
              : needsResponse
              ? "All reviews have been replied to"
              : ratingFilter !== "all"
              ? `No ${ratingFilter}-star reviews`
              : "No reviews yet"
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {filtered.map(r => (
            <ReviewCard key={r.id} review={r} onReplyPosted={handleReplyPosted} />
          ))}
        </div>
      )}
    </div>
  );
}
