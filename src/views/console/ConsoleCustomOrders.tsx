'use client';

import { useState } from "react";
import { C, UI } from "../../tokens";

// ── Types ─────────────────────────────────────────────────────────────────────

type RequestStatus = "new" | "quoted" | "approved" | "in-production" | "completed" | "declined";

interface Measurement {
  label: string;
  value: string;
}

interface CustomRequest {
  id: string;
  garmentType: string;
  submittedDate: string;
  status: RequestStatus;
  customer: { name: string; email: string; phone: string; location: string };
  occasion: string;
  neededBy: string;
  measurements: Measurement[];
  fabricPreference: string;
  colorPreference: string;
  additionalNotes: string;
  refImages: { bg: string; label: string }[];
  quotedPrice?: number;
  estimatedCompletion?: string;
  declineReason?: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const REQUESTS: CustomRequest[] = [
  {
    id: "r1",
    garmentType: "3-Piece Custom Agbada",
    submittedDate: "1 Sep 2026",
    status: "new",
    customer: { name: "Emeka Okafor", email: "emeka.okafor@gmail.com", phone: "+44 7700 914 022", location: "London, UK" },
    occasion: "Traditional wedding ceremony",
    neededBy: "14 Dec 2026",
    measurements: [
      { label: "Chest", value: "44\"" }, { label: "Waist", value: "38\"" },
      { label: "Hip", value: "42\"" }, { label: "Shoulder width", value: "19\"" },
      { label: "Sleeve length", value: "27.5\"" }, { label: "Body length", value: "30\"" },
      { label: "Neck", value: "17\"" }, { label: "Kaftan length", value: "60\"" },
    ],
    fabricPreference: "Heavy Aso-Oke — prefers the woven textured finish, not smooth",
    colorPreference: "Deep royal blue with gold embroidery detailing",
    additionalNotes: "This is for my traditional wedding. Needs to be paired with a Fila cap in matching fabric. Please include extra embroidery at the collar and chest panel. My brother (same build) may want a second set.",
    refImages: [
      { bg: "#2E4A9E", label: "Style ref 1" },
      { bg: "#8A6818", label: "Style ref 2" },
      { bg: "#3B5A9E", label: "Embroidery ref" },
    ],
  },
  {
    id: "r2",
    garmentType: "Bride's Aso-Oke Set (Gele, Ipele & Iro)",
    submittedDate: "30 Aug 2026",
    status: "quoted",
    customer: { name: "Adaeze Obi", email: "adaeze.obi@outlook.com", phone: "+44 7823 119 445", location: "Birmingham, UK" },
    occasion: "Traditional engagement ceremony",
    neededBy: "5 Jan 2027",
    measurements: [
      { label: "Bust", value: "36\"" }, { label: "Waist", value: "30\"" },
      { label: "Hip", value: "40\"" }, { label: "Shoulder width", value: "15.5\"" },
      { label: "Sleeve length", value: "22\"" }, { label: "Body length", value: "24\"" },
      { label: "Skirt length", value: "44\"" }, { label: "Neck", value: "13.5\"" },
    ],
    fabricPreference: "Silk-woven Aso-Oke — must have visible sheen",
    colorPreference: "Burnt orange with champagne gold woven thread",
    additionalNotes: "I am the bride. The ipele must drape properly over the left shoulder. Please also advise on the gele stiffening process — I want the fan fold style.",
    refImages: [
      { bg: "#C4501A", label: "Colour ref" },
      { bg: "#D4A94E", label: "Gele style" },
    ],
    quotedPrice: 680,
    estimatedCompletion: "22 Dec 2026",
  },
  {
    id: "r3",
    garmentType: "Tailored Senator Suit (2-piece)",
    submittedDate: "28 Aug 2026",
    status: "approved",
    customer: { name: "Femi Adeyemi", email: "f.adeyemi@business.com", phone: "+44 7711 203 887", location: "Manchester, UK" },
    occasion: "Corporate gala dinner",
    neededBy: "28 Nov 2026",
    measurements: [
      { label: "Chest", value: "40\"" }, { label: "Waist", value: "34\"" },
      { label: "Hip", value: "40\"" }, { label: "Shoulder width", value: "18\"" },
      { label: "Sleeve length", value: "26.5\"" }, { label: "Body length", value: "29\"" },
      { label: "Neck", value: "15.5\"" }, { label: "Trouser waist", value: "34\"" },
      { label: "Trouser inseam", value: "32\"" }, { label: "Trouser outseam", value: "43\"" },
    ],
    fabricPreference: "Premium linen blend — breathable but structured",
    colorPreference: "Charcoal grey with subtle pin-dot weave. No embroidery.",
    additionalNotes: "Clean, modern senator cut. No embroidery. I want contrast piping on the collar and pocket trim in off-white. Trousers should have a slight taper.",
    refImages: [
      { bg: "#2B2320", label: "Style ref" },
      { bg: "#555", label: "Fabric swatch" },
    ],
    quotedPrice: 520,
    estimatedCompletion: "15 Nov 2026",
  },
  {
    id: "r4",
    garmentType: "Hand-embroidered Agbada (Full Set)",
    submittedDate: "25 Aug 2026",
    status: "in-production",
    customer: { name: "Chidi Nwachukwu", email: "chidi.n@email.com", phone: "+44 7900 441 556", location: "Leeds, UK" },
    occasion: "New Year gala celebration",
    neededBy: "26 Dec 2026",
    measurements: [
      { label: "Chest", value: "46\"" }, { label: "Waist", value: "40\"" },
      { label: "Hip", value: "44\"" }, { label: "Shoulder width", value: "20\"" },
      { label: "Sleeve length", value: "28\"" }, { label: "Body length", value: "31\"" },
      { label: "Neck", value: "17.5\"" }, { label: "Kaftan length", value: "62\"" },
    ],
    fabricPreference: "Aso-Oke — ivory base, heavy weight",
    colorPreference: "Ivory with emerald green hand-embroidered geometric pattern",
    additionalNotes: "The embroidery pattern should reference traditional Igbo geometric motifs. I've sent reference images. Please confirm the pattern placement on chest and cuffs before cutting.",
    refImages: [
      { bg: "#2A5E3A", label: "Embroidery pattern" },
      { bg: "#F0E8D8", label: "Fabric base" },
      { bg: "#1A4A28", label: "Motif detail" },
    ],
    quotedPrice: 890,
    estimatedCompletion: "18 Dec 2026",
  },
  {
    id: "r5",
    garmentType: "Custom Gele & Wrapper Set",
    submittedDate: "10 Aug 2026",
    status: "completed",
    customer: { name: "Nnenna Okeke", email: "nnenna.okeke@gmail.com", phone: "+44 7812 334 001", location: "London, UK" },
    occasion: "Church thanksgiving & wedding reception",
    neededBy: "24 Aug 2026",
    measurements: [
      { label: "Bust", value: "38\"" }, { label: "Waist", value: "33\"" },
      { label: "Hip", value: "44\"" }, { label: "Body length", value: "26\"" },
      { label: "Skirt length", value: "46\"" }, { label: "Neck", value: "14\"" },
    ],
    fabricPreference: "Silk Aso-Oke — lightweight, high drape",
    colorPreference: "Coral pink with gold woven stripe",
    additionalNotes: "Delivered and customer confirmed receipt. She loved the gele fold instructions card we included.",
    refImages: [
      { bg: "#E87050", label: "Colour match" },
    ],
    quotedPrice: 440,
    estimatedCompletion: "20 Aug 2026",
  },
  {
    id: "r6",
    garmentType: "Embroidered Kaftan (Bespoke)",
    submittedDate: "5 Aug 2026",
    status: "declined",
    customer: { name: "Tunde Bakare", email: "tunde.b@email.com", phone: "+44 7755 882 113", location: "Bristol, UK" },
    occasion: "Valentine dinner",
    neededBy: "10 Feb 2026",
    measurements: [
      { label: "Chest", value: "38\"" }, { label: "Waist", value: "32\"" },
      { label: "Hip", value: "38\"" }, { label: "Kaftan length", value: "56\"" },
    ],
    fabricPreference: "Velvet — deep plum",
    colorPreference: "Deep plum with silver thread embroidery",
    additionalNotes: "Needs delivery in 5 days — very tight timeline.",
    refImages: [
      { bg: "#5A1B7A", label: "Style ref" },
    ],
    declineReason: "Requested timeline of 5 days is not feasible for bespoke embroidery work. Minimum lead time for this garment type is 3 weeks.",
  },
];

// ── Status config ─────────────────────────────────────────────────────────────

type StatusCfg = { label: string; bg: string; color: string };

const STATUS_CFG: Record<RequestStatus, StatusCfg> = {
  "new":           { label: "New",           bg: "rgba(43,35,32,0.07)",    color: "rgba(43,35,32,0.6)" },
  "quoted":        { label: "Quoted",        bg: "rgba(46,74,158,0.1)",    color: "#2E4A9E" },
  "approved":      { label: "Approved",      bg: "rgba(59,138,147,0.12)",  color: C.teal },
  "in-production": { label: "In Production", bg: "rgba(212,169,78,0.14)",  color: "#8A6818" },
  "completed":     { label: "Completed",     bg: "rgba(40,120,60,0.1)",    color: "#2A6E38" },
  "declined":      { label: "Declined",      bg: "rgba(122,46,56,0.1)",    color: C.maroon },
};

type TabKey = "all" | RequestStatus;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all",           label: "All" },
  { key: "new",           label: "New" },
  { key: "quoted",        label: "Quoted" },
  { key: "approved",      label: "Approved" },
  { key: "in-production", label: "In Production" },
  { key: "completed",     label: "Completed" },
  { key: "declined",      label: "Declined" },
];

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function CalIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function UserIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ChatIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ChevronDown({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ZoomIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

// ── StatusBadge ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: RequestStatus }) {
  const s = STATUS_CFG[status];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 100,
        fontSize: "0.68rem",
        fontWeight: 500,
        backgroundColor: s.bg,
        color: s.color,
        whiteSpace: "nowrap",
        fontFamily: UI,
        letterSpacing: "0.01em",
      }}
    >
      {s.label}
    </span>
  );
}

