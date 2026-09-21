'use client';

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { replyToReview, setReviewFlagged } from "@/server/review-actions";
import type { ConsoleReview as Review, ReviewStats } from "@/server/console";

// ── Star renderer ─────────────────────────────────────────────────────────────

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-[2px] items-center">
      {[1, 2, 3, 4, 5].map(n => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24">
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            fill={n <= rating ? "#D4A94E" : "rgba(43,35,32,0.12)"}
            stroke={n <= rating ? "#D4A94E" : "rgba(43,35,32,0.15)"}
            strokeWidth="1"
          />
        </svg>
      ))}
    </span>
  );
}

// ── Summary block ─────────────────────────────────────────────────────────────

function SummaryBlock({ stats }: { stats: ReviewStats }) {
  const s = stats;
  return (
    <div className="bg-white rounded-lg grid items-center p-6 gap-10 mb-5 border border-solid border-[#2b232012] grid-cols-[auto_1fr_auto]">
      {/* Big rating */}
      <div className="text-center pr-8 border-r border-solid border-[rgba(43,35,32,0.08)]">
        <div className="font-bold leading-none mb-[0.4rem] tracking-[-0.05em] font-sans text-[3rem] text-[#2B2320]">
          {s.average.toFixed(1)}
        </div>
        <Stars rating={Math.round(s.average)} size={15} />
        <div className="mt-[0.4rem] tracking-[0.02em] font-sans text-[0.68rem] text-[#2b232066]">
          {s.total} reviews
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="flex flex-col gap-2">
        {s.breakdown.map(row => (
          <div key={row.stars} className="flex items-center gap-[0.625rem]">
            <span
              className="min-w-[32px] text-right flex items-center justify-end gap-[2px] font-sans text-[0.68rem] text-[#2b232080]"
            >
              {row.stars}
              <svg width="9" height="9" viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#D4A94E" />
              </svg>
            </span>
            <div className="flex-1 h-[6px] rounded-full overflow-hidden bg-[#2b232014]">
              <div
                className="h-full rounded-full transition-all duration-400 ease-in-out"
                style={{
                  width: `${row.pct}%`,
                  backgroundColor: row.stars >= 4 ? "#D4A94E" : row.stars === 3 ? "rgba(212,169,78,0.45)" : "#7A2E38",
                }}
              />
            </div>
            <span className="min-w-[28px] font-sans text-[0.65rem] text-[#2b232060]">
              {row.count}
            </span>
          </div>
        ))}
      </div>

      {/* Response rate */}
      <div
        className="text-center pl-8 border-l border-solid border-[rgba(43,35,32,0.08)]"
      >
        {/* Ring SVG */}
        <div className="relative inline-block mb-2">
          <svg width="68" height="68" viewBox="0 0 68 68">
            <circle cx="34" cy="34" r="28" fill="none" stroke="rgba(43,35,32,0.08)" strokeWidth="7" />
            <circle
              cx="34" cy="34" r="28"
              fill="none"
              stroke="#3B8A93"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - s.responseRate / 100)}`}
              transform="rotate(-90 34 34)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold tracking-[-0.02em] font-sans text-[0.88rem] text-[#2B2320]">
            {s.responseRate}%
          </div>
        </div>
        <div className="uppercase font-medium leading-snug tracking-[0.08em] font-sans text-[0.65rem] text-[#2b23206b]">
          Response<br />Rate
        </div>
        <div className="mt-[0.35rem] font-sans text-[0.65rem] text-[#2b232059]">
          {s.responded} of {s.total}
        </div>
      </div>
    </div>
  );
}

// ── Review card ───────────────────────────────────────────────────────────────

function ReviewCard({ review, onReplyPosted, onToggleFlag }: {
  review: Review;
  onReplyPosted: (id: string, text: string) => void;
  onToggleFlag: (id: string, flagged: boolean) => void;
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

  const ratingColor = review.rating >= 4 ? "#3B8A93" : review.rating === 3 ? "#8A6818" : "#7A2E38";

  return (
    <div className="bg-white rounded-[10px] overflow-hidden transition-shadow duration-200 border border-solid border-[#2b232017] shadow-[0_1px_8px_rgba(43,35,32,0.04)] hover:shadow-[0_3px_14px_rgba(43,35,32,0.08)]">
      <div className="p-[1.25rem_1.5rem]">
        {/* ── Top row: avatar + meta + rating badge + flag ── */}
        <div className="flex items-start gap-[0.875rem] mb-[0.875rem]">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0 tracking-[0.04em] bg-[#7A2E3818] text-[#7A2E38] font-sans text-[0.7rem]">
            {review.customer.initials}
          </div>

          {/* Name + date + location */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-[2px]">
              <span className="font-semibold font-sans text-[0.84rem] text-[#2B2320]">
                {review.customer.name}
              </span>
              <span className="font-sans text-[0.68rem] text-[#2b232060]">
                · {review.customer.location}
              </span>
            </div>
            <div className="flex items-center gap-[0.625rem]">
              <Stars rating={review.rating} size={12} />
              <span
                className="font-semibold font-sans text-[0.65rem]"
                style={{ color: ratingColor }}
              >
                {review.rating}.0
              </span>
              <span className="font-sans text-[0.65rem] text-[#2b232059]">
                · {review.date}
              </span>
            </div>
          </div>

          {/* Flag + rating chip */}
          <div className="flex items-center gap-2 shrink-0">
            {review.flagged && (
              <button
                onClick={() => onToggleFlag(review.id, false)}
                title="Flagged — click to remove flag"
                className="flex items-center gap-[3px] px-[7px] py-[3px] rounded-full cursor-pointer border border-solid border-[#7a2e3847] bg-[#7a2e380f] text-[#7A2E38]"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                <span className="font-semibold uppercase tracking-[0.06em] font-sans text-[0.58rem]">
                  Flagged
                </span>
              </button>
            )}
            {!review.flagged && (
              <button
                onClick={() => onToggleFlag(review.id, true)}
                title="Flag this review for moderation"
                className="bg-transparent border-none cursor-pointer p-1 flex items-center rounded transition-colors duration-100 text-[#2b232038] hover:text-[#7A2E38]"
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
        <div className="inline-flex items-center gap-2 px-[0.625rem] py-[0.375rem] rounded-[5px] cursor-pointer no-underline mb-[0.875rem] transition-colors duration-100 bg-[#2b232008] border border-solid border-[#2b232012] hover:bg-[#2b23200f]">
          <img
            src={review.product.img}
            alt=""
            className="w-6 h-6 rounded-[3px] object-cover shrink-0 bg-[#2b232014]"
          />
          <span className="font-medium font-sans text-[0.72rem] text-[#2B2320]">
            {review.product.name}
          </span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(43,35,32,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </div>

        {/* ── Review text ── */}
        <p className="m-0 leading-relaxed font-sans text-[0.83rem] text-[#2b2320bf] mb-[0.875rem]">
          {review.text}
        </p>

        {/* ── Customer photos ── */}
        {review.photos.length > 0 && (
          <div className="flex gap-2 mb-[0.875rem]">
            {review.photos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className="w-[52px] h-[52px] rounded-md object-cover cursor-pointer shrink-0 border border-solid border-[rgba(43,35,32,0.12)] bg-[#2b232014]"
              />
            ))}
            <span className="self-center ml-1 font-sans text-[0.68rem] text-[#2b232066]">
              {review.photos.length} customer photo{review.photos.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* ── Existing store reply ── */}
        {review.reply && (
          <div
            className="ml-5 p-[0.875rem_1rem] mb-[0.125rem] border-l-[3px] border-solid border-[rgba(212,169,78,0.5)] bg-[rgba(212,169,78,0.05)] rounded-[0_6px_6px_0]"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold tracking-[0.12em] font-sans text-[0.58rem] text-[#8A6818] uppercase">
                Store Reply
              </span>
              {review.repliedAt && (
                <span className="font-sans text-[0.62rem] text-[#2b232059]">
                  · {review.repliedAt}
                </span>
              )}
            </div>
            <p className="m-0 leading-relaxed font-sans text-[0.81rem] text-[#2b2320b8]">
              {review.reply}
            </p>
          </div>
        )}

        {/* ── Reply posted feedback ── */}
        {posted && (
          <div className="ml-5 rounded-md p-[0.6rem_0.875rem] font-medium bg-[#3b8a9314] border border-solid border-[#3b8a9338] font-sans text-[0.75rem] text-[#3B8A93]">
            ✓ Your reply has been posted.
          </div>
        )}

        {/* ── Reply form / button ── */}
        {!review.reply && !posted && (
          <div className="mt-1">
            {replyOpen ? (
              <div className="ml-5">
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  rows={3}
                  placeholder={`Reply to ${review.customer.name.split(" ")[0]}…`}
                  className={`w-full p-[0.6rem_0.75rem] rounded-md outline-none resize-y box-border bg-white transition-colors duration-100 font-sans text-[0.81rem] text-[#2B2320] leading-[1.6] border border-solid ${focused ? 'border-[#D4A94E]' : 'border-[#2b232026]'}`}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handlePost}
                    disabled={!replyText.trim()}
                    className={`border-none rounded-[5px] px-4 py-[0.45rem] font-bold transition-colors duration-100 tracking-[0.03em] font-sans text-[0.75rem] ${replyText.trim() ? 'bg-[#D4A94E] text-[#2B2320] cursor-pointer' : 'bg-[#2b23201a] text-[#2b232059] cursor-not-allowed'}`}
                  >
                    Post Reply
                  </button>
                  <button
                    onClick={() => { setReplyOpen(false); setReplyText(""); }}
                    className="bg-transparent rounded-[5px] px-3 py-[0.45rem] cursor-pointer border border-solid border-[#2b232026] text-[#2b232073] font-sans text-[0.73rem]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setReplyOpen(true)}
                className="bg-transparent rounded-[5px] px-[0.875rem] py-[0.42rem] font-medium cursor-pointer inline-flex items-center gap-[0.35rem] transition-colors duration-100 border-[1.5px] border-solid text-[#7A2E38] border-[#7A2E38] font-sans text-[0.73rem] hover:bg-[#7a2e380f]"
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
    <div className="bg-white rounded-lg flex flex-col items-center justify-center p-[4rem_2rem] gap-3 text-center border border-solid border-[#2b232012]">
      <div className="opacity-20 text-[#2B2320]">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
      <p className="font-semibold m-0 font-sans text-[0.9rem] text-[#2B2320]">
        {msg}
      </p>
      <p className="m-0 font-sans text-[0.78rem] text-[#2b23206b]">
        Try adjusting your filters.
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type RatingFilter = "all" | 5 | 4 | 3 | 2 | 1;

export default function ConsoleReviews({ reviews: initialReviews = [], stats }: { reviews?: Review[]; stats: ReviewStats }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const router = useRouter();
  const [, startAction] = useTransition();
  const [needsResponse, setNeedsResponse] = useState(false);

  const selectClassName = "font-sans text-[0.77rem] text-[#2B2320] bg-white border border-solid border-[#2b232026] rounded-[6px] py-[0.45rem] pr-[2rem] pl-[0.75rem] appearance-none bg-no-repeat bg-[right_0.625rem_center] cursor-pointer outline-none";

  const filtered = reviews.filter(r => {
    if (ratingFilter !== "all" && r.rating !== ratingFilter) return false;
    if (needsResponse && r.reply !== null) return false;
    return true;
  });

  const needsResponseCount = reviews.filter(r => r.reply === null).length;

  function handleReplyPosted(id: string, text: string) {
    setReviews(prev => prev.map(r => (r.id === id ? { ...r, reply: text, repliedAt: "Just now" } : r)));
    startAction(async () => {
      const res = await replyToReview(id, text);
      if (!res.ok) { alert(res.message); }
      router.refresh();
    });
  }

  function handleToggleFlag(id: string, flagged: boolean) {
    setReviews(prev => prev.map(r => (r.id === id ? { ...r, flagged } : r)));
    startAction(async () => {
      const res = await setReviewFlagged(id, flagged);
      if (!res.ok) { alert(res.message); }
      router.refresh();
    });
  }

  return (
    <div className="console-page p-7 font-sans">

      {/* ── Controls row ──────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div className="tracking-[0.02em] font-sans text-[0.72rem] text-[#2b23206b]">
          Showing <strong className="text-[#2B2320]">{filtered.length}</strong> of {reviews.length} reviews
        </div>

        <div className="flex items-center gap-[0.625rem]">
          {/* Rating filter */}
          <select
            value={String(ratingFilter)}
            onChange={e => setRatingFilter(e.target.value === "all" ? "all" : Number(e.target.value) as RatingFilter)}
            className={selectClassName}
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'rgba(43,35,32,0.4)\'/%3E%3C/svg%3E")' }}
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
            className={`inline-flex items-center gap-[0.4rem] px-[0.875rem] py-[0.45rem] rounded-md cursor-pointer whitespace-nowrap transition-all duration-150 border-[1.5px] border-solid font-sans text-[0.75rem] ${needsResponse ? 'border-[#7A2E38] bg-[#7a2e3812] text-[#7A2E38] font-semibold' : 'border-[#2b232026] bg-white text-[#2b23208c] font-normal'}`}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Needs Response
            {needsResponseCount > 0 && (
              <span
                className={`inline-flex items-center justify-center min-w-[16px] h-4 rounded-full font-bold px-[3px] text-[0.58rem] ${needsResponse ? 'bg-[#7A2E38] text-white' : 'bg-[#2b23201f] text-[#2b23208c]'}`}
              >
                {needsResponseCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Summary block ──────────────────────────────────── */}
      <SummaryBlock stats={stats} />

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
        <div className="flex flex-col gap-[0.875rem]">
          {filtered.map(r => (
            <ReviewCard key={r.id} review={r} onReplyPosted={handleReplyPosted} onToggleFlag={handleToggleFlag} />
          ))}
        </div>
      )}
    </div>
  );
}
