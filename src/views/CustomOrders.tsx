'use client';

import { useState } from "react";
import { Link } from '@/lib/router';
import AccountShell from "../components/AccountShell";
import type { AccountCustomRequest as CustomRequest, AccountCustomStatus as RequestStatus } from '@/server/account';
import { C, DISPLAY, UI, label } from "../tokens";

// ── Status config (mirrors ConsoleCustomOrders colors exactly) ────────────────

const STATUS_CFG: Record<RequestStatus, { label: string; bg: string; color: string; border: string }> = {
  submitted:      { label: "Submitted",      bg: "rgba(43,35,32,0.07)",    color: "rgba(43,35,32,0.6)",  border: "rgba(43,35,32,0.2)"   },
  quoted:         { label: "Quote Received",  bg: "rgba(46,74,158,0.1)",    color: C.indigo,              border: "rgba(46,74,158,0.28)" },
  approved:       { label: "Approved",        bg: "rgba(59,138,147,0.12)",  color: C.teal,                border: "rgba(59,138,147,0.3)" },
  "in-production":{ label: "In Production",  bg: "rgba(212,169,78,0.14)",  color: "#8A6818",             border: "rgba(212,169,78,0.4)" },
  completed:      { label: "Completed",       bg: "rgba(40,120,60,0.1)",    color: "#2A6E38",             border: "rgba(40,120,60,0.28)" },
  declined:       { label: "Declined",        bg: "rgba(122,46,56,0.1)",    color: C.maroon,              border: "rgba(122,46,56,0.28)" },
};

// ── Progress stepper steps ────────────────────────────────────────────────────

const STEPPER_STEPS: { key: RequestStatus; label: string }[] = [
  { key: "submitted",       label: "Submitted" },
  { key: "quoted",          label: "Quote Received" },
  { key: "approved",        label: "Approved" },
  { key: "in-production",   label: "In Production" },
  { key: "completed",       label: "Completed" },
];