// ── Ref image swatch (colored placeholder) ────────────────────────────────────

function RefSwatch({ bg, size = 48 }: { bg: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        backgroundColor: bg,
        border: "1px solid rgba(43,35,32,0.12)",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Fabric-like cross-hatch overlay */}
      <svg width={size} height={size} style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
        <pattern id={`hatch-${bg.replace("#", "")}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="6" x2="6" y2="0" stroke="#fff" strokeWidth="0.8" />
        </pattern>
        <rect width={size} height={size} fill={`url(#hatch-${bg.replace("#", "")})`} />
      </svg>
    </div>
  );
}

// ── RequestCard ───────────────────────────────────────────────────────────────

function RequestCard({ req, onOpen }: { req: CustomRequest; onOpen: () => void }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 10,
        border: "1px solid rgba(43,35,32,0.08)",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.875rem",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(43,35,32,0.08)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      {/* Top row: garment + date | status */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
        <div>
          <div style={{ fontSize: "0.95rem", fontWeight: 600, color: C.charcoal, lineHeight: 1.25 }}>
            {req.garmentType}
          </div>
          <div style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.42)", marginTop: "3px" }}>
            Submitted {req.submittedDate}
          </div>
        </div>
        <StatusBadge status={req.status} />
      </div>

      {/* Customer + occasion row */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "rgba(43,35,32,0.55)", fontSize: "0.78rem" }}>
          <UserIcon size={13} />
          <span style={{ fontWeight: 500, color: C.charcoal }}>{req.customer.name}</span>
          <span style={{ color: "rgba(43,35,32,0.35)" }}>· {req.customer.location}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "rgba(43,35,32,0.55)", fontSize: "0.78rem" }}>
          <CalIcon size={13} />
          <span>{req.occasion}</span>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            backgroundColor: req.status === "declined" ? "rgba(122,46,56,0.06)" : "rgba(212,169,78,0.1)",
            color: req.status === "declined" ? C.maroon : "#8A6818",
            fontSize: "0.72rem",
            fontWeight: 500,
            padding: "2px 8px",
            borderRadius: 4,
          }}
        >
          <CalIcon size={11} />
          Needed by {req.neededBy}
        </div>
      </div>

      {/* Reference image swatches */}
      {req.refImages.length > 0 && (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {req.refImages.map((img, i) => (
            <RefSwatch key={i} bg={img.bg} size={44} />
          ))}
          <span style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.4)", marginLeft: 4 }}>
            {req.refImages.length} style reference{req.refImages.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Quote info (if quoted) */}
      {req.quotedPrice && (
        <div
          style={{
            backgroundColor: "rgba(43,35,32,0.025)",
            border: "1px solid rgba(43,35,32,0.07)",
            borderRadius: 6,
            padding: "0.625rem 0.875rem",
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500 }}>Quoted</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: C.charcoal, letterSpacing: "-0.02em" }}>CAD ${req.quotedPrice.toLocaleString()}</div>
          </div>
          {req.estimatedCompletion && (
            <div>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500 }}>Est. Completion</div>
              <div style={{ fontSize: "0.82rem", fontWeight: 500, color: C.charcoal }}>{req.estimatedCompletion}</div>
            </div>
          )}
        </div>
      )}

      {/* Decline reason (if declined) */}
      {req.status === "declined" && req.declineReason && (
        <div
          style={{
            backgroundColor: "rgba(122,46,56,0.05)",
            border: "1px solid rgba(122,46,56,0.12)",
            borderRadius: 6,
            padding: "0.625rem 0.875rem",
          }}
        >
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.maroon, fontWeight: 500, marginBottom: "3px" }}>Decline Reason</div>
          <div style={{ fontSize: "0.77rem", color: "rgba(43,35,32,0.65)", lineHeight: 1.45 }}>{req.declineReason}</div>
        </div>
      )}

      {/* Footer: View Details button */}
      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.125rem" }}>
        <button
          onClick={onOpen}
          style={{
            border: `1.5px solid ${C.maroon}`,
            backgroundColor: "transparent",
            color: C.maroon,
            borderRadius: 6,
            padding: "0.45rem 1rem",
            fontSize: "0.78rem",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: UI,
            letterSpacing: "0.01em",
            transition: "background-color 0.12s, color 0.12s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = C.maroon; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = C.maroon; }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

// ── ReadField ─────────────────────────────────────────────────────────────────

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500, marginBottom: "3px" }}>
        {label}
      </div>
      <div style={{ fontSize: "0.82rem", color: C.charcoal, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

// ── Request detail slide-over ─────────────────────────────────────────────────

function RequestDetailPanel({
  req,
  onClose,
  onStatusChange,
}: {
  req: CustomRequest;
  onClose: () => void;
  onStatusChange: (id: string, status: RequestStatus) => void;
}) {
  const [quotePrice, setQuotePrice] = useState(req.quotedPrice ? String(req.quotedPrice) : "");
  const [quoteNote, setQuoteNote] = useState("");
  const [completionDate, setCompletionDate] = useState(req.estimatedCompletion ?? "");
  const [declineReason, setDeclineReason] = useState("");
  const [showDecline, setShowDecline] = useState(false);
  const [zoomedImg, setZoomedImg] = useState<number | null>(null);

  const s = STATUS_CFG[req.status];

  const canSendQuote = req.status === "new" || req.status === "quoted";
  const canProgress =
    req.status === "approved" || req.status === "quoted" || req.status === "in-production";

  const NEXT_STATUS: Partial<Record<RequestStatus, { label: string; next: RequestStatus }>> = {
    "quoted":        { label: "Mark Approved",      next: "approved" },
    "approved":      { label: "Start Production",   next: "in-production" },
    "in-production": { label: "Mark Completed",     next: "completed" },
  };

  const nextAction = NEXT_STATUS[req.status];

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 200, backgroundColor: "rgba(43,35,32,0.38)" }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 201,
          width: 580,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          fontFamily: UI,
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid rgba(43,35,32,0.08)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 1,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "4px" }}>
              <StatusBadge status={req.status} />
              <span style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.4)" }}>Submitted {req.submittedDate}</span>
            </div>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: C.charcoal, margin: 0, lineHeight: 1.25 }}>
              {req.garmentType}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.35rem", color: "rgba(43,35,32,0.4)", lineHeight: 1, padding: "0 0 0 12px", flexShrink: 0 }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.75rem", flex: 1 }}>

          {/* ── Customer info */}
          <section>
            <SectionLabel>Customer</SectionLabel>
            <div className="rg-2"
              style={{
                backgroundColor: "rgba(43,35,32,0.025)",
                border: "1px solid rgba(43,35,32,0.07)",
                borderRadius: 8,
                padding: "1rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.875rem",
              }}
            >
              <ReadField label="Name" value={req.customer.name} />
              <ReadField label="Email" value={req.customer.email} />
              <ReadField label="Phone" value={req.customer.phone} />
              <ReadField label="Location" value={req.customer.location} />
            </div>
          </section>

          {/* ── Order context */}
          <section>
            <SectionLabel>Order Context</SectionLabel>
            <div className="rg-2"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.875rem",
                marginBottom: "0.875rem",
              }}
            >
              <ReadField label="Occasion" value={req.occasion} />
              <ReadField label="Needed By" value={req.neededBy} />
            </div>
            <ReadField label="Fabric Preference" value={req.fabricPreference} />
            <div style={{ marginTop: "0.875rem" }}>
              <ReadField label="Colour Preference" value={req.colorPreference} />
            </div>
            {req.additionalNotes && (
              <div style={{ marginTop: "0.875rem" }}>
                <div style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500, marginBottom: "4px" }}>
                  Additional Notes
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: C.charcoal,
                    lineHeight: 1.6,
                    backgroundColor: "rgba(43,35,32,0.025)",
                    border: "1px solid rgba(43,35,32,0.07)",
                    borderRadius: 6,
                    padding: "0.75rem",
                  }}
                >
                  {req.additionalNotes}
                </div>
              </div>
            )}
          </section>

          {/* ── Measurements */}
          <section>
            <SectionLabel>Measurements</SectionLabel>
            <div className="rg-3"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.625rem 0.875rem",
                backgroundColor: "rgba(43,35,32,0.025)",
                border: "1px solid rgba(43,35,32,0.07)",
                borderRadius: 8,
                padding: "1rem",
              }}
            >
              {req.measurements.map((m) => (
                <div key={m.label}>
                  <div style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: C.charcoal, marginTop: "1px" }}>{m.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Style references */}
          {req.refImages.length > 0 && (
            <section>
              <SectionLabel>Style References</SectionLabel>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {req.refImages.map((img, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <RefSwatch bg={img.bg} size={88} />
                    <button
                      onClick={() => setZoomedImg(i)}
                      aria-label={`Zoom ${img.label}`}
                      style={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        background: "rgba(43,35,32,0.55)",
                        border: "none",
                        borderRadius: 4,
                        color: "#fff",
                        lineHeight: 0,
                        padding: "3px",
                        cursor: "pointer",
                        display: "flex",
                      }}
                    >
                      <ZoomIcon size={11} />
                    </button>
                    <div style={{ fontSize: "0.62rem", color: "rgba(43,35,32,0.45)", marginTop: "4px", textAlign: "center" }}>
                      {img.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Quote section */}
          {canSendQuote && (
            <section
              style={{
                backgroundColor: "rgba(212,169,78,0.05)",
                border: "1px solid rgba(212,169,78,0.2)",
                borderRadius: 8,
                padding: "1.25rem",
              }}
            >
              <SectionLabel color="#8A6818">Quote</SectionLabel>
              <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.875rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.375rem" }}>
                    Price (CAD $)
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "0.625rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.82rem", color: "rgba(43,35,32,0.4)", pointerEvents: "none" }}>
                      CAD $
                    </span>
                    <input
                      type="number"
                      value={quotePrice}
                      onChange={(e) => setQuotePrice(e.target.value)}
                      placeholder="0.00"
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem 0.5rem 1.5rem",
                        border: "1px solid rgba(43,35,32,0.18)",
                        borderRadius: 6,
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        fontFamily: UI,
                        color: C.charcoal,
                        outline: "none",
                        boxSizing: "border-box",
                        backgroundColor: "#fff",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.375rem" }}>
                    Est. Completion Date
                  </label>
                  <input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      border: "1px solid rgba(43,35,32,0.18)",
                      borderRadius: 6,
                      fontSize: "0.82rem",
                      fontFamily: UI,
                      color: C.charcoal,
                      outline: "none",
                      boxSizing: "border-box",
                      backgroundColor: "#fff",
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.375rem" }}>
                  Notes to Customer
                </label>
                <textarea
                  rows={3}
                  value={quoteNote}
                  onChange={(e) => setQuoteNote(e.target.value)}
                  placeholder="e.g. We'll begin sourcing your Aso-Oke fabric this week. Fitting can be arranged via video call..."
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    border: "1px solid rgba(43,35,32,0.18)",
                    borderRadius: 6,
                    fontSize: "0.82rem",
                    fontFamily: UI,
                    color: C.charcoal,
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                    lineHeight: 1.55,
                    backgroundColor: "#fff",
                  }}
                />
              </div>
              <button
                onClick={() => onStatusChange(req.id, "quoted")}
                style={{
                  width: "100%",
                  backgroundColor: C.gold,
                  color: C.charcoal,
                  border: "none",
                  borderRadius: 6,
                  padding: "0.65rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: UI,
                  letterSpacing: "0.01em",
                }}
              >
                Send Quote to Customer
              </button>
            </section>
          )}

          {/* ── Status controls */}
          {canProgress && (
            <section>
              <SectionLabel>Update Status</SectionLabel>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {nextAction && (
                  <button
                    onClick={() => onStatusChange(req.id, nextAction.next)}
                    style={{
                      flex: 1,
                      backgroundColor: C.teal,
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "0.6rem 1rem",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: UI,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {nextAction.label}
                  </button>
                )}
                {req.status !== "completed" && (
                  <button
                    onClick={() => setShowDecline((v) => !v)}
                    style={{
                      backgroundColor: "transparent",
                      color: C.maroon,
                      border: `1.5px solid rgba(122,46,56,0.3)`,
                      borderRadius: 6,
                      padding: "0.6rem 1rem",
                      fontSize: "0.82rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: UI,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Decline Request
                  </button>
                )}
              </div>

              {showDecline && (
                <div style={{ marginTop: "0.875rem" }}>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: C.charcoal, marginBottom: "0.375rem" }}>
                    Reason (sent to customer)
                  </label>
                  <textarea
                    rows={3}
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="e.g. We're unable to meet the requested timeline for this garment type..."
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      border: "1px solid rgba(122,46,56,0.25)",
                      borderRadius: 6,
                      fontSize: "0.82rem",
                      fontFamily: UI,
                      color: C.charcoal,
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                      lineHeight: 1.55,
                      backgroundColor: "#fff",
                    }}
                  />
                  <button
                    onClick={() => { onStatusChange(req.id, "declined"); setShowDecline(false); }}
                    style={{
                      marginTop: "0.5rem",
                      backgroundColor: C.maroon,
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "0.55rem 1.25rem",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: UI,
                    }}
                  >
                    Confirm Decline
                  </button>
                </div>
              )}
            </section>
          )}

          {/* ── Message Customer */}
          <section>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "transparent",
                color: C.charcoal,
                border: "1px solid rgba(43,35,32,0.18)",
                borderRadius: 6,
                padding: "0.55rem 1rem",
                fontSize: "0.8rem",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: UI,
              }}
            >
              <ChatIcon />
              Message Customer
            </button>
            <p style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.38)", margin: "6px 0 0" }}>
              Opens a message thread with {req.customer.name} pre-filled with this request&apos;s context.
            </p>
          </section>
        </div>
      </div>

      {/* Zoomed image lightbox */}
      {zoomedImg !== null && (
        <div
          onClick={() => setZoomedImg(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            backgroundColor: "rgba(43,35,32,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <RefSwatch bg={req.refImages[zoomedImg].bg} size={240} />
            <span style={{ color: C.cream, fontSize: "0.78rem", opacity: 0.7 }}>
              {req.refImages[zoomedImg].label} — click anywhere to close
            </span>
          </div>
        </div>
      )}
    </>
  );
}

