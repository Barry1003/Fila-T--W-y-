'use client';

import { useState } from "react";
import { Link } from '@/lib/router';
import type { FulfilStatus, OrderDetail } from '@/server/orders';
import { C, UI } from "../../tokens";

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChevronDown({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function MapPinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function MailIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function PhoneIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.43 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function TruckIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function MessageSquare({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function LockIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ── Mock order data ───────────────────────────────────────────────────────────


const FULFIL_STYLE: Record<FulfilStatus, { label: string; bg: string; color: string }> = {
  new:        { label: "New",        bg: "rgba(43,35,32,0.07)",   color: "rgba(43,35,32,0.55)" },
  processing: { label: "Processing", bg: "rgba(46,74,158,0.1)",   color: "#2E4A9E" },
  shipped:    { label: "Shipped",    bg: "rgba(212,169,78,0.14)", color: "#8A6818" },
  delivered:  { label: "Delivered",  bg: "rgba(59,138,147,0.12)", color: C.teal },
  cancelled:  { label: "Cancelled",  bg: "rgba(122,46,56,0.1)",   color: C.maroon },
};

const NEXT_STATUS: Partial<Record<FulfilStatus, FulfilStatus>> = {
  new: "processing",
  processing: "shipped",
  shipped: "delivered",
};

const CARRIERS = ["Royal Mail", "DHL", "FedEx", "UPS", "Evri", "Parcelforce"];
const RATE = 1481;

// ── Main component ────────────────────────────────────────────────────────────

export default function ConsoleOrderDetail({ order: raw }: { order: OrderDetail }) {
  const [status, setStatus] = useState<FulfilStatus>(raw.status);
  const [tracking, setTracking] = useState(raw.tracking ?? "");
  const [carrier, setCarrier] = useState(raw.carrier ?? "Royal Mail");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const order = raw;
  const fulfil = FULFIL_STYLE[status];
  const nextStatus = NEXT_STATUS[status];

  const subtotal = order.items.reduce((s, i) => s + i.unitCad * i.qty, 0);
  const total = subtotal + order.shippingCad - order.discountCad;

  function advanceStatus() {
    if (nextStatus) setStatus(nextStatus);
  }

  function saveTracking() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="console-page p-7 min-h-full" style={{ fontFamily: UI }}>

      {/* ── Breadcrumb ────────────────────────────────────── */}
      <div className="flex items-center gap-[0.4rem] mb-5">
        <Link
          to="/console/orders"
          className="no-underline transition-colors duration-150"
          style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.45)" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.charcoal}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.45)"}
        >
          Orders
        </Link>
        <span style={{ color: "rgba(43,35,32,0.28)", fontSize: "0.75rem" }}>/</span>
        <span className="font-medium" style={{ fontSize: "0.78rem", color: C.charcoal }}>{order.number}</span>
      </div>

      {/* ── Order header ──────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-bold m-[0_0_0.375rem] tracking-[-0.02em]" style={{ fontSize: "1.35rem", color: C.charcoal }}>
            {order.number}
          </h1>
          <div className="flex items-center gap-[0.625rem]">
            <span style={{ fontSize: "0.75rem", color: "rgba(43,35,32,0.45)" }}>{order.placedAt}</span>
            <span className="inline-block px-[9px] py-[2px] rounded-full font-medium" style={{
              fontSize: "0.67rem",
              backgroundColor: fulfil.bg, color: fulfil.color,
            }}>
              {fulfil.label}
            </span>
          </div>
        </div>

        {/* Status advance */}
        {nextStatus && (
          <button
            onClick={advanceStatus}
            className="inline-flex items-center gap-[6px] border-none rounded-[7px] px-[1.125rem] py-[0.55rem] font-semibold cursor-pointer tracking-[0.01em]"
            style={{
              backgroundColor: C.maroon, color: "#fff",
              fontSize: "0.8rem",
              fontFamily: UI,
            }}
          >
            Mark as {FULFIL_STYLE[nextStatus].label}
          </button>
        )}
      </div>

      {/* ── Two-column grid ───────────────────────────────── */}
      <div className="rg-split items-start" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.25rem" }}>

        {/* ── LEFT ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Customer info */}
          <SectionCard title="Customer">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold tracking-[0.03em]" style={{
                backgroundColor: C.gold, color: C.charcoal,
                fontSize: "0.8rem",
              }}>
                {order.customerName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-[0.625rem]" style={{ fontSize: "0.9rem", color: C.charcoal }}>
                  {order.customerName}
                </div>
                <div className="flex flex-col gap-[0.375rem]">
                  <InfoRow icon={<MailIcon />}>{order.customerEmail}</InfoRow>
                  <InfoRow icon={<PhoneIcon />}>{order.customerPhone}</InfoRow>
                  <InfoRow icon={<MapPinIcon />}>{order.address}</InfoRow>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Order items */}
          <SectionCard title="Items">
            <div className="table-scroll">
              <table className="card-table w-full border-collapse min-w-[520px]">
                <thead>
                  <tr>
                    {["Product", "Variant", "Qty", "Unit Price", "Line Total"].map(h => (
                      <th key={h} className="p-[0_0_0.625rem] font-medium uppercase tracking-[0.09em]" style={{
                        textAlign: h === "Qty" || h === "Unit Price" || h === "Line Total" ? "right" : "left",
                        fontSize: "0.63rem",
                        color: "rgba(43,35,32,0.38)", fontFamily: UI,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => {
                    const lineCad = item.unitCad * item.qty;
                    return (
                      <tr key={i} className="border-t border-solid border-[rgba(43,35,32,0.06)]">
                        <td className="py-3">
                          <div className="flex items-center gap-[0.625rem]">
                            <div className="w-9 h-9 rounded-[5px] shrink-0 flex items-center justify-center opacity-75" style={{
                              backgroundColor: C.maroon,
                            }}>
                              <span className="font-bold text-white" style={{ fontSize: "0.55rem" }}>IMG</span>
                            </div>
                            <span className="font-semibold" style={{ fontSize: "0.8rem", color: C.charcoal }}>{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2" style={{ fontSize: "0.75rem", color: "rgba(43,35,32,0.55)" }}>
                          {item.variant}
                        </td>
                        <td className="py-3 text-right" style={{ fontSize: "0.8rem", color: C.charcoal }}>{item.qty}</td>
                        <td className="py-3 text-right" style={{ fontSize: "0.8rem", color: C.charcoal }}>CAD ${item.unitCad}</td>
                        <td className="py-3 text-right font-semibold" style={{ fontSize: "0.8rem", color: C.charcoal }}>CAD ${lineCad}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Internal notes */}
          <SectionCard title={
            <div className="flex items-center gap-[0.375rem]">
              <LockIcon />
              <span>Internal Notes</span>
              <span className="font-normal ml-1 tracking-[0.03em]" style={{ fontSize: "0.62rem", color: "rgba(43,35,32,0.35)" }}>
                (private — not sent to buyer)
              </span>
            </div>
          }>
            <textarea
              placeholder="Add a private note about this order..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-md p-[0.625rem_0.75rem] outline-none box-border resize-y bg-[rgba(43,35,32,0.02)] border border-solid border-[rgba(43,35,32,0.12)]"
              style={{
                fontFamily: UI, fontSize: "0.82rem", color: C.charcoal,
                lineHeight: 1.6,
              }}
            />
            <div className="flex justify-end mt-[0.625rem]">
              <button className="border-none rounded-md px-[0.875rem] py-[0.4rem] cursor-pointer font-medium" style={{
                fontFamily: UI, fontSize: "0.75rem",
                color: C.charcoal, backgroundColor: "rgba(43,35,32,0.06)",
              }}>
                Save Note
              </button>
            </div>
          </SectionCard>
        </div>

        {/* ── RIGHT ────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sticky top-6">

          {/* Payment summary */}
          <SectionCard title="Payment">
            <div className="flex flex-col gap-2">
              <SummaryRow label="Subtotal" value={`CAD $${subtotal}`} />
              <SummaryRow label="Shipping" value={`CAD $${order.shippingCad}`} />
              {order.discountCad > 0 && (
                <SummaryRow label="Discount" value={`−CAD $${order.discountCad}`} valueColor={C.teal} />
              )}
              <div className="pt-2 mt-[0.125rem] border-t border-solid border-[rgba(43,35,32,0.1)]">
                <SummaryRow label="Total" value={`CAD $${total}`} bold />
              </div>
            </div>
            <div className="mt-[0.875rem] p-[0.625rem_0.75rem] rounded-md flex items-center gap-2 bg-[rgba(59,138,147,0.07)]">
              <span className="w-2 h-2 rounded-full shrink-0 inline-block bg-[var(--color-teal)]" />
              <span style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.6)", lineHeight: 1.3 }}>
                <strong className="font-semibold" style={{ color: C.charcoal }}>Paid</strong> via {order.paymentMethod}
              </span>
            </div>
          </SectionCard>

          {/* Fulfilment / tracking */}
          <SectionCard title="Fulfilment">
            <FieldLabel>Carrier</FieldLabel>
            <div className="relative mb-3">
              <select
                value={carrier}
                onChange={e => setCarrier(e.target.value)}
                className="w-full bg-white rounded-md cursor-pointer outline-none appearance-none border border-solid border-[rgba(43,35,32,0.14)] py-[0.45rem] pl-[0.75rem] pr-[2rem]"
                style={{
                  fontFamily: UI, fontSize: "0.78rem", color: C.charcoal,
                }}
              >
                {CARRIERS.map(c => <option key={c}>{c}</option>)}
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none leading-none" style={{ color: "rgba(43,35,32,0.4)" }}>
                <ChevronDown />
              </span>
            </div>

            <FieldLabel>Tracking Number</FieldLabel>
            <input
              type="text"
              placeholder="e.g. JD000940012345678901"
              value={tracking}
              onChange={e => setTracking(e.target.value)}
              className="w-full bg-white rounded-md px-3 py-2 outline-none box-border mb-3 border border-solid border-[rgba(43,35,32,0.14)]"
              style={{
                fontFamily: UI, fontSize: "0.8rem", color: C.charcoal,
              }}
            />

            <button
              onClick={saveTracking}
              className="w-full border-none rounded-[7px] px-4 py-[0.6rem] font-bold cursor-pointer transition-colors duration-200 flex items-center justify-center gap-[6px] tracking-[0.01em]"
              style={{
                backgroundColor: saved ? C.teal : C.gold,
                color: saved ? "#fff" : C.charcoal,
                fontSize: "0.8rem",
                fontFamily: UI,
              }}
            >
              <TruckIcon size={14} />
              {saved ? "Saved & Notified ✓" : "Save & Notify Customer"}
            </button>

            {order.status === "shipped" && order.tracking && (
              <div className="mt-3 px-[0.625rem] py-2 rounded-[5px] leading-relaxed bg-[rgba(212,169,78,0.08)]" style={{
                fontSize: "0.67rem", color: "#8A6818",
              }}>
                Tracking: <strong>{order.tracking}</strong> via {order.carrier}
              </div>
            )}
          </SectionCard>

          {/* Message customer */}
          <Link
            to="/console/messages"
            className="flex items-center justify-center gap-[7px] px-4 py-[0.6rem] rounded-[7px] bg-transparent font-medium no-underline transition-colors duration-150 tracking-[0.01em] border border-solid border-[rgba(43,35,32,0.16)]"
            style={{
              color: C.charcoal,
              fontSize: "0.78rem", fontFamily: UI,
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(43,35,32,0.04)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
          >
            <MessageSquare size={14} /> Message Customer
          </Link>

          {/* Back */}
          <Link
            to="/console/orders"
            className="block text-center no-underline p-1"
            style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.38)" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.charcoal}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.38)"}
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg p-5" style={{ border: "1px solid rgba(43,35,32,0.07)" }}>
      {title && (
        <h2 className="font-semibold m-[0_0_1rem] pb-3 flex items-center tracking-[-0.01em] border-b border-solid border-[rgba(43,35,32,0.06)]" style={{
          fontFamily: UI, fontSize: "0.82rem",
          color: C.charcoal,
        }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="shrink-0 mt-[1px] leading-none" style={{ color: "rgba(43,35,32,0.35)" }}>{icon}</span>
      <span className="leading-relaxed" style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.7)" }}>{children}</span>
    </div>
  );
}

function SummaryRow({ label, value, bold = false, valueColor }: { label: string; value: string; bold?: boolean; valueColor?: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span style={{ fontSize: "0.77rem", color: "rgba(43,35,32,0.52)", fontFamily: UI }}>{label}</span>
      <span style={{ fontSize: bold ? "0.95rem" : "0.77rem", fontWeight: bold ? 700 : 400, color: valueColor ?? C.charcoal, fontFamily: UI }}>
        {value}
      </span>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-medium uppercase mb-[0.375rem] tracking-[0.07em]" style={{
      fontSize: "0.7rem",
      color: "rgba(43,35,32,0.55)",
      fontFamily: UI,
    }}>
      {children}
    </label>
  );
}
