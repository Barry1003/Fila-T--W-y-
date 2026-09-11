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
      className="inline-block px-[10px] py-[3px] rounded-full font-medium whitespace-nowrap tracking-[0.01em]"
      style={{
        fontSize: "0.68rem",
        backgroundColor: s.bg,
        color: s.color,
        fontFamily: UI,
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
      className="rounded-md shrink-0 flex items-center justify-center overflow-hidden relative border border-solid border-[rgba(43,35,32,0.12)]"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
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
      className="bg-white rounded-[10px] p-5 flex flex-col gap-[0.875rem] transition-shadow duration-150 border border-solid border-[rgba(43,35,32,0.08)]"
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(43,35,32,0.08)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      {/* Top row: garment + date | status */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold leading-tight" style={{ fontSize: "0.95rem", color: C.charcoal }}>
            {req.garmentType}
          </div>
          <div className="mt-[3px]" style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.42)" }}>
            Submitted {req.submittedDate}
          </div>
        </div>
        <StatusBadge status={req.status} />
      </div>

      {/* Customer + occasion row */}
      <div className="flex gap-6 flex-wrap">
        <div className="flex items-center gap-[5px]" style={{ color: "rgba(43,35,32,0.55)", fontSize: "0.78rem" }}>
          <UserIcon size={13} />
          <span className="font-medium" style={{ color: C.charcoal }}>{req.customer.name}</span>
          <span style={{ color: "rgba(43,35,32,0.35)" }}>· {req.customer.location}</span>
        </div>
        <div className="flex items-center gap-[5px]" style={{ color: "rgba(43,35,32,0.55)", fontSize: "0.78rem" }}>
          <CalIcon size={13} />
          <span>{req.occasion}</span>
        </div>
        <div
          className="inline-flex items-center gap-1 font-medium px-2 py-[2px] rounded"
          style={{
            backgroundColor: req.status === "declined" ? "rgba(122,46,56,0.06)" : "rgba(212,169,78,0.1)",
            color: req.status === "declined" ? C.maroon : "#8A6818",
            fontSize: "0.72rem",
          }}
        >
          <CalIcon size={11} />
          Needed by {req.neededBy}
        </div>
      </div>

      {/* Reference image swatches */}
      {req.refImages.length > 0 && (
        <div className="flex gap-2 items-center">
          {req.refImages.map((img, i) => (
            <RefSwatch key={i} bg={img.bg} size={44} />
          ))}
          <span className="ml-1" style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.4)" }}>
            {req.refImages.length} style reference{req.refImages.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Quote info (if quoted) */}
      {req.quotedPrice && (
        <div
          className="rounded-md px-[0.875rem] py-[0.625rem] flex gap-6 items-center bg-[rgba(43,35,32,0.025)] border border-solid border-[rgba(43,35,32,0.07)]"
        >
          <div>
            <div className="uppercase font-medium tracking-[0.1em]" style={{ fontSize: "0.6rem", color: "rgba(43,35,32,0.38)" }}>Quoted</div>
            <div className="font-bold tracking-[-0.02em]" style={{ fontSize: "1rem", color: C.charcoal }}>CAD ${req.quotedPrice.toLocaleString()}</div>
          </div>
          {req.estimatedCompletion && (
            <div>
              <div className="uppercase font-medium tracking-[0.1em]" style={{ fontSize: "0.6rem", color: "rgba(43,35,32,0.38)" }}>Est. Completion</div>
              <div className="font-medium" style={{ fontSize: "0.82rem", color: C.charcoal }}>{req.estimatedCompletion}</div>
            </div>
          )}
        </div>
      )}

      {/* Decline reason (if declined) */}
      {req.status === "declined" && req.declineReason && (
        <div
          className="rounded-md px-[0.875rem] py-[0.625rem] bg-[rgba(122,46,56,0.05)] border border-solid border-[rgba(122,46,56,0.12)]"
        >
          <div className="uppercase font-medium mb-[3px] tracking-[0.1em]" style={{ fontSize: "0.6rem", color: C.maroon }}>Decline Reason</div>
          <div className="leading-relaxed" style={{ fontSize: "0.77rem", color: "rgba(43,35,32,0.65)" }}>{req.declineReason}</div>
        </div>
      )}

      {/* Footer: View Details button */}
      <div className="flex justify-end pt-[0.125rem]">
        <button
          onClick={onOpen}
          className="bg-transparent rounded-md px-4 py-[0.45rem] font-medium cursor-pointer transition-colors duration-150 tracking-[0.01em] border-[1.5px] border-solid"
          style={{
            borderColor: C.maroon,
            color: C.maroon,
            fontSize: "0.78rem",
            fontFamily: UI,
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
      <div className="uppercase font-medium mb-[3px] tracking-[0.1em]" style={{ fontSize: "0.62rem", color: "rgba(43,35,32,0.38)" }}>
        {label}
      </div>
      <div className="leading-relaxed" style={{ fontSize: "0.82rem", color: C.charcoal }}>{value}</div>
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
        className="fixed inset-0 z-[200] bg-[rgba(43,35,32,0.38)]"
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[201] w-[580px] bg-white flex flex-col overflow-y-auto"
        style={{
          fontFamily: UI,
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between shrink-0 sticky top-0 bg-white z-[1] p-[1.25rem_1.5rem] border-b border-solid border-[rgba(43,35,32,0.08)]"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-[0.625rem] mb-1">
              <StatusBadge status={req.status} />
              <span style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.4)" }}>Submitted {req.submittedDate}</span>
            </div>
            <h2 className="font-semibold m-0 leading-tight" style={{ fontSize: "1.05rem", color: C.charcoal }}>
              {req.garmentType}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="bg-none border-none cursor-pointer leading-none pl-3 shrink-0"
            style={{ fontSize: "1.35rem", color: "rgba(43,35,32,0.4)" }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-7 flex-1">

          {/* ── Customer info */}
          <section>
            <SectionLabel>Customer</SectionLabel>
            <div className="rg-2 grid grid-cols-2 gap-[0.875rem] p-4 rounded-lg bg-[rgba(43,35,32,0.025)] border border-solid border-[rgba(43,35,32,0.07)]"
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
            <div className="rg-2 grid grid-cols-2 gap-[0.875rem] mb-[0.875rem]">
              <ReadField label="Occasion" value={req.occasion} />
              <ReadField label="Needed By" value={req.neededBy} />
            </div>
            <ReadField label="Fabric Preference" value={req.fabricPreference} />
            <div className="mt-[0.875rem]">
              <ReadField label="Colour Preference" value={req.colorPreference} />
            </div>
            {req.additionalNotes && (
              <div className="mt-[0.875rem]">
                <div className="uppercase font-medium mb-1 tracking-[0.1em]" style={{ fontSize: "0.62rem", color: "rgba(43,35,32,0.38)" }}>
                  Additional Notes
                </div>
                <div
                  className="rounded-md p-3 leading-relaxed bg-[rgba(43,35,32,0.025)] border border-solid border-[rgba(43,35,32,0.07)]"
                  style={{
                    fontSize: "0.82rem",
                    color: C.charcoal,
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
            <div className="rg-3 grid grid-cols-3 gap-y-[0.625rem] gap-x-[0.875rem] p-4 rounded-lg bg-[rgba(43,35,32,0.025)] border border-solid border-[rgba(43,35,32,0.07)]"
            >
              {req.measurements.map((m) => (
                <div key={m.label}>
                  <div className="uppercase font-medium tracking-[0.1em]" style={{ fontSize: "0.6rem", color: "rgba(43,35,32,0.38)" }}>
                    {m.label}
                  </div>
                  <div className="font-semibold mt-[1px]" style={{ fontSize: "0.9rem", color: C.charcoal }}>{m.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Style references */}
          {req.refImages.length > 0 && (
            <section>
              <SectionLabel>Style References</SectionLabel>
              <div className="flex gap-3 flex-wrap">
                {req.refImages.map((img, i) => (
                  <div key={i} className="relative">
                    <RefSwatch bg={img.bg} size={88} />
                    <button
                      onClick={() => setZoomedImg(i)}
                      aria-label={`Zoom ${img.label}`}
                      className="absolute bottom-1 right-1 border-none rounded text-white leading-none p-[3px] cursor-pointer flex"
                      style={{
                        background: "rgba(43,35,32,0.55)",
                      }}
                    >
                      <ZoomIcon size={11} />
                    </button>
                    <div className="text-center mt-1" style={{ fontSize: "0.62rem", color: "rgba(43,35,32,0.45)" }}>
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
              className="rounded-lg p-5 bg-[rgba(212,169,78,0.05)] border border-solid border-[rgba(212,169,78,0.2)]"
            >
              <SectionLabel color="#8A6818">Quote</SectionLabel>
              <div className="rg-2 grid grid-cols-2 gap-3 mb-[0.875rem]">
                <div>
                  <label className="block font-medium mb-[0.375rem]" style={{ fontSize: "0.78rem", color: C.charcoal }}>
                    Price (CAD $)
                  </label>
                  <div className="relative">
                    <span className="absolute left-[0.625rem] top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: "0.82rem", color: "rgba(43,35,32,0.4)" }}>
                      CAD $
                    </span>
                    <input
                      type="number"
                      value={quotePrice}
                      onChange={(e) => setQuotePrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-6 pr-3 py-2 rounded-md font-semibold outline-none box-border bg-white border border-solid border-[rgba(43,35,32,0.18)]"
                      style={{
                        fontSize: "0.88rem",
                        fontFamily: UI,
                        color: C.charcoal,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-[0.375rem]" style={{ fontSize: "0.78rem", color: C.charcoal }}>
                    Est. Completion Date
                  </label>
                  <input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-md outline-none box-border bg-white border border-solid border-[rgba(43,35,32,0.18)]"
                    style={{
                      fontSize: "0.82rem",
                      fontFamily: UI,
                      color: C.charcoal,
                    }}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-[0.375rem]" style={{ fontSize: "0.78rem", color: C.charcoal }}>
                  Notes to Customer
                </label>
                <textarea
                  rows={3}
                  value={quoteNote}
                  onChange={(e) => setQuoteNote(e.target.value)}
                  placeholder="e.g. We'll begin sourcing your Aso-Oke fabric this week. Fitting can be arranged via video call..."
                  className="w-full px-3 py-2 rounded-md outline-none resize-y box-border leading-relaxed bg-white border border-solid border-[rgba(43,35,32,0.18)]"
                  style={{
                    fontSize: "0.82rem",
                    fontFamily: UI,
                    color: C.charcoal,
                  }}
                />
              </div>
              <button
                onClick={() => onStatusChange(req.id, "quoted")}
                className="w-full border-none rounded-md p-[0.65rem] font-semibold cursor-pointer tracking-[0.01em]"
                style={{
                  backgroundColor: C.gold,
                  color: C.charcoal,
                  fontSize: "0.85rem",
                  fontFamily: UI,
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
              <div className="flex gap-3 flex-wrap">
                {nextAction && (
                  <button
                    onClick={() => onStatusChange(req.id, nextAction.next)}
                    className="flex-1 border-none rounded-md px-4 py-[0.6rem] font-semibold cursor-pointer whitespace-nowrap text-white"
                    style={{
                      backgroundColor: C.teal,
                      fontSize: "0.82rem",
                      fontFamily: UI,
                    }}
                  >
                    {nextAction.label}
                  </button>
                )}
                {req.status !== "completed" && (
                  <button
                    onClick={() => setShowDecline((v) => !v)}
                    className="bg-transparent rounded-md px-4 py-[0.6rem] font-medium cursor-pointer whitespace-nowrap border-[1.5px] border-solid border-[rgba(122,46,56,0.3)]"
                    style={{
                      color: C.maroon,
                      fontSize: "0.82rem",
                      fontFamily: UI,
                    }}
                  >
                    Decline Request
                  </button>
                )}
              </div>

              {showDecline && (
                <div className="mt-[0.875rem]">
                  <label className="block font-medium mb-[0.375rem]" style={{ fontSize: "0.78rem", color: C.charcoal }}>
                    Reason (sent to customer)
                  </label>
                  <textarea
                    rows={3}
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="e.g. We're unable to meet the requested timeline for this garment type..."
                    className="w-full px-3 py-2 rounded-md outline-none resize-y box-border leading-relaxed bg-white border border-solid border-[rgba(122,46,56,0.25)]"
                    style={{
                      fontSize: "0.82rem",
                      fontFamily: UI,
                      color: C.charcoal,
                    }}
                  />
                  <button
                    onClick={() => { onStatusChange(req.id, "declined"); setShowDecline(false); }}
                    className="mt-2 border-none rounded-md px-5 py-[0.55rem] font-semibold cursor-pointer text-white"
                    style={{
                      backgroundColor: C.maroon,
                      fontSize: "0.8rem",
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
              className="inline-flex items-center gap-[6px] bg-transparent rounded-md px-4 py-[0.55rem] font-medium cursor-pointer border border-solid border-[rgba(43,35,32,0.18)]"
              style={{
                color: C.charcoal,
                fontSize: "0.8rem",
                fontFamily: UI,
              }}
            >
              <ChatIcon />
              Message Customer
            </button>
            <p className="m-[6px_0_0]" style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.38)" }}>
              Opens a message thread with {req.customer.name} pre-filled with this request&apos;s context.
            </p>
          </section>
        </div>
      </div>

      {/* Zoomed image lightbox */}
      {zoomedImg !== null && (
        <div
          onClick={() => setZoomedImg(null)}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-[rgba(43,35,32,0.7)]"
        >
          <div className="flex flex-col items-center gap-3">
            <RefSwatch bg={req.refImages[zoomedImg].bg} size={240} />
            <span className="opacity-70" style={{ color: C.cream, fontSize: "0.78rem" }}>
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
      className="uppercase font-medium mb-[0.625rem] tracking-[0.1em]"
      style={{
        fontSize: "0.62rem",
        color,
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
      className="flex flex-col items-center justify-center p-[4rem_2rem] gap-3 text-center"
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 52,
          height: 52,
          backgroundColor: "rgba(43,35,32,0.05)",
          color: "rgba(43,35,32,0.2)",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </div>
      <p className="font-semibold m-0" style={{ fontSize: "0.9rem", color: C.charcoal }}>{msgs[tab]}</p>
      <p className="m-0 max-w-[280px]" style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.42)" }}>
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
    <div className="console-page p-7" style={{ fontFamily: UI }}>
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="font-semibold m-0 tracking-[-0.02em]"
          style={{
            fontFamily: UI,
            fontSize: "1.35rem",
            color: C.charcoal,
          }}
        >
          Custom Order Requests
        </h1>
        <p className="m-[4px_0_0]" style={{ fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.45)" }}>
          Review made-to-measure requests from buyers and manage quotes
        </p>
      </div>

      {/* Status tabs */}
      <div
        className="flex gap-0 mb-5 overflow-x-auto border-b border-solid border-[rgba(43,35,32,0.1)]"
      >
        {TABS.map((t) => {
          const isActive = activeTab === t.key;
          const count = tabCounts[t.key];
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="inline-flex items-center gap-[6px] bg-none cursor-pointer whitespace-nowrap transition-colors duration-150 border-none border-b-2 border-solid px-[0.875rem] py-[0.575rem] -mb-[1px]"
              style={{
                borderColor: isActive ? C.gold : "transparent",
                fontSize: "0.8rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? C.charcoal : "rgba(43,35,32,0.48)",
                fontFamily: UI,
              }}
            >
              {t.label}
              <span
                className="inline-flex items-center justify-center rounded-full font-bold px-1"
                style={{
                  minWidth: 18,
                  height: 18,
                  backgroundColor: isActive ? C.maroon : "rgba(43,35,32,0.08)",
                  color: isActive ? "#fff" : "rgba(43,35,32,0.5)",
                  fontSize: "0.6rem",
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
        <div className="bg-white rounded-lg border border-solid border-[rgba(43,35,32,0.07)]">
          <EmptyState tab={activeTab} />
        </div>
      ) : (
        <div className="flex flex-col gap-[0.875rem]">
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