// ── SectionLabel ──────────────────────────────────────────────────────────────

function SectionLabel({ children, color = "rgba(43,35,32,0.38)" }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        fontSize: "0.62rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color,
        fontWeight: 500,
        marginBottom: "0.625rem",
      }}
    >
      {children}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: TabKey }) {
  const msgs: Partial<Record<TabKey, string>> = {
    all:           "No custom order requests yet",
    new:           "No new requests — you're all caught up",
    quoted:        "No quotes sent yet",
    approved:      "No approved requests",
    "in-production": "Nothing in production",
    completed:     "No completed custom orders yet",
    declined:      "No declined requests",
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        gap: "0.75rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          backgroundColor: "rgba(43,35,32,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(43,35,32,0.2)",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </div>
      <p style={{ fontSize: "0.9rem", fontWeight: 600, color: C.charcoal, margin: 0 }}>{msgs[tab]}</p>
      <p style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.42)", margin: 0, maxWidth: 280 }}>
        Custom order requests from buyers will appear here.
      </p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ConsoleCustomOrders() {
  const [requests, setRequests] = useState<CustomRequest[]>(REQUESTS);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedReq = requests.find((r) => r.id === selectedId) ?? null;

  const tabCounts: Record<TabKey, number> = {
    all:             requests.length,
    new:             requests.filter((r) => r.status === "new").length,
    quoted:          requests.filter((r) => r.status === "quoted").length,
    approved:        requests.filter((r) => r.status === "approved").length,
    "in-production": requests.filter((r) => r.status === "in-production").length,
    completed:       requests.filter((r) => r.status === "completed").length,
    declined:        requests.filter((r) => r.status === "declined").length,
  };

  const filtered = requests.filter((r) => activeTab === "all" || r.status === activeTab);

  function handleStatusChange(id: string, status: RequestStatus) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelectedId(null);
  }

  return (
    <div className="console-page" style={{ padding: "1.75rem", fontFamily: UI }}>
      {/* Page header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontFamily: UI,
            fontSize: "1.35rem",
            fontWeight: 600,
            color: C.charcoal,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Custom Order Requests
        </h1>
        <p style={{ fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.45)", margin: "4px 0 0" }}>
          Review made-to-measure requests from buyers and manage quotes
        </p>
      </div>

      {/* Status tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid rgba(43,35,32,0.1)",
          marginBottom: "1.25rem",
          overflowX: "auto",
        }}
      >
        {TABS.map((t) => {
          const isActive = activeTab === t.key;
          const count = tabCounts[t.key];
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${isActive ? C.gold : "transparent"}`,
                padding: "0.575rem 0.875rem",
                marginBottom: "-1px",
                fontSize: "0.8rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? C.charcoal : "rgba(43,35,32,0.48)",
                cursor: "pointer",
                fontFamily: UI,
                whiteSpace: "nowrap",
                transition: "color 0.12s",
              }}
            >
              {t.label}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: isActive ? C.maroon : "rgba(43,35,32,0.08)",
                  color: isActive ? "#fff" : "rgba(43,35,32,0.5)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  padding: "0 4px",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards or empty state */}
      {filtered.length === 0 ? (
        <div style={{ backgroundColor: "#fff", borderRadius: 8, border: "1px solid rgba(43,35,32,0.07)" }}>
          <EmptyState tab={activeTab} />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {filtered.map((req) => (
            <RequestCard key={req.id} req={req} onOpen={() => setSelectedId(req.id)} />
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selectedReq && (
        <RequestDetailPanel
          req={selectedReq}
          onClose={() => setSelectedId(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
