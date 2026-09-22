'use client';

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { C, UI } from "../../tokens";
import { createDiscountCode, updateDiscountCode, toggleDiscountCode, deleteDiscountCode, createBanner, updateBanner, deleteBanner } from "@/server/promotion-actions";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "codes" | "banners";

interface DiscountCode {
  id: string;
  code: string;
  type: "Percentage" | "Fixed Amount";
  value: string;
  usedCount: number;
  limitCount: number | null;
  active: boolean;
  expiry: string;
  expired: boolean;
  rawValue: number;
  rawExpiresAt: string | null;
}

interface Banner {
  id: string;
  text: string;
  cta: string;
  dateRange: string;
  status: "Live" | "Scheduled" | "Expired";
  rawStartsAt: string;
  rawEndsAt: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const CATEGORIES = ["Aso-Oke", "Filà / Caps", "Gele Sets", "Adire", "Custom Orders", "Accessories"];

const BANNER_STATUS_STYLES = {
  Live: { bg: "rgba(59,138,147,0.12)", color: C.teal },
  Scheduled: { bg: "rgba(46,74,158,0.1)", color: "#2E4A9E" },
  Expired: { bg: "rgba(43,35,32,0.07)", color: "rgba(43,35,32,0.4)" },
};

// ── Shared sub-components ─────────────────────────────────────────────────────

function BannerStatusBadge({ status }: { status: "Live" | "Scheduled" | "Expired" }) {
  const s = BANNER_STATUS_STYLES[status];
  return (
    <span
      className="inline-block px-2 py-[2px] rounded-full font-medium whitespace-nowrap"
      style={{
        fontSize: "0.68rem",
        backgroundColor: s.bg,
        color: s.color,
        fontFamily: UI,
      }}
    >
      {status}
    </span>
  );
}

function Toggle({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={active}
      className="inline-flex items-center gap-[6px] bg-none border-none cursor-pointer p-0"
      style={{ fontFamily: UI }}
    >
      <span
        className="inline-flex items-center w-8 h-[18px] rounded-full px-[2px] relative transition-colors duration-200"
        style={{
          backgroundColor: active ? C.gold : "rgba(43,35,32,0.18)",
        }}
      >
        <span
          className="block w-[14px] h-[14px] rounded-full bg-white transition-transform duration-200"
          style={{
            transform: `translateX(${active ? 14 : 0}px)`,
          }}
        />
      </span>
      <span className="font-medium" style={{ fontSize: "0.72rem", color: active ? "#8A6818" : "rgba(43,35,32,0.45)" }}>
        {active ? "Active" : "Inactive"}
      </span>
    </button>
  );
}

function UsageBar({ used, limit }: { used: number; limit: number | null }) {
  if (!limit) {
    return (
      <span style={{ fontSize: "0.75rem", color: "rgba(43,35,32,0.55)" }}>
        {used} used · unlimited
      </span>
    );
  }
  const pct = Math.min((used / limit) * 100, 100);
  return (
    <div className="flex flex-col gap-[3px] min-w-[90px]">
      <div className="flex justify-between items-center">
        <span className="font-medium" style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.7)" }}>
          {used}/{limit}
        </span>
        <span style={{ fontSize: "0.65rem", color: "rgba(43,35,32,0.4)" }}>used</span>
      </div>
      <div className="h-1 rounded-sm overflow-hidden" style={{ backgroundColor: "rgba(43,35,32,0.1)" }}>
        <div
          className="h-full rounded-sm"
          style={{
            width: `${pct}%`,
            backgroundColor: pct > 90 ? C.maroon : C.gold,
          }}
        />
      </div>
    </div>
  );
}

