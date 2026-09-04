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
    <div className="console-page" style={{ padding: "1.75rem", fontFamily: UI, minHeight: "100%" }}>

      {/* ── Breadcrumb ────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.25rem" }}>
        <Link
          to="/console/orders"
          style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.45)", textDecorationLine: "none" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.charcoal}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.45)"}
        >
          Orders
        </Link>
        <span style={{ color: "rgba(43,35,32,0.28)", fontSize: "0.75rem" }}>/</span>
        <span style={{ fontSize: "0.78rem", color: C.charcoal, fontWeight: 500 }}>{order.number}</span>
      </div>

      {/* ── Order header ──────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap",
      }}>
        <div>
          <h1 style={{ fontSize: "1.35rem", fontWeight: 700, color: C.charcoal, letterSpacing: "-0.02em", margin: "0 0 0.375rem" }}>
            {order.number}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <span style={{ fontSize: "0.75rem", color: "rgba(43,35,32,0.45)" }}>{order.placedAt}</span>
            <span style={{
              display: "inline-block", padding: "2px 9px", borderRadius: 100,
              fontSize: "0.67rem", fontWeight: 500,
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
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              backgroundColor: C.maroon, color: "#fff",
              border: "none", borderRadius: 7, padding: "0.55rem 1.125rem",
              fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
              fontFamily: UI, letterSpacing: "0.01em",
            }}
          >
            Mark as {FULFIL_STYLE[nextStatus].label}
          </button>
        )}
      </div>

      {/* ── Two-column grid ───────────────────────────────── */}
      <div className="rg-split" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.25rem", alignItems: "start" }}>

        {/* ── LEFT ─────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Customer info */}
          <SectionCard title="Customer">
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                backgroundColor: C.gold, color: C.charcoal,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8rem", fontWeight: 700, flexShrink: 0, letterSpacing: "0.03em",
              }}>
                {order.customerName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: C.charcoal, marginBottom: "0.625rem" }}>
                  {order.customerName}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
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
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
                <thead>
                  <tr>
                    {["Product", "Variant", "Qty", "Unit Price", "Line Total"].map(h => (
                      <th key={h} style={{
                        padding: "0 0 0.625rem",
                        textAlign: h === "Qty" || h === "Unit Price" || h === "Line Total" ? "right" : "left",
                        fontSize: "0.63rem", letterSpacing: "0.09em", textTransform: "uppercase",
                        color: "rgba(43,35,32,0.38)", fontWeight: 500, fontFamily: UI,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => {
                    const lineCad = item.unitCad * item.qty;
                    return (
                      <tr key={i} style={{ borderTop: "1px solid rgba(43,35,32,0.06)" }}>
                        <td style={{ padding: "0.75rem 0" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 5, flexShrink: 0,
                              backgroundColor: C.maroon, opacity: 0.75,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <span style={{ color: "#fff", fontSize: "0.55rem", fontWeight: 700 }}>IMG</span>
                            </div>
                            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: C.charcoal }}>{item.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem 0.5rem", fontSize: "0.75rem", color: "rgba(43,35,32,0.55)" }}>
                          {item.variant}
                        </td>
                        <td style={{ padding: "0.75rem 0", textAlign: "right", fontSize: "0.8rem", color: C.charcoal }}>{item.qty}</td>
                        <td style={{ padding: "0.75rem 0", textAlign: "right", fontSize: "0.8rem", color: C.charcoal }}>CAD ${item.unitCad}</td>
                        <td style={{ padding: "0.75rem 0", textAlign: "right", fontSize: "0.8rem", fontWeight: 600, color: C.charcoal }}>CAD ${lineCad}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Internal notes */}
          <SectionCard title={
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <LockIcon />
              <span>Internal Notes</span>
              <span style={{ fontSize: "0.62rem", color: "rgba(43,35,32,0.35)", fontWeight: 400, letterSpacing: "0.03em", marginLeft: "0.25rem" }}>
                (private — not sent to buyer)
              </span>
            </div>
          }>
            <textarea
              placeholder="Add a private note about this order..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              style={{
                fontFamily: UI, fontSize: "0.82rem", color: C.charcoal,
                backgroundColor: "rgba(43,35,32,0.02)",
                border: "1px solid rgba(43,35,32,0.12)", borderRadius: 6,
                padding: "0.625rem 0.75rem", width: "100%",
                outline: "none", resize: "vertical", lineHeight: 1.6,
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.625rem" }}>
              <button style={{
                fontFamily: UI, fontSize: "0.75rem", fontWeight: 500,
                color: C.charcoal, backgroundColor: "rgba(43,35,32,0.06)",
                border: "none", borderRadius: 6,
                padding: "0.4rem 0.875rem", cursor: "pointer",
              }}>
                Save Note
              </button>
            </div>
          </SectionCard>
        </div>

        {/* ── RIGHT ────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "sticky", top: "1.5rem" }}>

          {/* Payment summary */}
          <SectionCard title="Payment">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <SummaryRow label="Subtotal" value={`CAD $${subtotal}`} />
              <SummaryRow label="Shipping" value={`CAD $${order.shippingCad}`} />
              {order.discountCad > 0 && (
                <SummaryRow label="Discount" value={`−CAD $${order.discountCad}`} valueColor={C.teal} />
              )}
              <div style={{ borderTop: "1px solid rgba(43,35,32,0.1)", paddingTop: "0.5rem", marginTop: "0.125rem" }}>
                <SummaryRow label="Total" value={`CAD $${total}`} bold />
              </div>
            </div>
            <div style={{
              marginTop: "0.875rem", padding: "0.625rem 0.75rem",
              backgroundColor: "rgba(59,138,147,0.07)", borderRadius: 6,
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                backgroundColor: C.teal, flexShrink: 0, display: "inline-block",
              }} />
              <span style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.6)", lineHeight: 1.3 }}>
                <strong style={{ color: C.charcoal, fontWeight: 600 }}>Paid</strong> via {order.paymentMethod}
              </span>
            </div>
          </SectionCard>

          {/* Fulfilment / tracking */}
          <SectionCard title="Fulfilment">
            <FieldLabel>Carrier</FieldLabel>
            <div style={{ position: "relative", marginBottom: "0.75rem" }}>
              <select
                value={carrier}
                onChange={e => setCarrier(e.target.value)}
                style={{
                  fontFamily: UI, fontSize: "0.78rem", color: C.charcoal,
                  backgroundColor: "#fff", border: "1px solid rgba(43,35,32,0.14)",
                  borderRadius: 6, padding: "0.45rem 2rem 0.45rem 0.75rem",
                  appearance: "none", cursor: "pointer", outline: "none", width: "100%",
                }}
              >
                {CARRIERS.map(c => <option key={c}>{c}</option>)}
              </select>
              <span style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(43,35,32,0.4)", lineHeight: 0 }}>
                <ChevronDown />
              </span>
            </div>

            <FieldLabel>Tracking Number</FieldLabel>
            <input
              type="text"
              placeholder="e.g. JD000940012345678901"
              value={tracking}
              onChange={e => setTracking(e.target.value)}
              style={{
                fontFamily: UI, fontSize: "0.8rem", color: C.charcoal,
                backgroundColor: "#fff", border: "1px solid rgba(43,35,32,0.14)",
                borderRadius: 6, padding: "0.5rem 0.75rem", width: "100%",
                outline: "none", boxSizing: "border-box", marginBottom: "0.75rem",
              }}
            />

            <button
              onClick={saveTracking}
              style={{
                width: "100%", backgroundColor: saved ? C.teal : C.gold,
                color: saved ? "#fff" : C.charcoal, border: "none", borderRadius: 7,
                padding: "0.6rem 1rem", fontSize: "0.8rem", fontWeight: 700,
                cursor: "pointer", fontFamily: UI, letterSpacing: "0.01em",
                transition: "background-color 0.2s, color 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              }}
            >
              <TruckIcon size={14} />
              {saved ? "Saved & Notified ✓" : "Save & Notify Customer"}
            </button>

            {order.status === "shipped" && order.tracking && (
              <div style={{
                marginTop: "0.75rem", padding: "0.5rem 0.625rem",
                backgroundColor: "rgba(212,169,78,0.08)", borderRadius: 5,
                fontSize: "0.67rem", color: "#8A6818", lineHeight: 1.5,
              }}>
                Tracking: <strong>{order.tracking}</strong> via {order.carrier}
              </div>
            )}
          </SectionCard>

          {/* Message customer */}
          <Link
            to="/console/messages"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "7px", padding: "0.6rem 1rem", borderRadius: 7,
              border: "1px solid rgba(43,35,32,0.16)",
              backgroundColor: "transparent", color: C.charcoal,
              fontSize: "0.78rem", fontWeight: 500, fontFamily: UI,
              textDecorationLine: "none", letterSpacing: "0.01em",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(43,35,32,0.04)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}
          >
            <MessageSquare size={14} /> Message Customer
          </Link>

          {/* Back */}
          <Link
            to="/console/orders"
            style={{ display: "block", textAlign: "center", fontSize: "0.72rem", color: "rgba(43,35,32,0.38)", textDecorationLine: "none", padding: "0.25rem" }}
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
    <div style={{ backgroundColor: "#fff", borderRadius: 8, border: "1px solid rgba(43,35,32,0.07)", padding: "1.25rem" }}>
      {title && (
        <h2 style={{
          fontFamily: UI, fontSize: "0.82rem", fontWeight: 600,
          color: C.charcoal, margin: "0 0 1rem",
          paddingBottom: "0.75rem", borderBottom: "1px solid rgba(43,35,32,0.06)",
          letterSpacing: "-0.01em", display: "flex", alignItems: "center",
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
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
      <span style={{ color: "rgba(43,35,32,0.35)", flexShrink: 0, marginTop: "1px", lineHeight: 0 }}>{icon}</span>
      <span style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.7)", lineHeight: 1.4 }}>{children}</span>
    </div>
  );
}

function SummaryRow({ label, value, bold = false, valueColor }: { label: string; value: string; bold?: boolean; valueColor?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontSize: "0.77rem", color: "rgba(43,35,32,0.52)", fontFamily: UI }}>{label}</span>
      <span style={{ fontSize: bold ? "0.95rem" : "0.77rem", fontWeight: bold ? 700 : 400, color: valueColor ?? C.charcoal, fontFamily: UI }}>
        {value}
      </span>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: "block", fontSize: "0.7rem", fontWeight: 500,
      color: "rgba(43,35,32,0.55)", letterSpacing: "0.07em",
      textTransform: "uppercase", marginBottom: "0.375rem", fontFamily: UI,
    }}>
      {children}
    </label>
  );
}
