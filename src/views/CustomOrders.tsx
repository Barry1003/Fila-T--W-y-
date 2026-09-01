'use client';

import { useState } from "react";
import { Link } from '@/lib/router';
import AccountShell from "../components/AccountShell";
import { C, DISPLAY, UI, label } from "../tokens";

// ── Types ─────────────────────────────────────────────────────────────────────

type RequestStatus = "submitted" | "quoted" | "approved" | "in-production" | "completed" | "declined";

type Measurement = { label: string; value: string };

type CustomRequest = {
  id: string;
  garmentType: string;
  summary: string;
  submittedDate: string;
  status: RequestStatus;
  occasion: string;
  neededBy: string;
  measurements: Measurement[];
  fabricPreference: string;
  colorPreference: string;
  notes: string;
  refImages: { bg: string; label: string }[];
  quotedPriceGBP?: number;
  quotedPriceNGN?: number;
  estimatedCompletion?: string;
  storeNotes?: string;
  declineReason?: string;
};

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

// ── Seed data ─────────────────────────────────────────────────────────────────

const MY_REQUESTS: CustomRequest[] = [
  {
    id: "FTW-CO-2026-008",
    garmentType: "3-Piece Custom Agbada",
    summary: "Custom Agbada — needed by Dec 14, 2026",
    submittedDate: "Sep 1, 2026",
    status: "quoted",
    occasion: "Traditional wedding ceremony",
    neededBy: "Dec 14, 2026",
    measurements: [
      { label: "Chest",          value: "44\"" },
      { label: "Waist",          value: "38\"" },
      { label: "Hip",            value: "42\"" },
      { label: "Shoulder Width", value: "19\"" },
      { label: "Sleeve Length",  value: "27.5\"" },
      { label: "Body Length",    value: "30\"" },
      { label: "Neck",           value: "17\"" },
      { label: "Kaftan Length",  value: "60\"" },
    ],
    fabricPreference: "Heavy Aso-Oke — woven textured finish, not smooth",
    colorPreference: "Deep royal blue with gold embroidery detailing",
    notes: "Needed for my traditional wedding. Requesting a matching Fila cap in the same fabric. Please include extra embroidery at the collar and chest panel.",
    refImages: [
      { bg: "#2E4A9E", label: "Style ref 1" },
      { bg: "#8A6818", label: "Embroidery ref" },
    ],
    quotedPriceGBP: 850,
    quotedPriceNGN: 1258905,
    estimatedCompletion: "Dec 8, 2026",
    storeNotes: "We have the royal blue Aso-Oke in stock. Embroidery on collar and chest is confirmed. We'll share a fabric swatch photo before cutting. Please approve so we can begin sourcing.",
  },
  {
    id: "FTW-CO-2026-005",
    garmentType: "Tailored Senator Suit (2-piece)",
    summary: "Senator Suit — needed by Nov 28, 2026",
    submittedDate: "Aug 28, 2026",
    status: "in-production",
    occasion: "Corporate gala dinner",
    neededBy: "Nov 28, 2026",
    measurements: [
      { label: "Chest",          value: "40\"" },
      { label: "Waist",          value: "34\"" },
      { label: "Hip",            value: "40\"" },
      { label: "Shoulder Width", value: "18\"" },
      { label: "Sleeve Length",  value: "26.5\"" },
      { label: "Body Length",    value: "29\"" },
      { label: "Neck",           value: "15.5\"" },
      { label: "Trouser Waist",  value: "34\"" },
      { label: "Trouser Inseam", value: "32\"" },
    ],
    fabricPreference: "Premium linen blend — breathable but structured",
    colorPreference: "Charcoal grey with off-white contrast piping on collar and pocket trim",
    notes: "Clean modern senator cut. No embroidery. Trousers should have a slight taper.",
    refImages: [
      { bg: "#2B2320", label: "Style ref" },
      { bg: "#888", label: "Fabric swatch" },
    ],
    quotedPriceGBP: 520,
    quotedPriceNGN: 769676,
    estimatedCompletion: "Nov 20, 2026",
    storeNotes: "Linen sourced. Pattern cut confirmed. We will send you progress photos by Nov 10.",
  },
  {
    id: "FTW-CO-2026-001",
    garmentType: "Custom Gele & Wrapper Set",
    summary: "Gele & Wrapper — church thanksgiving",
    submittedDate: "Jun 10, 2026",
    status: "completed",
    occasion: "Church thanksgiving & reception",
    neededBy: "Jul 4, 2026",
    measurements: [
      { label: "Bust",         value: "36\"" },
      { label: "Waist",        value: "30\"" },
      { label: "Hip",          value: "40\"" },
      { label: "Skirt Length", value: "44\"" },
    ],
    fabricPreference: "Silk Aso-Oke — lightweight, high drape",
    colorPreference: "Coral pink with gold woven stripe",
    notes: "Delivered and I loved it! The gele fold instructions card was a lovely touch.",
    refImages: [
      { bg: "#E87050", label: "Colour ref" },
    ],
    quotedPriceGBP: 440,
    quotedPriceNGN: 651772,
    estimatedCompletion: "Jun 28, 2026",
  },
  {
    id: "FTW-CO-2025-014",
    garmentType: "Embroidered Kaftan (Bespoke)",
    summary: "Kaftan — Valentine dinner",
    submittedDate: "Jan 5, 2026",
    status: "declined",
    occasion: "Valentine dinner",
    neededBy: "Feb 10, 2026",
    measurements: [
      { label: "Chest",         value: "40\"" },
      { label: "Waist",         value: "34\"" },
      { label: "Kaftan Length", value: "56\"" },
    ],
    fabricPreference: "Velvet — deep plum",
    colorPreference: "Deep plum with silver thread embroidery",
    notes: "Needed delivery in 5 days.",
    refImages: [
      { bg: "#5A1B7A", label: "Style ref" },
    ],
    declineReason: "Requested timeline of 5 days is not feasible for bespoke embroidery work. Minimum lead time for this garment type is 3 weeks. We'd love to make this for a future occasion — please resubmit with more lead time.",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtGBP(n: number) {
  return `£${n.toLocaleString("en-GB")}`;
}
function fmtNGN(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

// ── Ref swatch (color placeholder for uploaded reference images) ───────────────

function RefSwatch({ bg, size = 56 }: { bg: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        backgroundColor: bg,
        border: "1px solid rgba(43,35,32,0.12)",
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <svg width={size} height={size} style={{ position: "absolute", inset: 0, opacity: 0.12 }}>
        <pattern id={`h-${bg.replace("#", "")}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="6" x2="6" y2="0" stroke="#fff" strokeWidth="0.8" />
        </pattern>
        <rect width={size} height={size} fill={`url(#h-${bg.replace("#", "")})`} />
      </svg>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: RequestStatus }) {
  const s = STATUS_CFG[status];
  return (
    <span
      style={{
        ...label,
        fontSize: "0.6rem",
        letterSpacing: "0.09em",
        padding: "0.25rem 0.7rem",
        borderRadius: 100,
        whiteSpace: "nowrap",
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: s.color,
          flexShrink: 0,
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
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, marginTop: "0.25rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
      {STEPPER_STEPS.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        const dotColor = isDone ? C.teal : isActive ? C.gold : "rgba(43,35,32,0.16)";
        const lineColor = isDone ? C.teal : "rgba(43,35,32,0.12)";
        return (
          <div
            key={step.key}
            style={{
              display: "flex",
              alignItems: "flex-start",
              flex: i < STEPPER_STEPS.length - 1 ? 1 : 0,
              minWidth: 72,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: dotColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: isActive ? `0 0 0 3px rgba(212,169,78,0.22)` : "none",
                  transition: "background-color 0.2s",
                }}
              >
                {isDone && (
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {isActive && (
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.charcoal }} />
                )}
              </div>
              <div
                style={{
                  fontFamily: UI,
                  fontSize: "0.63rem",
                  color: isDone || isActive ? C.charcoal : "rgba(43,35,32,0.35)",
                  fontWeight: isActive ? 600 : 400,
                  textAlign: "center",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </div>
            </div>
            {i < STEPPER_STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: lineColor,
                  marginTop: 8,
                  minWidth: 16,
                  transition: "background-color 0.2s",
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
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(43,35,32,0.38)",
          fontWeight: 500,
          marginBottom: "3px",
          fontFamily: UI,
        }}
      >
        {lbl}
      </div>
      <div style={{ fontSize: "0.82rem", color: C.charcoal, lineHeight: 1.5, fontFamily: UI }}>
        {val}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.6rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(43,35,32,0.38)",
        fontWeight: 500,
        fontFamily: UI,
        marginBottom: "0.75rem",
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
    <div className="rg-split"
      style={{
        borderTop: "1px solid rgba(43,35,32,0.08)",
        backgroundColor: "rgba(250,246,240,0.55)",
        padding: "1.75rem 1.5rem",
        display: "grid",
        gridTemplateColumns: "1fr 280px",
        gap: "2rem",
      }}
    >
      {/* LEFT column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

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
            style={{
              backgroundColor: "#fff",
              border: "1px solid rgba(43,35,32,0.09)",
              borderRadius: 8,
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
              <Field lbl="Occasion" val={req.occasion} />
              <Field lbl="Needed By" val={req.neededBy} />
              <Field lbl="Fabric Preference" val={req.fabricPreference} />
              <Field lbl="Colour Preference" val={req.colorPreference} />
            </div>
            {req.notes && (
              <div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(43,35,32,0.38)",
                    fontWeight: 500,
                    marginBottom: 4,
                    fontFamily: UI,
                  }}
                >
                  Additional Notes
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: C.charcoal,
                    lineHeight: 1.6,
                    fontFamily: UI,
                    backgroundColor: "rgba(43,35,32,0.02)",
                    border: "1px solid rgba(43,35,32,0.06)",
                    borderRadius: 6,
                    padding: "0.75rem",
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
          <div className="rg-3"
            style={{
              backgroundColor: "#fff",
              border: "1px solid rgba(43,35,32,0.09)",
              borderRadius: 8,
              padding: "1rem 1.25rem",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem 1rem",
            }}
          >
            {req.measurements.map((m) => (
              <div key={m.label}>
                <div
                  style={{
                    fontSize: "0.58rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(43,35,32,0.38)",
                    fontWeight: 500,
                    fontFamily: UI,
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: 600,
                    color: C.charcoal,
                    fontFamily: UI,
                    marginTop: 1,
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
            <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
              {req.refImages.map((img, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
                  <RefSwatch bg={img.bg} size={72} />
                  <span style={{ fontSize: "0.62rem", color: "rgba(43,35,32,0.45)", fontFamily: UI }}>{img.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Quote card */}
        {showQuoteCard && req.quotedPriceGBP && (
          <div
            style={{
              backgroundColor: "#fff",
              border: `1.5px solid ${C.gold}`,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(212,169,78,0.07)",
                padding: "0.75rem 1rem",
                borderBottom: "1px solid rgba(212,169,78,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#8A6818",
                  fontWeight: 600,
                  fontFamily: UI,
                }}
              >
                Quote Received
              </div>
            </div>
            <div style={{ padding: "1.125rem 1rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div>
                <div style={{ fontFamily: UI, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500, marginBottom: 3 }}>
                  Total Price
                </div>
                <div style={{ fontFamily: UI, fontSize: "1.5rem", fontWeight: 700, color: C.charcoal, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {fmtGBP(req.quotedPriceGBP)}
                </div>
                <div style={{ fontFamily: UI, fontSize: "0.72rem", color: "rgba(43,35,32,0.42)", marginTop: 3 }}>
                  ≈ {fmtNGN(req.quotedPriceGBP * 1481)}
                </div>
              </div>
              {req.estimatedCompletion && (
                <div>
                  <div style={{ fontFamily: UI, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500, marginBottom: 3 }}>
                    Est. Completion
                  </div>
                  <div style={{ fontFamily: UI, fontSize: "0.85rem", fontWeight: 500, color: C.charcoal }}>
                    {req.estimatedCompletion}
                  </div>
                </div>
              )}
              {req.storeNotes && (
                <div>
                  <div style={{ fontFamily: UI, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500, marginBottom: 3 }}>
                    Message from the Store
                  </div>
                  <div
                    style={{
                      fontFamily: UI,
                      fontSize: "0.77rem",
                      color: "rgba(43,35,32,0.68)",
                      lineHeight: 1.55,
                      backgroundColor: "rgba(43,35,32,0.025)",
                      border: "1px solid rgba(43,35,32,0.06)",
                      borderRadius: 6,
                      padding: "0.65rem 0.75rem",
                    }}
                  >
                    {req.storeNotes}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingTop: "0.25rem" }}>
                <button
                  onClick={onApprove}
                  style={{
                    backgroundColor: C.gold,
                    color: C.charcoal,
                    border: "none",
                    borderRadius: 6,
                    padding: "0.65rem",
                    fontFamily: UI,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                    boxShadow: "0 2px 10px rgba(212,169,78,0.38)",
                    transition: "box-shadow 0.15s, transform 0.1s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 18px rgba(212,169,78,0.52)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 10px rgba(212,169,78,0.38)"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
                >
                  Approve &amp; Pay
                </button>
                <button
                  style={{
                    backgroundColor: "transparent",
                    color: "rgba(43,35,32,0.55)",
                    border: "1.5px solid rgba(43,35,32,0.18)",
                    borderRadius: 6,
                    padding: "0.6rem",
                    fontFamily: UI,
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "border-color 0.12s, color 0.12s",
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
        {(req.status === "in-production" || req.status === "approved") && req.quotedPriceGBP && (
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid rgba(43,35,32,0.09)",
              borderRadius: 8,
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
            }}
          >
            <div style={{ fontFamily: UI, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500 }}>Agreed Price</div>
            <div style={{ fontFamily: UI, fontSize: "1.15rem", fontWeight: 700, color: C.charcoal, letterSpacing: "-0.02em" }}>{fmtGBP(req.quotedPriceGBP)}</div>
            <div style={{ fontFamily: UI, fontSize: "0.7rem", color: "rgba(43,35,32,0.42)" }}>≈ {fmtNGN(req.quotedPriceGBP * 1481)}</div>
            {req.estimatedCompletion && (
              <>
                <div style={{ fontFamily: UI, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500, marginTop: 2 }}>Est. Completion</div>
                <div style={{ fontFamily: UI, fontSize: "0.82rem", fontWeight: 500, color: C.charcoal }}>{req.estimatedCompletion}</div>
              </>
            )}
            {req.storeNotes && (
              <>
                <div style={{ fontFamily: UI, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500, marginTop: 2 }}>Store Update</div>
                <div style={{ fontFamily: UI, fontSize: "0.76rem", color: "rgba(43,35,32,0.65)", lineHeight: 1.5 }}>{req.storeNotes}</div>
              </>
            )}
          </div>
        )}

        {/* Completed tile */}
        {req.status === "completed" && req.quotedPriceGBP && (
          <div
            style={{
              backgroundColor: "rgba(40,120,60,0.05)",
              border: "1px solid rgba(40,120,60,0.2)",
              borderRadius: 8,
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div style={{ fontFamily: UI, fontSize: "0.7rem", fontWeight: 600, color: "#2A6E38" }}>Order complete ✓</div>
            <div style={{ fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.6)", lineHeight: 1.5 }}>
              Total paid: {fmtGBP(req.quotedPriceGBP)}<br />≈ {fmtNGN(req.quotedPriceGBP * 1481)}
            </div>
          </div>
        )}

        {/* Decline reason */}
        {showDeclineBlock && (
          <div
            style={{
              backgroundColor: "rgba(122,46,56,0.04)",
              border: "1px solid rgba(122,46,56,0.18)",
              borderRadius: 8,
              padding: "1rem",
            }}
          >
            <div style={{ fontFamily: UI, fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.maroon, fontWeight: 600, marginBottom: 6 }}>
              Why It Was Declined
            </div>
            <div style={{ fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.65)", lineHeight: 1.55 }}>
              {req.declineReason}
            </div>
          </div>
        )}

        {/* Message button */}
        <Link
          to="/account/support"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: UI,
            fontSize: "0.78rem",
            fontWeight: 500,
            color: C.indigo,
            textDecorationLine: "none",
            borderBottom: "1px solid rgba(46,74,158,0.25)",
            paddingBottom: 1,
            width: "fit-content",
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
      style={{
        backgroundColor: "#fff",
        borderRadius: 10,
        border: "1px solid rgba(43,35,32,0.1)",
        boxShadow: "0 1px 10px rgba(43,35,32,0.05)",
        overflow: "hidden",
        transition: "box-shadow 0.18s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 3px 16px rgba(43,35,32,0.09)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 10px rgba(43,35,32,0.05)"; }}
    >
      {/* Card header */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Left: thumbnail + info */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flex: 1, minWidth: 0 }}>
          {thumb && (
            <RefSwatch bg={thumb.bg} size={48} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: UI, fontSize: "0.95rem", fontWeight: 700, color: C.charcoal, lineHeight: 1.25, marginBottom: "0.2rem" }}>
              {req.garmentType}
            </div>
            <div style={{ fontFamily: UI, fontSize: "0.72rem", color: "rgba(43,35,32,0.44)", marginBottom: "0.5rem" }}>
              Submitted {req.submittedDate} · #{req.id}
            </div>
            <div style={{ fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.58)" }}>
              {req.summary}
            </div>
          </div>
        </div>

        {/* Right: badge + action */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem", flexShrink: 0 }}>
          <StatusBadge status={req.status} />
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              fontFamily: UI,
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: C.maroon,
              backgroundColor: "transparent",
              border: `1.5px solid ${C.maroon}`,
              borderRadius: 5,
              padding: "0.45rem 0.875rem",
              cursor: "pointer",
              transition: "background-color 0.12s, color 0.12s",
              whiteSpace: "nowrap",
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
          style={{
            borderTop: "1px solid rgba(212,169,78,0.25)",
            backgroundColor: "rgba(212,169,78,0.05)",
            padding: "0.75rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ fontFamily: UI, fontSize: "0.78rem", color: "#8A6818" }}>
            <strong>Quote received:</strong> {req.quotedPriceGBP ? fmtGBP(req.quotedPriceGBP) : ""} — your approval is needed to begin production.
          </div>
          <button
            onClick={() => setExpanded(true)}
            style={{
              backgroundColor: C.gold,
              color: C.charcoal,
              border: "none",
              borderRadius: 5,
              padding: "0.45rem 0.875rem",
              fontFamily: UI,
              fontSize: "0.72rem",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
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
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 2rem",
        textAlign: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        border: "1px solid rgba(43,35,32,0.09)",
      }}
    >
      <div style={{ marginBottom: "1.25rem", opacity: 0.2 }}>
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={C.charcoal} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      </div>
      <p style={{ fontFamily: DISPLAY, fontSize: "1.25rem", color: C.charcoal, fontWeight: 500, marginBottom: "0.5rem" }}>
        No custom orders yet
      </p>
      <p style={{ fontFamily: UI, fontSize: "0.84rem", color: "rgba(43,35,32,0.5)", marginBottom: "1.75rem", maxWidth: 320, lineHeight: 1.65 }}>
        You haven&apos;t submitted a custom order yet. Start by describing what you&apos;d like made.
      </p>
      <Link
        to="/shop"
        style={{
          display: "inline-block",
          fontFamily: UI,
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: C.charcoal,
          backgroundColor: C.gold,
          textDecorationLine: "none",
          borderRadius: 5,
          padding: "0.8rem 1.75rem",
          boxShadow: "0 2px 12px rgba(212,169,78,0.35)",
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

export default function CustomOrders() {
  const [requests, setRequests] = useState<CustomRequest[]>(MY_REQUESTS);
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
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: "2rem",
              fontWeight: 500,
              color: C.charcoal,
              letterSpacing: "-0.015em",
              lineHeight: 1.1,
              margin: 0,
              marginBottom: "0.35rem",
            }}
          >
            My Custom Orders
          </h1>
          <p style={{ fontFamily: UI, fontSize: "0.84rem", color: "rgba(43,35,32,0.48)", margin: 0, lineHeight: 1.5 }}>
            Track your bespoke garment requests from submission through to delivery.
          </p>
        </div>

        <Link
          to="/shop"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontFamily: UI,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.charcoal,
            backgroundColor: C.gold,
            textDecorationLine: "none",
            borderRadius: 5,
            padding: "0.7rem 1.25rem",
            boxShadow: "0 2px 10px rgba(212,169,78,0.35)",
            flexShrink: 0,
            transition: "box-shadow 0.15s, transform 0.1s",
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
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(43,35,32,0.12)", marginBottom: "1.5rem" }}>
            {FILTERS.map(f => {
              const isActive = activeFilter === f.key;
              const count = counts[f.key];
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: UI,
                    fontSize: "0.72rem",
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: isActive ? C.charcoal : "rgba(43,35,32,0.45)",
                    padding: "0.75rem 1.1rem",
                    borderBottom: isActive ? `2px solid ${C.gold}` : "2px solid transparent",
                    marginBottom: "-1px",
                    transition: "color 0.15s, border-color 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  {f.label}
                  {count > 0 && (
                    <span
                      style={{
                        fontFamily: UI,
                        fontSize: "0.58rem",
                        fontWeight: 700,
                        backgroundColor: isActive ? C.gold : "rgba(43,35,32,0.1)",
                        color: isActive ? C.charcoal : "rgba(43,35,32,0.5)",
                        borderRadius: 10,
                        padding: "1px 6px",
                        lineHeight: 1.6,
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
              style={{
                padding: "3.5rem 2rem",
                textAlign: "center",
                backgroundColor: "#fff",
                borderRadius: 10,
                border: "1px solid rgba(43,35,32,0.09)",
              }}
            >
              <p style={{ fontFamily: UI, fontSize: "0.88rem", color: "rgba(43,35,32,0.48)", margin: 0 }}>
                No {activeFilter === "all" ? "" : activeFilter} requests found.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