function EmptyState({ label, onAction, actionLabel }: { label: string; onAction: () => void; actionLabel: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center p-[4rem_2rem] bg-white rounded-lg gap-4"
      style={{
        border: "1px solid rgba(43,35,32,0.07)",
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(212,169,78,0.1)]"
        style={{
          fontSize: "1.35rem",
          color: C.gold,
        }}
      >
        %
      </div>
      <div className="text-center">
        <div className="font-semibold" style={{ fontSize: "0.9rem", color: C.charcoal, fontFamily: UI }}>{label}</div>
        <div className="mt-1" style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.45)", fontFamily: UI }}>
          Get started by creating your first promotion
        </div>
      </div>
      <button onClick={onAction} className="border-none rounded-md px-[1.125rem] py-[0.55rem] font-semibold cursor-pointer" style={{ backgroundColor: C.gold, color: C.charcoal, fontSize: "0.82rem", fontFamily: UI }}>
        {actionLabel}
      </button>
    </div>
  );
}

// ── Discount codes table ──────────────────────────────────────────────────────

function DiscountTable({
  codes,
  onToggle,
  onDelete,
  onEdit,
}: {
  codes: DiscountCode[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (code: DiscountCode) => void;
}) {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden"
      style={{
        border: "1px solid rgba(43,35,32,0.07)",
      }}
    >
      <div className="table-scroll">
        <table className="card-table w-full border-collapse min-w-[680px]">
          <thead>
            <tr>
              {["Code", "Type", "Value", "Usage", "Status", "Expiry", ""].map((h) => (
                <th
                  key={h}
                  className="p-[0.625rem_1.25rem] text-left uppercase font-medium whitespace-nowrap"
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.09em",
                    color: "rgba(43,35,32,0.38)",
                    borderBottom: "1px solid rgba(43,35,32,0.06)",
                    fontFamily: UI,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {codes.map((c, i) => (
              <tr key={c.id} style={{ backgroundColor: i % 2 === 0 ? "transparent" : "rgba(43,35,32,0.018)" }}>
                <td className="p-[0.75rem_1.25rem]">
                  <span
                    className="font-semibold px-2 py-[2px] rounded tracking-[0.06em] bg-[rgba(43,35,32,0.05)]"
                    style={{
                      fontFamily: UI,
                      fontSize: "0.8rem",
                      color: C.charcoal,
                    }}
                  >
                    {c.code}
                  </span>
                </td>
                <td className="p-[0.75rem_1.25rem]" style={{ fontSize: "0.77rem", color: "rgba(43,35,32,0.6)" }}>
                  {c.type}
                </td>
                <td className="p-[0.75rem_1.25rem] font-semibold" style={{ fontSize: "0.82rem", color: C.charcoal }}>
                  {c.value}
                </td>
                <td className="p-[0.75rem_1.25rem]">
                  <UsageBar used={c.usedCount} limit={c.limitCount} />
                </td>
                <td className="p-[0.75rem_1.25rem]">
                  <Toggle
                    active={c.active && !c.expired}
                    onChange={() => { if (!c.expired) onToggle(c.id); }}
                  />
                </td>
                <td
                  className="p-[0.75rem_1.25rem] whitespace-nowrap"
                  style={{
                    fontSize: "0.77rem",
                    color: c.expired ? C.maroon : "rgba(43,35,32,0.55)",
                  }}
                >
                  {c.expiry}
                </td>
                <td className="p-[0.75rem_1.25rem]">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(c)}
                      className="bg-none rounded px-[10px] py-[3px] cursor-pointer whitespace-nowrap border border-solid border-[rgba(43,35,32,0.14)]"
                      style={{
                        fontSize: "0.7rem",
                        color: "rgba(43,35,32,0.6)",
                        fontFamily: UI,
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(c.id)}
                      className="bg-none rounded px-[10px] py-[3px] cursor-pointer whitespace-nowrap border border-solid border-[rgba(122,46,56,0.2)]"
                      style={{
                        fontSize: "0.7rem",
                        color: C.maroon,
                        fontFamily: UI,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Homepage banners tab ──────────────────────────────────────────────────────

function BannersTab({ initialBanners, onAdd, onEdit }: { initialBanners: Banner[]; onAdd: () => void; onEdit: (banner: Banner) => void }) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => setBanners(initialBanners), [initialBanners]);

  const handleDelete = async (id: string) => {
    setBanners((prev) => prev.filter((x) => x.id !== id));
    await deleteBanner(id);
    startTransition(() => {
      router.refresh();
    });
  };

  if (banners.length === 0) {
    return <EmptyState label="No active banners" onAction={onAdd} actionLabel="+ Add Banner" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {banners.map((b) => (
        <div
          key={b.id}
          className="bg-white rounded-lg p-[1rem_1.25rem] flex items-start gap-5"
          style={{
            border: "1px solid rgba(43,35,32,0.07)",
          }}
        >
          {/* Mini strip preview */}
          <div
            className="shrink-0 w-[200px] rounded-[5px] overflow-hidden"
            style={{
              border: "1px solid rgba(43,35,32,0.1)",
            }}
          >
            <div className="px-[10px] py-[6px]" style={{ backgroundColor: C.maroon }}>
              <p
                className="leading-snug m-0"
                style={{
                  color: C.cream,
                  fontSize: "0.6rem",
                  fontFamily: UI,
                }}
              >
                {b.text.length > 60 ? b.text.slice(0, 60) + "…" : b.text}
              </p>
              {b.cta && (
                <span
                  className="font-semibold underline block mt-[2px]"
                  style={{
                    color: C.gold,
                    fontSize: "0.58rem",
                  }}
                >
                  {b.cta} →
                </span>
              )}
            </div>
            <div
              className="px-[10px] py-[5px] flex justify-between items-center"
              style={{
                backgroundColor: C.charcoal,
              }}
            >
              <span className="opacity-80" style={{ color: C.cream, fontSize: "0.55rem", fontFamily: UI }}>
                AdeClassics
              </span>
              <div className="flex gap-[6px]">
                {["Shop", "About"].map((l) => (
                  <span key={l} style={{ color: "rgba(250,246,240,0.45)", fontSize: "0.5rem" }}>
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p
              className="font-medium leading-snug m-[0_0_0.375rem]"
              style={{
                fontSize: "0.84rem",
                color: C.charcoal,
                fontFamily: UI,
              }}
            >
              {b.text}
            </p>
            {b.cta && (
              <p className="m-[0_0_0.375rem]" style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.48)", fontFamily: UI }}>
                CTA: <span className="font-medium" style={{ color: C.charcoal }}>{b.cta}</span>
              </p>
            )}
            <p className="m-0" style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.45)", fontFamily: UI }}>
              {b.dateRange}
            </p>
          </div>

          {/* Status + actions */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <BannerStatusBadge status={b.status} />
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(b)}
                className="bg-none rounded px-[10px] py-[3px] cursor-pointer border border-solid border-[rgba(43,35,32,0.14)]"
                style={{
                  fontSize: "0.7rem",
                  color: "rgba(43,35,32,0.6)",
                  fontFamily: UI,
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="bg-none rounded px-[10px] py-[3px] cursor-pointer border border-solid border-[rgba(122,46,56,0.2)]"
                style={{
                  fontSize: "0.7rem",
                  color: C.maroon,
                  fontFamily: UI,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Create Discount Code slide-over ───────────────────────────────────────────

function generateCode(): string {
  const prefixes = ["SAVE", "FTW", "STYLE", "GIFT", "GELE", "ASO"];
  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const n = Math.floor(Math.random() * 30) + 5;
  return `${p}${n}`;
}

function CreateCodePanel({ onClose, onSubmit, initial }: { onClose: () => void; onSubmit: (data: any) => Promise<void>; initial?: DiscountCode }) {
  const isEdit = !!initial;
  const [discountType, setDiscountType] = useState<"Percentage" | "Fixed Amount">(initial?.type ?? "Percentage");
  const [code, setCode] = useState(initial?.code ?? "");
  const [appliesTo, setAppliesTo] = useState<"all" | "categories">("all");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [value, setValue] = useState(initial ? String(initial.rawValue) : "");
  const [limit, setLimit] = useState(initial?.limitCount != null ? String(initial.limitCount) : "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(initial?.rawExpiresAt ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCat = (cat: string) =>
    setSelectedCats((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));

  const handleCreate = async () => {
    const val = Number(value);
    if (!code || isNaN(val) || val <= 0) {
      alert("Invalid code or value");
      return;
    }
    setIsSubmitting(true);
    await onSubmit({
      code,
      type: discountType,
      value: val,
      usageLimit: limit ? Number(limit) : null,
      expiresAt: endDate ? new Date(endDate).toISOString() : null,
    });
    setIsSubmitting(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(43,35,32,0.38)" }} />
      <div
        style={{
          position: "relative",
          width: 480,
          height: "100%",
          backgroundColor: "#fff",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          fontFamily: UI,
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
          }}
        >
          <div>
            <div className="font-semibold" style={{ fontSize: "1rem", color: C.charcoal }}>{isEdit ? "Edit Discount Code" : "Create Discount Code"}</div>
            <div className="mt-[2px]" style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.45)" }}>
              {isEdit ? "Update this promotional code" : "Set up a new promotional code for your store"}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="bg-none border-none cursor-pointer leading-none pl-2"
            style={{ fontSize: "1.35rem", color: "rgba(43,35,32,0.4)" }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col gap-6">
          {/* ── Group 1: Basics */}
          <section className="flex flex-col gap-4">
            <div className="uppercase font-medium" style={{ fontSize: "0.62rem", letterSpacing: "0.1em", color: "rgba(43,35,32,0.38)" }}>
              Basics
            </div>

            <div>
              <label className="block font-medium mb-[0.375rem]" style={{ fontSize: "0.78rem", color: C.charcoal }}>
                Code Name
              </label>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME10"
                  className="flex-1 px-3 py-2 rounded-md outline-none bg-white tracking-[0.05em] border border-solid border-[rgba(43,35,32,0.18)]"
                  style={{
                    fontSize: "0.82rem",
                    fontFamily: UI,
                    color: C.charcoal,
                  }}
                />
                <button
                  onClick={() => setCode(generateCode())}
                  className="px-[0.875rem] py-2 rounded-md font-medium cursor-pointer whitespace-nowrap bg-[rgba(43,35,32,0.04)] border border-solid border-[rgba(43,35,32,0.16)]"
                  style={{
                    fontSize: "0.75rem",
                    color: C.charcoal,
                    fontFamily: UI,
                  }}
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2" style={{ fontSize: "0.78rem", color: C.charcoal }}>
                Discount Type
              </label>
              <div className="flex gap-5">
                {(["Percentage", "Fixed Amount"] as const).map((t) => (
                  <label key={t} className="flex items-center gap-[0.4rem] cursor-pointer">
                    <input
                      type="radio"
                      name="discountType"
                      value={t}
                      checked={discountType === t}
                      onChange={() => setDiscountType(t)}
                      className="w-[14px] h-[14px]"
                      style={{ accentColor: C.gold }}
                    />
                    <span style={{ fontSize: "0.8rem", color: C.charcoal }}>{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <div className="h-[1px]" style={{ backgroundColor: "rgba(43,35,32,0.07)" }} />

          {/* ── Group 2: Value & Limits */}
          <section className="flex flex-col gap-[0.875rem]">
            <div className="uppercase font-medium" style={{ fontSize: "0.62rem", letterSpacing: "0.1em", color: "rgba(43,35,32,0.38)" }}>
              Value & Limits
            </div>
            <div className="rg-2">
              <div>
                <label className="block font-medium mb-[0.375rem]" style={{ fontSize: "0.78rem", color: C.charcoal }}>
                  {discountType === "Percentage" ? "Percentage (%)" : "Amount (CAD $)"}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={discountType === "Percentage" ? "10" : "25.00"}
                  className="w-full px-3 py-2 rounded-md outline-none box-border bg-white border border-solid border-[rgba(43,35,32,0.18)]"
                  style={{ fontSize: "0.82rem", fontFamily: UI, color: C.charcoal }}
                />
              </div>
              <div>
                <label className="block font-medium mb-[0.375rem]" style={{ fontSize: "0.78rem", color: C.charcoal }}>
                  Min. Order Value <OptLabel />
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-md outline-none box-border bg-white border border-solid border-[rgba(43,35,32,0.18)]"
                  style={{ fontSize: "0.82rem", fontFamily: UI, color: C.charcoal }}
                />
              </div>
              <div>
                <label className="block font-medium mb-[0.375rem]" style={{ fontSize: "0.78rem", color: C.charcoal }}>
                  Usage Limit <OptLabel />
                </label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="Unlimited"
                  className="w-full px-3 py-2 rounded-md outline-none box-border bg-white border border-solid border-[rgba(43,35,32,0.18)]"
                  style={{ fontSize: "0.82rem", fontFamily: UI, color: C.charcoal }}
                />
              </div>
            </div>
          </section>

          <div className="h-[1px]" style={{ backgroundColor: "rgba(43,35,32,0.07)" }} />

          {/* ── Group 3: Scope & Dates */}
          <section className="flex flex-col gap-[0.875rem]">
            <div className="uppercase font-medium" style={{ fontSize: "0.62rem", letterSpacing: "0.1em", color: "rgba(43,35,32,0.38)" }}>
              Scope & Dates
            </div>

            <div>
              <label className="block font-medium mb-2" style={{ fontSize: "0.78rem", color: C.charcoal }}>
                Applies To
              </label>
              <div className="flex gap-5 mb-3">
                {(["all", "categories"] as const).map((t) => (
                  <label key={t} className="flex items-center gap-[0.4rem] cursor-pointer">
                    <input
                      type="radio"
                      name="appliesTo"
                      value={t}
                      checked={appliesTo === t}
                      onChange={() => setAppliesTo(t)}
                      className="w-[14px] h-[14px]"
                      style={{ accentColor: C.gold }}
                    />
                    <span style={{ fontSize: "0.8rem", color: C.charcoal }}>
                      {t === "all" ? "All products" : "Specific categories"}
                    </span>
                  </label>
                ))}
              </div>
              {appliesTo === "categories" && (
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const sel = selectedCats.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCat(cat)}
                        className="px-3 py-1 rounded-full cursor-pointer transition-all duration-100 border border-solid"
                        style={{
                          borderColor: sel ? C.gold : "rgba(43,35,32,0.18)",
                          backgroundColor: sel ? "rgba(212,169,78,0.12)" : "transparent",
                          color: sel ? "#8A6818" : "rgba(43,35,32,0.65)",
                          fontSize: "0.75rem",
                          fontWeight: sel ? 500 : 400,
                          fontFamily: UI,
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rg-2">
              <div>
                <label className="block font-medium mb-[0.375rem]" style={{ fontSize: "0.78rem", color: C.charcoal }}>Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 rounded-md outline-none box-border bg-white border border-solid border-[rgba(43,35,32,0.18)]" style={{ fontSize: "0.82rem", fontFamily: UI, color: C.charcoal }} />
              </div>
              <div>
                <label className="block font-medium mb-[0.375rem]" style={{ fontSize: "0.78rem", color: C.charcoal }}>End Date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 rounded-md outline-none box-border bg-white border border-solid border-[rgba(43,35,32,0.18)]" style={{ fontSize: "0.82rem", fontFamily: UI, color: C.charcoal }} />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          className="p-[1rem_1.5rem] flex gap-3 justify-end shrink-0"
          style={{
            borderTop: "1px solid rgba(43,35,32,0.08)",
          }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-transparent cursor-pointer border border-solid border-[rgba(43,35,32,0.18)]"
            style={{ fontSize: "0.82rem", color: "rgba(43,35,32,0.65)", fontFamily: UI }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="px-6 py-2 border-none rounded-md font-semibold cursor-pointer"
            style={{ backgroundColor: C.gold, color: C.charcoal, fontSize: "0.82rem", fontFamily: UI, opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Code"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Create Banner slide-over ───────────────────────────────────────────────────

function CreateBannerPanel({ onClose, onSubmit, initial }: { onClose: () => void; onSubmit: (data: any) => Promise<void>; initial?: Banner }) {
  const isEdit = !!initial;
  const [bannerText, setBannerText] = useState(initial?.text ?? "");
  const [bannerCTA, setBannerCTA] = useState(initial?.cta ?? "");
  const [startDate, setStartDate] = useState(initial?.rawStartsAt ?? "");
  const [endDate, setEndDate] = useState(initial?.rawEndsAt ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!bannerText || !startDate || !endDate) {
      alert("Please fill in required fields (Text, Start Date, End Date).");
      return;
    }
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    let status: 'LIVE' | 'SCHEDULED' | 'EXPIRED' = 'SCHEDULED';
    if (now >= start && now <= end) status = 'LIVE';
    if (now > end) status = 'EXPIRED';

    setIsSubmitting(true);
    await onSubmit({
      text: bannerText,
      ctaLabel: bannerCTA,
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      status,
    });
    setIsSubmitting(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(43,35,32,0.38)" }} />
      <div
        style={{
          position: "relative",
          width: 480,
          height: "100%",
          backgroundColor: "#fff",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          fontFamily: UI,
        }}
      >
        {/* Header */}
        <div className="p-[1.25rem_1.5rem] border-b border-solid border-[rgba(43,35,32,0.08)] flex items-start justify-between shrink-0">
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: C.charcoal }}>{isEdit ? "Edit Homepage Banner" : "Add Homepage Banner"}</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.45)", marginTop: 2 }}>
              Configure a promotional strip for the buyer-facing site
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="bg-transparent border-none cursor-pointer p-[0_0_0_8px]"
            style={{ fontSize: "1.35rem", color: "rgba(43,35,32,0.4)", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col gap-5">
          <div>
            <label className="block font-medium mb-[0.375rem]" style={{ fontSize: "0.78rem", color: C.charcoal }}>
              Banner Text
            </label>
            <textarea
              rows={3}
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              placeholder="e.g. Free shipping on all orders over CAD $258 · Use code FREESHIP25"
              className="w-full px-3 py-2 rounded-md outline-none resize-y box-border bg-white border border-solid border-[rgba(43,35,32,0.18)]"
              style={{
                fontSize: "0.82rem",
                fontFamily: UI,
                color: C.charcoal,
                lineHeight: 1.5,
              }}
            />
          </div>

          <div>
            <label className="block font-medium mb-[0.375rem]" style={{ fontSize: "0.78rem", color: C.charcoal }}>
              CTA / Link Text <OptLabel />
            </label>
            <input
              value={bannerCTA}
              onChange={(e) => setBannerCTA(e.target.value)}
              placeholder="e.g. Shop Now"
              className="w-full px-3 py-2 rounded-md outline-none box-border bg-white border border-solid border-[rgba(43,35,32,0.18)]"
              style={{ fontSize: "0.82rem", fontFamily: UI, color: C.charcoal }}
            />
          </div>

          <div className="rg-2">
            <div>
              <label className="block font-medium mb-[0.375rem]" style={{ fontSize: "0.78rem", color: C.charcoal }}>Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 rounded-md outline-none box-border bg-white border border-solid border-[rgba(43,35,32,0.18)]" style={{ fontSize: "0.82rem", fontFamily: UI, color: C.charcoal }} />
            </div>
            <div>
              <label className="block font-medium mb-[0.375rem]" style={{ fontSize: "0.78rem", color: C.charcoal }}>End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 rounded-md outline-none box-border bg-white border border-solid border-[rgba(43,35,32,0.18)]" style={{ fontSize: "0.82rem", fontFamily: UI, color: C.charcoal }} />
            </div>
          </div>

          {/* Live preview */}
          <div>
            <div className="uppercase font-medium mb-[0.625rem]" style={{ fontSize: "0.62rem", letterSpacing: "0.1em", color: "rgba(43,35,32,0.38)" }}>
              Live Preview
            </div>
            <div
              className="rounded-lg overflow-hidden"
              style={{
                border: "1px solid rgba(43,35,32,0.12)",
              }}
            >
              {/* Fake browser chrome */}
              <div
                className="px-[10px] py-[6px] flex gap-[5px] items-center"
                style={{
                  backgroundColor: "#f0eeeb",
                  borderBottom: "1px solid rgba(43,35,32,0.1)",
                }}
              >
                <div className="w-[7px] h-[7px] rounded-full opacity-70" style={{ backgroundColor: "#E88" }} />
                <div className="w-[7px] h-[7px] rounded-full opacity-70" style={{ backgroundColor: "#DB5" }} />
                <div className="w-[7px] h-[7px] rounded-full opacity-70" style={{ backgroundColor: "#8C8" }} />
                <div className="flex-1 rounded-[3px] h-[11px] ml-[6px] opacity-80" style={{ backgroundColor: "#fff" }} />
              </div>
              {/* Promo strip */}
              <div
                className="px-4 py-[7px] flex items-center justify-center gap-3 flex-wrap"
                style={{
                  backgroundColor: C.maroon,
                }}
              >
                <span className="text-center leading-snug" style={{ color: C.cream, fontSize: "0.7rem", fontFamily: UI }}>
                  {bannerText || <span className="opacity-45 italic">Your banner text will appear here</span>}
                </span>
                {(bannerCTA || bannerText) && (
                  <span className="font-semibold whitespace-nowrap underline" style={{ color: C.gold, fontSize: "0.68rem" }}>
                    {bannerCTA || "Learn more"} →
                  </span>
                )}
              </div>
              {/* Fake nav */}
              <div
                className="px-4 py-2 flex items-center justify-between"
                style={{
                  backgroundColor: C.charcoal,
                }}
              >
                <span className="opacity-85" style={{ color: C.cream, fontSize: "0.66rem", fontFamily: UI }}>
                  AdeClassics
                </span>
                <div className="flex gap-3">
                  {["Shop", "Lookbook", "About"].map((l) => (
                    <span key={l} style={{ color: "rgba(250,246,240,0.48)", fontSize: "0.58rem" }}>
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-[1rem_1.5rem] flex gap-3 justify-end shrink-0"
          style={{
            borderTop: "1px solid rgba(43,35,32,0.08)",
          }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-transparent cursor-pointer border border-solid border-[rgba(43,35,32,0.18)]"
            style={{ fontSize: "0.82rem", color: "rgba(43,35,32,0.65)", fontFamily: UI }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="px-6 py-2 border-none rounded-md font-semibold cursor-pointer"
            style={{ backgroundColor: C.gold, color: C.charcoal, fontSize: "0.82rem", fontFamily: UI, opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Add Banner"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OptLabel() {
  return <span style={{ color: "rgba(43,35,32,0.35)", fontWeight: 400 }}>(optional)</span>;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ConsolePromotions({ initialCodes, initialBanners }: { initialCodes: DiscountCode[]; initialBanners: Banner[] }) {
  const [tab, setTab] = useState<Tab>("codes");
  const [codes, setCodes] = useState<DiscountCode[]>(initialCodes);
  const [showPanel, setShowPanel] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | undefined>();
  const [editingBanner, setEditingBanner] = useState<Banner | undefined>();
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => setCodes(initialCodes), [initialCodes]);

  const toggleCode = async (id: string) => {
    const target = codes.find(c => c.id === id);
    if (!target) return;
    setCodes((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
    await toggleDiscountCode(id, !target.active);
    startTransition(() => {
      router.refresh();
    });
  };

  const deleteCode = async (id: string) => {
    setCodes((prev) => prev.filter((c) => c.id !== id));
    await deleteDiscountCode(id);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleCreateCode = async (data: any) => {
    const res = editingCode ? await updateDiscountCode(editingCode.id, data) : await createDiscountCode(data);
    if (!res.ok) {
      alert(res.message);
      return;
    }
    startTransition(() => {
      router.refresh();
    });
    closePanel();
  };

  const handleCreateBanner = async (data: any) => {
    const res = editingBanner ? await updateBanner(editingBanner.id, data) : await createBanner(data);
    if (!res.ok) {
      alert(res.message);
      return;
    }
    startTransition(() => {
      router.refresh();
    });
    closePanel();
  };

  const closePanel = () => {
    setShowPanel(false);
    setEditingCode(undefined);
    setEditingBanner(undefined);
  };

  const openPanel = () => {
    setEditingCode(undefined);
    setEditingBanner(undefined);
    setShowPanel(true);
  };

  const editCode = (code: DiscountCode) => {
    setEditingCode(code);
    setShowPanel(true);
  };

  const editBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setShowPanel(true);
  };

  const TAB_LABELS: Record<Tab, string> = { codes: "Discount Codes", banners: "Homepage Banners" };

  return (
    <div className="console-page p-7" style={{ fontFamily: UI }}>
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1
            className="font-semibold m-0 tracking-[-0.02em]"
            style={{
              fontFamily: UI,
              fontSize: "1.35rem",
              color: C.charcoal,
            }}
          >
            Promotions & Discounts
          </h1>
          <p className="m-[4px_0_0]" style={{ fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.45)" }}>
            Manage discount codes and homepage promotional banners
          </p>
        </div>
        <button
          onClick={openPanel}
          className="border-none rounded-md px-[1.125rem] py-[0.575rem] font-semibold cursor-pointer flex items-center gap-[0.375rem] shrink-0 tracking-[0.01em]"
          style={{
            backgroundColor: C.gold,
            color: C.charcoal,
            fontSize: "0.82rem",
            fontFamily: UI,
          }}
        >
          <span className="leading-none" style={{ fontSize: "1rem" }}>+</span>
          {tab === "codes" ? "Create Promotion" : "Add Banner"}
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex mb-5"
        style={{
          borderBottom: "1px solid rgba(43,35,32,0.1)",
        }}
      >
        {(["codes", "banners"] as Tab[]).map((t) => {
          const isActive = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="bg-none border-none px-[1.125rem] py-2 -mb-[1px] cursor-pointer whitespace-nowrap transition-colors duration-120"
              style={{
                borderBottom: `2px solid ${isActive ? C.gold : "transparent"}`,
                fontSize: "0.82rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? C.charcoal : "rgba(43,35,32,0.48)",
                fontFamily: UI,
              }}
            >
              {TAB_LABELS[t]}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === "codes" &&
        (codes.length === 0 ? (
          <EmptyState label="No active promotions" onAction={openPanel} actionLabel="+ Create Promotion" />
        ) : (
          <DiscountTable codes={codes} onToggle={toggleCode} onDelete={deleteCode} onEdit={editCode} />
        ))}
      {tab === "banners" && <BannersTab initialBanners={initialBanners} onAdd={openPanel} onEdit={editBanner} />}

      {/* Slide-over panels */}
      {showPanel && tab === "codes" && <CreateCodePanel onClose={closePanel} onSubmit={handleCreateCode} initial={editingCode} />}
      {showPanel && tab === "banners" && <CreateBannerPanel onClose={closePanel} onSubmit={handleCreateBanner} initial={editingBanner} />}
    </div>
  );
}