const STATUS_ORDER: RequestStatus[] = ["submitted", "quoted", "approved", "in-production", "completed"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtCad(n: number) {
  return `CAD $${n.toLocaleString("en-CA")}`;
}
// ── Ref swatch (color placeholder for uploaded reference images) ───────────────

function RefSwatch({ url, size = 56 }: { url?: string; size?: number }) {
  return (
    <div
      className="shrink-0 overflow-hidden relative rounded-[6px] border border-solid border-[rgba(43,35,32,0.12)] bg-[rgba(43,35,32,0.06)]"
      style={{ width: size, height: size }}
    >
      {url && (
        <img src={url} alt="" className="w-full h-full object-cover block" />
      )}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: RequestStatus }) {
  const s = STATUS_CFG[status];
  return (
    <span
      className="inline-flex items-center gap-[0.3rem] shrink-0 whitespace-nowrap rounded-full py-[0.25rem] px-[0.7rem] border border-solid"
      style={{
        ...label,
        fontSize: "0.6rem",
        letterSpacing: "0.09em",
        backgroundColor: s.bg,
        color: s.color,
        borderColor: s.border,
      }}
    >
      <span
        className="w-[5px] h-[5px] rounded-full shrink-0"
        style={{
          backgroundColor: s.color,
        }}
      />
      {s.label}
    </span>
  );
}

// ── Progress stepper ──────────────────────────────────────────────────────────

function ProgressStepper({ status }: { status: RequestStatus }) {
  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div className="flex items-start gap-0 mt-[0.25rem] overflow-x-auto pb-[0.25rem]">
      {STEPPER_STEPS.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        const dotColor = isDone ? C.teal : isActive ? C.gold : "rgba(43,35,32,0.16)";
        const lineColor = isDone ? C.teal : "rgba(43,35,32,0.12)";
        return (
          <div
            key={step.key}
            className="flex items-start min-w-[72px]"
            style={{
              flex: i < STEPPER_STEPS.length - 1 ? 1 : 0,
            }}
          >
            <div className="flex flex-col items-center gap-[0.4rem] shrink-0">
              <div
                className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 transition-colors duration-200"
                style={{
                  backgroundColor: dotColor,
                  boxShadow: isActive ? `0 0 0 3px rgba(212,169,78,0.22)` : "none",
                }}
              >
                {isDone && (
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {isActive && (
                  <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: C.charcoal }} />
                )}
              </div>
              <div
                className={`text-center whitespace-nowrap leading-[1.3] ${isActive ? 'font-semibold' : ''}`}
                style={{
                  fontFamily: UI,
                  fontSize: "0.63rem",
                  color: isDone || isActive ? C.charcoal : "rgba(43,35,32,0.35)",
                }}
              >
                {step.label}
              </div>
            </div>
            {i < STEPPER_STEPS.length - 1 && (
              <div
                className="flex-1 h-[2px] mt-2 min-w-[16px] transition-colors duration-200"
                style={{
                  backgroundColor: lineColor,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Field display ─────────────────────────────────────────────────────────────

function Field({ lbl, val }: { lbl: string; val: string }) {
  return (
    <div>
      <div
        className="mb-[3px] uppercase font-medium tracking-[0.1em]"
        style={{
          fontSize: "0.6rem",
          color: "rgba(43,35,32,0.38)",
          fontFamily: UI,
        }}
      >
        {lbl}
      </div>
      <div className="leading-[1.5]" style={{ fontSize: "0.82rem", color: C.charcoal, fontFamily: UI }}>
        {val}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="uppercase font-medium mb-[0.75rem] tracking-[0.12em]"
      style={{
        fontSize: "0.6rem",
        color: "rgba(43,35,32,0.38)",
        fontFamily: UI,
      }}
    >
      {children}
    </div>
  );
}

// ── Expanded request detail ────────────────────────────────────────────────────

function ExpandedDetail({
  req,
  onApprove,
}: {
  req: CustomRequest;
  onApprove: () => void;
}) {
  const showStepper =
    req.status === "approved" || req.status === "in-production" || req.status === "completed";
  const showQuoteCard = req.status === "quoted";
  const showDeclineBlock = req.status === "declined" && req.declineReason;

  return (
    <div className="rg-split grid grid-cols-[1fr_280px] gap-8 py-[1.75rem] px-6 border-t border-solid border-[rgba(43,35,32,0.08)] bg-[rgba(250,246,240,0.55)]">
      {/* LEFT column */}
      <div className="flex flex-col gap-[1.75rem]">

        {/* Progress stepper */}
        {showStepper && (
          <div>
            <SectionLabel>Order Progress</SectionLabel>
            <ProgressStepper status={req.status} />
          </div>
        )}

        {/* Submitted details */}
        <div>
          <SectionLabel>Your Submitted Details</SectionLabel>
          <div
            className="flex flex-col gap-4 p-5 rounded-lg bg-white border border-solid border-[rgba(43,35,32,0.09)]"
          >
            <div className="rg-2 grid grid-cols-[1fr_1fr] gap-[0.875rem]">
              <Field lbl="Occasion" val={req.occasion} />
              <Field lbl="Needed By" val={req.neededBy} />
              <Field lbl="Fabric Preference" val={req.fabricPreference} />
              <Field lbl="Colour Preference" val={req.colorPreference} />
            </div>
            {req.notes && (
              <div>
                <div
                  className="uppercase font-medium mb-1 tracking-[0.1em]"
                  style={{
                    fontSize: "0.6rem",
                    color: "rgba(43,35,32,0.38)",
                    fontFamily: UI,
                  }}
                >
                  Additional Notes
                </div>
                <div
                  className="p-3 rounded-[6px] leading-[1.6] bg-[rgba(43,35,32,0.02)] border border-solid border-[rgba(43,35,32,0.06)]"
                  style={{
                    fontSize: "0.82rem",
                    color: C.charcoal,
                    fontFamily: UI,
                  }}
                >
                  {req.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Measurements */}
        <div>
          <SectionLabel>Your Measurements</SectionLabel>
          <div className="rg-3 grid grid-cols-[repeat(3,1fr)] gap-y-[0.75rem] gap-x-4 py-4 px-5 rounded-lg bg-white border border-solid border-[rgba(43,35,32,0.09)]">
            {req.measurements.map((m) => (
              <div key={m.label}>
                <div
                  className="uppercase font-medium tracking-[0.1em]"
                  style={{
                    fontSize: "0.58rem",
                    color: "rgba(43,35,32,0.38)",
                    fontFamily: UI,
                  }}
                >
                  {m.label}
                </div>
                <div
                  className="font-semibold mt-[1px]"
                  style={{
                    fontSize: "0.92rem",
                    color: C.charcoal,
                    fontFamily: UI,
                  }}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reference images */}
        {req.refImages.length > 0 && (
          <div>
            <SectionLabel>Style References Uploaded</SectionLabel>
            <div className="flex gap-[0.625rem] flex-wrap">
              {req.refImages.map((img, i) => (
                <div key={i} className="flex flex-col items-center gap-[0.35rem]">
                  <RefSwatch url={img.url} size={72} />
                  <span style={{ fontSize: "0.62rem", color: "rgba(43,35,32,0.45)", fontFamily: UI }}>{img.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT column */}
      <div className="flex flex-col gap-5">

        {/* Quote card */}
        {showQuoteCard && req.quotedPriceCad && (
          <div
            className="rounded-[10px] overflow-hidden bg-white border-[1.5px] border-solid"
            style={{
              borderColor: C.gold,
            }}
          >
            <div
              className="py-3 px-4 bg-[rgba(212,169,78,0.07)] border-b border-solid border-[rgba(212,169,78,0.2)]"
            >
              <div
                className="uppercase font-semibold tracking-[0.12em]"
                style={{
                  fontSize: "0.62rem",
                  color: "#8A6818",
                  fontFamily: UI,
                }}
              >
                Quote Received
              </div>
            </div>
            <div className="py-[1.125rem] px-4 flex flex-col gap-[0.875rem]">
              <div>
                <div className="uppercase font-medium mb-[3px] tracking-[0.1em]" style={{ fontFamily: UI, fontSize: "0.6rem", color: "rgba(43,35,32,0.38)" }}>
                  Total Price
                </div>
                <div className="font-bold leading-none tracking-[-0.03em]" style={{ fontFamily: UI, fontSize: "1.5rem", color: C.charcoal }}>
                  {fmtCad(req.quotedPriceCad)}
                </div>
              </div>
              {req.estimatedCompletion && (
                <div>
                  <div className="uppercase font-medium mb-[3px] tracking-[0.1em]" style={{ fontFamily: UI, fontSize: "0.6rem", color: "rgba(43,35,32,0.38)" }}>
                    Est. Completion
                  </div>
                  <div className="font-medium" style={{ fontFamily: UI, fontSize: "0.85rem", color: C.charcoal }}>
                    {req.estimatedCompletion}
                  </div>
                </div>
              )}
              {req.storeNotes && (
                <div>
                  <div className="uppercase font-medium mb-[3px] tracking-[0.1em]" style={{ fontFamily: UI, fontSize: "0.6rem", color: "rgba(43,35,32,0.38)" }}>
                    Message from the Store
                  </div>
                  <div
                    className="py-[0.65rem] px-3 rounded-[6px] leading-[1.55] bg-[rgba(43,35,32,0.025)] border border-solid border-[rgba(43,35,32,0.06)]"
                    style={{
                      fontFamily: UI,
                      fontSize: "0.77rem",
                      color: "rgba(43,35,32,0.68)",
                    }}
                  >
                    {req.storeNotes}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={onApprove}
                  className="font-bold cursor-pointer rounded-[6px] p-[0.65rem] tracking-[0.04em] border-none shadow-[0_2px_10px_rgba(212,169,78,0.38)] transition-all duration-150"
                  style={{
                    backgroundColor: C.gold,
                    color: C.charcoal,
                    fontFamily: UI,
                    fontSize: "0.8rem",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 18px rgba(212,169,78,0.52)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 10px rgba(212,169,78,0.38)"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
                >
                  Approve &amp; Pay
                </button>
                <button
                  className="font-medium cursor-pointer rounded-[6px] p-[0.6rem] bg-transparent border-[1.5px] border-solid border-[rgba(43,35,32,0.18)] transition-colors duration-150"
                  style={{
                    color: "rgba(43,35,32,0.55)",
                    fontFamily: UI,
                    fontSize: "0.78rem",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.maroon; (e.currentTarget as HTMLButtonElement).style.color = C.maroon; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(43,35,32,0.18)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(43,35,32,0.55)"; }}
                >
                  Decline Quote
                </button>
              </div>
            </div>
          </div>
        )}

        {/* In production — summary tile */}
        {(req.status === "in-production" || req.status === "approved") && req.quotedPriceCad && (
          <div
            className="flex flex-col gap-[0.625rem] p-4 rounded-lg bg-white border border-solid border-[rgba(43,35,32,0.09)]"
          >
            <div className="uppercase font-medium tracking-[0.1em]" style={{ fontFamily: UI, fontSize: "0.6rem", color: "rgba(43,35,32,0.38)" }}>Agreed Price</div>
            <div className="font-bold tracking-[-0.02em]" style={{ fontFamily: UI, fontSize: "1.15rem", color: C.charcoal }}>{fmtCad(req.quotedPriceCad)}</div>
            {req.estimatedCompletion && (
              <>
                <div className="uppercase font-medium mt-[2px] tracking-[0.1em]" style={{ fontFamily: UI, fontSize: "0.6rem", color: "rgba(43,35,32,0.38)" }}>Est. Completion</div>
                <div className="font-medium" style={{ fontFamily: UI, fontSize: "0.82rem", color: C.charcoal }}>{req.estimatedCompletion}</div>
              </>
            )}
            {req.storeNotes && (
              <>
                <div className="uppercase font-medium mt-[2px] tracking-[0.1em]" style={{ fontFamily: UI, fontSize: "0.6rem", color: "rgba(43,35,32,0.38)" }}>Store Update</div>
                <div className="leading-[1.5]" style={{ fontFamily: UI, fontSize: "0.76rem", color: "rgba(43,35,32,0.65)" }}>{req.storeNotes}</div>
              </>
            )}
          </div>
        )}

        {/* Completed tile */}
        {req.status === "completed" && req.quotedPriceCad && (
          <div
            className="flex flex-col gap-2 p-4 rounded-lg bg-[rgba(40,120,60,0.05)] border border-solid border-[rgba(40,120,60,0.2)]"
          >
            <div className="font-semibold" style={{ fontFamily: UI, fontSize: "0.7rem", color: "#2A6E38" }}>Order complete ✓</div>
            <div className="leading-[1.5]" style={{ fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.6)" }}>
              Total paid: {fmtCad(req.quotedPriceCad)}
            </div>
          </div>
        )}

        {/* Decline reason */}
        {showDeclineBlock && (
          <div
            className="p-4 rounded-lg bg-[rgba(122,46,56,0.04)] border border-solid border-[rgba(122,46,56,0.18)]"
          >
            <div className="uppercase font-semibold mb-[6px] tracking-[0.12em]" style={{ fontFamily: UI, fontSize: "0.6rem", color: C.maroon }}>
              Why It Was Declined
            </div>
            <div className="leading-[1.55]" style={{ fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.65)" }}>
              {req.declineReason}
            </div>
          </div>
        )}

        {/* Message button */}
        <Link
          to="/account/support"
          className="inline-flex items-center gap-2 font-medium w-fit no-underline pb-[1px] border-b border-solid border-[rgba(46,74,158,0.25)]"
          style={{
            fontFamily: UI,
            fontSize: "0.78rem",
            color: C.indigo,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Message about this request
        </Link>
      </div>
    </div>
  );
}

// ── Request card ──────────────────────────────────────────────────────────────

function RequestCard({
  req,
  onApprove,
}: {
  req: CustomRequest;
  onApprove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  // Show thumbnail swatch for first ref image
  const thumb = req.refImages[0];

  return (
    <div
      className="rounded-[10px] overflow-hidden bg-white border border-solid border-[rgba(43,35,32,0.1)] shadow-[0_1px_10px_rgba(43,35,32,0.05)] transition-shadow duration-150"
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 3px 16px rgba(43,35,32,0.09)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 10px rgba(43,35,32,0.05)"; }}
    >
      {/* Card header */}
      <div
        className="py-5 px-6 flex items-start justify-between gap-4"
      >
        {/* Left: thumbnail + info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {thumb && (
            <RefSwatch url={thumb.url} size={48} />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-bold leading-tight mb-[0.2rem]" style={{ fontFamily: UI, fontSize: "0.95rem", color: C.charcoal }}>
              {req.garmentType}
            </div>
            <div className="mb-2" style={{ fontFamily: UI, fontSize: "0.72rem", color: "rgba(43,35,32,0.44)" }}>
              Submitted {req.submittedDate} · #{req.id}
            </div>
            <div style={{ fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.58)" }}>
              {req.summary}
            </div>
          </div>
        </div>

        {/* Right: badge + action */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          <StatusBadge status={req.status} />
          <button
            onClick={() => setExpanded(e => !e)}
            className="font-semibold cursor-pointer whitespace-nowrap rounded-[5px] py-[0.45rem] px-[0.875rem] bg-transparent tracking-[0.04em] border-[1.5px] border-solid transition-colors duration-150"
            style={{
              fontFamily: UI,
              fontSize: "0.72rem",
              color: C.maroon,
              borderColor: C.maroon,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(122,46,56,0.07)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
          >
            {expanded ? "Hide Details" : "View Details"}
          </button>
        </div>
      </div>

      {/* Quote pending CTA strip (visible even when collapsed) */}
      {req.status === "quoted" && !expanded && (
        <div
          className="py-3 px-6 flex items-center justify-between gap-4 border-t border-solid border-[rgba(212,169,78,0.25)] bg-[rgba(212,169,78,0.05)]"
        >
          <div style={{ fontFamily: UI, fontSize: "0.78rem", color: "#8A6818" }}>
            <strong>Quote received:</strong> {req.quotedPriceCad ? fmtCad(req.quotedPriceCad) : ""} — your approval is needed to begin production.
          </div>
          <button
            onClick={() => setExpanded(true)}
            className="font-bold cursor-pointer whitespace-nowrap shrink-0 rounded-[5px] py-[0.45rem] px-[0.875rem] border-none"
            style={{
              backgroundColor: C.gold,
              color: C.charcoal,
              fontFamily: UI,
              fontSize: "0.72rem",
            }}
          >
            Review &amp; Approve
          </button>
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <ExpandedDetail req={req} onApprove={() => onApprove(req.id)} />
      )}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 px-8 text-center rounded-[10px] bg-white border border-solid border-[rgba(43,35,32,0.09)]"
    >
      <div className="mb-5 opacity-20">
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={C.charcoal} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      </div>
      <p className="font-medium mb-2" style={{ fontFamily: DISPLAY, fontSize: "1.25rem", color: C.charcoal }}>
        No custom orders yet
      </p>
      <p className="mb-7 max-w-[320px] leading-relaxed" style={{ fontFamily: UI, fontSize: "0.84rem", color: "rgba(43,35,32,0.5)" }}>
        You haven&apos;t submitted a custom order yet. Start by describing what you&apos;d like made.
      </p>
      <Link
        to="/shop"
        className="inline-block font-bold uppercase no-underline rounded-[5px] py-[0.8rem] px-7 tracking-[0.1em] shadow-[0_2px_12px_rgba(212,169,78,0.35)]"
        style={{
          fontFamily: UI,
          fontSize: "0.75rem",
          color: C.charcoal,
          backgroundColor: C.gold,
        }}
      >
        Start a Custom Order
      </Link>
    </div>
  );
}

// ── Filter tabs ───────────────────────────────────────────────────────────────

type FilterKey = "all" | "active" | "completed" | "declined";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",       label: "All" },
  { key: "active",    label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "declined",  label: "Declined" },
];

function matchesFilter(req: CustomRequest, filter: FilterKey): boolean {
  if (filter === "all") return true;
  if (filter === "completed") return req.status === "completed";
  if (filter === "declined") return req.status === "declined";
  return req.status === "submitted" || req.status === "quoted" || req.status === "approved" || req.status === "in-production";
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CustomOrders({ initialRequests = [] }: { initialRequests?: CustomRequest[] }) {
  const [requests, setRequests] = useState<CustomRequest[]>(initialRequests);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filtered = requests.filter(r => matchesFilter(r, activeFilter));

  const counts: Record<FilterKey, number> = {
    all:       requests.length,
    active:    requests.filter(r => matchesFilter(r, "active")).length,
    completed: requests.filter(r => r.status === "completed").length,
    declined:  requests.filter(r => r.status === "declined").length,
  };

  function handleApprove(id: string) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" as RequestStatus } : r));
  }

  const hasRequests = requests.length > 0;

  return (
    <AccountShell>
      {/* Page heading row */}
      <div
        className="flex items-end justify-between gap-4 mb-8 flex-wrap"
      >
        <div>
          <h1
            className="font-medium leading-[1.1] m-0 mb-[0.35rem] tracking-[-0.015em]"
            style={{
              fontFamily: DISPLAY,
              fontSize: "2rem",
              color: C.charcoal,
            }}
          >
            My Custom Orders
          </h1>
          <p className="m-0 leading-relaxed" style={{ fontFamily: UI, fontSize: "0.84rem", color: "rgba(43,35,32,0.48)" }}>
            Track your bespoke garment requests from submission through to delivery.
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-[0.4rem] font-bold uppercase no-underline rounded-[5px] py-[0.7rem] px-5 shrink-0 tracking-[0.08em] shadow-[0_2px_10px_rgba(212,169,78,0.35)] transition-all duration-150"
          style={{
            fontFamily: UI,
            fontSize: "0.75rem",
            color: C.charcoal,
            backgroundColor: C.gold,
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow = "0 4px 18px rgba(212,169,78,0.5)"; el.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow = "0 2px 10px rgba(212,169,78,0.35)"; el.style.transform = "none"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Start a New Request
        </Link>
      </div>

      {hasRequests ? (
        <>
          {/* Filter tabs */}
          <div className="flex gap-0 mb-6 border-b border-solid border-[rgba(43,35,32,0.12)]">
            {FILTERS.map(f => {
              const isActive = activeFilter === f.key;
              const count = counts[f.key];
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`bg-none cursor-pointer uppercase flex items-center gap-[0.375rem] py-3 px-[1.1rem] -mb-[1px] border-none border-b-2 border-solid tracking-[0.1em] transition-colors duration-150 ${isActive ? 'font-bold border-gold' : 'font-medium border-transparent'}`}
                  style={{
                    fontFamily: UI,
                    fontSize: "0.72rem",
                    color: isActive ? C.charcoal : "rgba(43,35,32,0.45)",
                    borderColor: isActive ? C.gold : "transparent",
                  }}
                >
                  {f.label}
                  {count > 0 && (
                    <span
                      className="font-bold rounded-[10px] py-[1px] px-[6px] leading-[1.6]"
                      style={{
                        fontFamily: UI,
                        fontSize: "0.58rem",
                        backgroundColor: isActive ? C.gold : "rgba(43,35,32,0.1)",
                        color: isActive ? C.charcoal : "rgba(43,35,32,0.5)",
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Request list or filter-empty state */}
          {filtered.length === 0 ? (
            <div
              className="py-14 px-8 text-center rounded-[10px] bg-white border border-solid border-[rgba(43,35,32,0.09)]"
            >
              <p className="m-0" style={{ fontFamily: UI, fontSize: "0.88rem", color: "rgba(43,35,32,0.48)" }}>
                No {activeFilter === "all" ? "" : activeFilter} requests found.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map(req => (
                <RequestCard key={req.id} req={req} onApprove={handleApprove} />
              ))}
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </AccountShell>
  );
}
