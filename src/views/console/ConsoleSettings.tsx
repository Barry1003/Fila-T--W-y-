'use client';

import { useState, useCallback } from "react";
import { C, UI, DISPLAY, label } from "../../tokens";

// ── Shared primitives ────────────────────────────────────────────────────────

const CARD: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: 8,
  border: "1px solid rgba(43,35,32,0.07)",
};

function SectionCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <div style={{ ...CARD, padding: "1.5rem", ...style }}>{children}</div>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        ...label,
        display: "block",
        color: "rgba(43,35,32,0.5)",
        marginBottom: "0.4rem",
      }}
    >
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.55rem 0.75rem",
  border: "1px solid rgba(43,35,32,0.15)",
  borderRadius: 6,
  fontFamily: UI,
  fontSize: "0.82rem",
  color: C.charcoal,
  backgroundColor: "#fff",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.12s",
};

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        borderColor: focused ? C.gold : "rgba(43,35,32,0.15)",
      }}
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        resize: "vertical",
        lineHeight: 1.6,
        borderColor: focused ? C.gold : "rgba(43,35,32,0.15)",
      }}
    />
  );
}

function SaveButton({ label: lbl = "Save Changes" }: { label?: string }) {
  const [saved, setSaved] = useState(false);
  const handle = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };
  return (
    <button
      onClick={handle}
      style={{
        backgroundColor: saved ? C.teal : C.gold,
        color: saved ? "#fff" : C.charcoal,
        border: "none",
        borderRadius: 6,
        padding: "0.55rem 1.5rem",
        fontFamily: UI,
        fontSize: "0.8rem",
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition: "background-color 0.18s, color 0.18s",
      }}
    >
      {saved ? "Saved ✓" : lbl}
    </button>
  );
}

// ── Dropzone ─────────────────────────────────────────────────────────────────

function Dropzone({
  label: lbl,
  hint,
  wide,
}: {
  label: string;
  hint: string;
  wide?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f.name);
  }, []);

  return (
    <div>
      <FieldLabel>{lbl}</FieldLabel>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? C.gold : "rgba(43,35,32,0.18)"}`,
          borderRadius: 8,
          backgroundColor: dragging
            ? "rgba(212,169,78,0.05)"
            : "rgba(43,35,32,0.02)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.35rem",
          height: wide ? 100 : 80,
          cursor: "pointer",
          transition: "border-color 0.14s, background-color 0.14s",
        }}
      >
        {file ? (
          <span
            style={{
              fontSize: "0.75rem",
              color: C.teal,
              fontFamily: UI,
              fontWeight: 500,
            }}
          >
            {file}
          </span>
        ) : (
          <>
            <span style={{ fontSize: "1.2rem", opacity: 0.35 }}>↑</span>
            <span
              style={{
                fontSize: "0.72rem",
                color: "rgba(43,35,32,0.5)",
                fontFamily: UI,
              }}
            >
              Drop image or{" "}
              <span style={{ color: C.maroon, fontWeight: 500 }}>
                click to browse
              </span>
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                color: "rgba(43,35,32,0.35)",
                fontFamily: UI,
              }}
            >
              {hint}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 100,
        backgroundColor: checked ? C.teal : "rgba(43,35,32,0.18)",
        border: "none",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        transition: "background-color 0.15s",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: "#fff",
          transition: "left 0.15s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

// ── Store Profile tab ─────────────────────────────────────────────────────────

function TabStoreProfile() {
  const [name, setName] = useState("Fila Tó Wúyì");
  const [tagline, setTagline] = useState(
    "One Brand. Endless Style. Timeless Elegance."
  );
  const [bio, setBio] = useState(
    "Fila Tó Wúyì is a premium African fashion house specialising in handcrafted Aso-Oke, Adire, and embroidered headwear — rooted in Yoruba craftsmanship and dressed for the global stage."
  );
  const [email, setEmail] = useState("hello@filatowuyi.com");
  const [phone, setPhone] = useState("+234 801 234 5678");
  const [address, setAddress] = useState("12 Bode Thomas Street, Surulere, Lagos, Nigeria");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Image uploads */}
      <SectionCard>
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: C.charcoal,
            marginBottom: "1.25rem",
          }}
        >
          Brand Images
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "160px 1fr",
            gap: "1.25rem",
          }}
        >
          <Dropzone
            label="Store Logo"
            hint="PNG / SVG · 512×512px"
            wide={false}
          />
          <Dropzone
            label="Banner Image"
            hint="JPG / PNG · 1440×480px recommended"
            wide
          />
        </div>
      </SectionCard>

      {/* Store identity */}
      <SectionCard>
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: C.charcoal,
            marginBottom: "1.25rem",
          }}
        >
          Store Identity
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <FieldLabel>Store Name</FieldLabel>
              <Input value={name} onChange={setName} />
            </div>
            <div>
              <FieldLabel>Tagline</FieldLabel>
              <Input value={tagline} onChange={setTagline} />
            </div>
          </div>
          <div>
            <FieldLabel>Bio / Description</FieldLabel>
            <Textarea value={bio} onChange={setBio} rows={4} />
          </div>
        </div>
      </SectionCard>

      {/* Contact */}
      <SectionCard>
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: C.charcoal,
            marginBottom: "1.25rem",
          }}
        >
          Contact Details
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <FieldLabel>Contact Email</FieldLabel>
              <Input value={email} onChange={setEmail} type="email" />
            </div>
            <div>
              <FieldLabel>Phone Number</FieldLabel>
              <Input value={phone} onChange={setPhone} type="tel" />
            </div>
          </div>
          <div>
            <FieldLabel>Business Address</FieldLabel>
            <Input value={address} onChange={setAddress} />
          </div>
        </div>
      </SectionCard>

      <div>
        <SaveButton />
      </div>
    </div>
  );
}

// ── Homepage Content tab ──────────────────────────────────────────────────────

function TabHomepageContent() {
  const [eyebrow, setEyebrow] = useState("New Collection · Summer 2026");
  const [headline, setHeadline] = useState(
    "Where African Heritage\nMeets Global Style"
  );
  const [promo, setPromo] = useState(
    "Free shipping on orders over £150 · Use code FILAWELCOME for 10% off your first order"
  );
  const [story, setStory] = useState(
    "Born from a love of Yoruba craftsmanship, Fila Tó Wúyì brings centuries-old weaving and embroidery traditions to discerning wardrobes worldwide. Every piece is handmade by master artisans in Lagos."
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.25rem" }} className="settings-homepage-grid">
      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <SectionCard>
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: C.charcoal,
              marginBottom: "1.25rem",
            }}
          >
            Hero Section
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <FieldLabel>Eyebrow Text</FieldLabel>
              <Input
                value={eyebrow}
                onChange={setEyebrow}
                placeholder="e.g. New Arrivals · Summer 2026"
              />
            </div>
            <div>
              <FieldLabel>Hero Headline</FieldLabel>
              <Textarea
                value={headline}
                onChange={setHeadline}
                rows={3}
                placeholder="Main hero headline"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: C.charcoal,
              marginBottom: "1.25rem",
            }}
          >
            Promo Strip
          </div>
          <div>
            <FieldLabel>Promo Strip Message</FieldLabel>
            <Input
              value={promo}
              onChange={setPromo}
              placeholder="Scrolling promo bar text"
            />
          </div>
        </SectionCard>

        <SectionCard>
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: C.charcoal,
              marginBottom: "1.25rem",
            }}
          >
            Our Story Section
          </div>
          <div>
            <FieldLabel>Story Text</FieldLabel>
            <Textarea
              value={story}
              onChange={setStory}
              rows={5}
              placeholder="The brand story shown on the homepage..."
            />
          </div>
        </SectionCard>

        <div>
          <SaveButton />
        </div>
      </div>

      {/* Live preview */}
      <div style={{ position: "sticky", top: "1.25rem", alignSelf: "start" }}>
        <div
          style={{
            ...label,
            color: "rgba(43,35,32,0.4)",
            marginBottom: "0.5rem",
          }}
        >
          Hero Preview
        </div>
        <div
          style={{
            ...CARD,
            overflow: "hidden",
            borderRadius: 10,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${C.maroon} 0%, #4A1820 100%)`,
              padding: "1.75rem 1.25rem 1.5rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative texture */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, rgba(212,169,78,0.15) 0%, transparent 60%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                fontFamily: UI,
                fontSize: "0.6rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: "0.5rem",
                opacity: eyebrow ? 1 : 0.3,
              }}
            >
              {eyebrow || "Eyebrow text…"}
            </div>
            <div
              style={{
                fontFamily: DISPLAY,
                fontSize: "1.3rem",
                fontWeight: 500,
                color: C.cream,
                lineHeight: 1.25,
                whiteSpace: "pre-line",
                marginBottom: "0.875rem",
                opacity: headline ? 1 : 0.3,
              }}
            >
              {headline || "Hero headline…"}
            </div>
            <div
              style={{
                display: "inline-block",
                backgroundColor: C.gold,
                color: C.charcoal,
                padding: "0.35rem 0.9rem",
                borderRadius: 4,
                fontSize: "0.65rem",
                fontWeight: 600,
                fontFamily: UI,
                letterSpacing: "0.04em",
              }}
            >
              Shop Now
            </div>
          </div>

          {/* Promo strip preview */}
          <div
            style={{
              backgroundColor: C.charcoal,
              padding: "0.45rem 1rem",
              fontSize: "0.6rem",
              color: "rgba(250,246,240,0.75)",
              fontFamily: UI,
              letterSpacing: "0.04em",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              opacity: promo ? 1 : 0.4,
            }}
          >
            {promo || "Promo strip message…"}
          </div>

          {/* Story preview */}
          <div style={{ padding: "1rem 1.25rem" }}>
            <div
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(43,35,32,0.4)",
                fontFamily: UI,
                marginBottom: "0.4rem",
              }}
            >
              Our Story
            </div>
            <p
              style={{
                fontSize: "0.72rem",
                color: "rgba(43,35,32,0.7)",
                lineHeight: 1.55,
                fontFamily: UI,
                margin: 0,
                opacity: story ? 1 : 0.3,
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {story || "Your story text will appear here…"}
            </p>
          </div>
        </div>
        <div
          style={{
            fontSize: "0.65rem",
            color: "rgba(43,35,32,0.35)",
            fontFamily: UI,
            marginTop: "0.5rem",
            textAlign: "center",
          }}
        >
          Updates as you type
        </div>
      </div>
    </div>
  );
}

// ── Shipping & Delivery tab ───────────────────────────────────────────────────

type Region = {
  id: number;
  name: string;
  standard: string;
  express: string;
  costGBP: string;
  costNGN: string;
};

const DEFAULT_REGIONS: Region[] = [
  { id: 1, name: "United Kingdom", standard: "3–5 business days", express: "Next day", costGBP: "£6.99", costNGN: "" },
  { id: 2, name: "Canada", standard: "7–10 business days", express: "3–5 days", costGBP: "£12.00", costNGN: "" },
  { id: 3, name: "United States", standard: "7–10 business days", express: "3–5 days", costGBP: "£10.00", costNGN: "" },
  { id: 4, name: "Nigeria", standard: "2–4 business days", express: "Same day (Lagos)", costGBP: "£0", costNGN: "₦2,500" },
  { id: 5, name: "Other / Rest of World", standard: "10–21 business days", express: "", costGBP: "£18.00", costNGN: "" },
];

function TabShipping() {
  const [regions, setRegions] = useState<Region[]>(DEFAULT_REGIONS);
  const [nextId, setNextId] = useState(6);

  const update = (id: number, field: keyof Region, val: string) => {
    setRegions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const addRegion = () => {
    setRegions((prev) => [
      ...prev,
      { id: nextId, name: "", standard: "", express: "", costGBP: "", costNGN: "" },
    ]);
    setNextId((n) => n + 1);
  };

  const remove = (id: number) =>
    setRegions((prev) => prev.filter((r) => r.id !== id));

  const colHead = (t: string) => (
    <th
      style={{
        ...label,
        color: "rgba(43,35,32,0.38)",
        textAlign: "left",
        padding: "0.5rem 0.75rem",
        fontWeight: 500,
        borderBottom: "1px solid rgba(43,35,32,0.07)",
      }}
    >
      {t}
    </th>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div
        style={{
          ...CARD,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1rem 1.25rem 0.875rem",
            borderBottom: "1px solid rgba(43,35,32,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: C.charcoal,
              fontFamily: UI,
            }}
          >
            Shipping Regions
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {colHead("Region")}
                {colHead("Standard Delivery")}
                {colHead("Express Delivery")}
                {colHead("Cost (GBP)")}
                {colHead("Cost (NGN)")}
                <th style={{ width: 32 }} />
              </tr>
            </thead>
            <tbody>
              {regions.map((r, i) => (
                <tr
                  key={r.id}
                  style={{
                    backgroundColor:
                      i % 2 === 0 ? "transparent" : "rgba(43,35,32,0.018)",
                  }}
                >
                  {(
                    [
                      ["name", r.name, "Region name"],
                      ["standard", r.standard, "e.g. 3–5 days"],
                      ["express", r.express, "Optional"],
                      ["costGBP", r.costGBP, "£0.00"],
                      ["costNGN", r.costNGN, "₦0"],
                    ] as [keyof Region, string, string][]
                  ).map(([field, val, ph]) => (
                    <td key={field} style={{ padding: "0.5rem 0.75rem" }}>
                      <input
                        value={val}
                        onChange={(e) => update(r.id, field, e.target.value)}
                        placeholder={ph}
                        style={{
                          ...inputStyle,
                          fontSize: "0.77rem",
                          padding: "0.4rem 0.6rem",
                          minWidth: field === "name" ? 160 : 100,
                        }}
                      />
                    </td>
                  ))}
                  <td style={{ padding: "0.5rem 0.5rem" }}>
                    <button
                      onClick={() => remove(r.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "rgba(43,35,32,0.3)",
                        fontSize: "1rem",
                        lineHeight: 1,
                        padding: "2px 4px",
                      }}
                      aria-label="Remove region"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "1rem 1.25rem" }}>
          <button
            onClick={addRegion}
            style={{
              background: "none",
              border: `1px dashed rgba(43,35,32,0.22)`,
              borderRadius: 6,
              padding: "0.45rem 1rem",
              fontFamily: UI,
              fontSize: "0.78rem",
              color: "rgba(43,35,32,0.55)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>+</span> Add Region
          </button>
        </div>
      </div>

      <div>
        <SaveButton />
      </div>
    </div>
  );
}

// ── Payments & Payout tab ─────────────────────────────────────────────────────

function ConnectedBadge() {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 9px",
        borderRadius: 100,
        fontSize: "0.68rem",
        fontWeight: 500,
        backgroundColor: "rgba(59,138,147,0.12)",
        color: C.teal,
        fontFamily: UI,
        whiteSpace: "nowrap",
      }}
    >
      Connected
    </span>
  );
}

function TabPayments() {
  const [editingBank, setEditingBank] = useState(false);
  const [bankName, setBankName] = useState("First Bank of Nigeria");
  const [acctNum, setAcctNum] = useState("••••••••7823");
  const [acctName, setAcctName] = useState("Adunola Okonkwo");
  const [schedule, setSchedule] = useState("weekly");

  const providers = [
    {
      name: "Paystack",
      logo: "P",
      logoColor: "#00C3F7",
      desc: "NGN payments · Cards, bank transfer, USSD",
    },
    {
      name: "Flutterwave",
      logo: "F",
      logoColor: "#F5A623",
      desc: "Multi-currency · Cards, mobile money, bank",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Providers */}
      <SectionCard>
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: C.charcoal,
            marginBottom: "1.25rem",
          }}
        >
          Payment Providers
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {providers.map((p) => (
            <div
              key={p.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.875rem 1rem",
                border: "1px solid rgba(43,35,32,0.08)",
                borderRadius: 8,
                backgroundColor: "rgba(43,35,32,0.015)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: p.logoColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                  fontFamily: UI,
                }}
              >
                {p.logo}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: C.charcoal,
                    fontFamily: UI,
                    marginBottom: "2px",
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(43,35,32,0.48)",
                    fontFamily: UI,
                  }}
                >
                  {p.desc}
                </div>
              </div>
              <ConnectedBadge />
              <button
                style={{
                  background: "none",
                  border: "1px solid rgba(43,35,32,0.15)",
                  borderRadius: 5,
                  padding: "0.35rem 0.8rem",
                  fontSize: "0.73rem",
                  color: C.charcoal,
                  cursor: "pointer",
                  fontFamily: UI,
                  fontWeight: 500,
                }}
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Bank details */}
      <SectionCard>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: C.charcoal,
            }}
          >
            Payout Bank Account
          </div>
          <button
            onClick={() => setEditingBank(!editingBank)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.73rem",
              color: C.maroon,
              fontFamily: UI,
              fontWeight: 500,
              padding: 0,
            }}
          >
            {editingBank ? "Cancel" : "Edit"}
          </button>
        </div>

        {editingBank ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.875rem",
              }}
            >
              <div>
                <FieldLabel>Bank Name</FieldLabel>
                <Input value={bankName} onChange={setBankName} />
              </div>
              <div>
                <FieldLabel>Account Number</FieldLabel>
                <Input value={acctNum} onChange={setAcctNum} />
              </div>
            </div>
            <div>
              <FieldLabel>Account Name</FieldLabel>
              <Input value={acctName} onChange={setAcctName} />
            </div>
            <div>
              <button
                onClick={() => setEditingBank(false)}
                style={{
                  backgroundColor: C.gold,
                  color: C.charcoal,
                  border: "none",
                  borderRadius: 6,
                  padding: "0.5rem 1.25rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: UI,
                }}
              >
                Save Bank Details
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
            }}
          >
            {[
              ["Bank", bankName],
              ["Account Number", acctNum],
              ["Account Name", acctName],
            ].map(([lbl, val]) => (
              <div key={lbl}>
                <div
                  style={{
                    ...label,
                    color: "rgba(43,35,32,0.4)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {lbl}
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: C.charcoal,
                    fontFamily: UI,
                    fontWeight: 500,
                  }}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Payout schedule */}
      <SectionCard>
        <div
          style={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: C.charcoal,
            marginBottom: "1.25rem",
          }}
        >
          Payout Schedule
        </div>
        <div style={{ maxWidth: 280 }}>
          <FieldLabel>Release Frequency</FieldLabel>
          <select
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            style={{
              ...inputStyle,
              cursor: "pointer",
              appearance: "none",
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(43,35,32,0.4)'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              paddingRight: "2rem",
            }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly (every Monday)</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly (1st of month)</option>
          </select>
        </div>
      </SectionCard>
    </div>
  );
}

// ── Policies tab ──────────────────────────────────────────────────────────────

const POLICY_DEFAULTS: Record<string, string> = {
  "Returns Policy":
    "We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in original packaging. Custom-made garments are non-returnable unless faulty. To initiate a return, contact hello@filatowuyi.com with your order number.",
  "Shipping Policy":
    "All orders are dispatched from Lagos, Nigeria within 2 business days. International orders are shipped via DHL or FedEx. Estimated delivery times vary by region — see our Shipping & Delivery table for details. We are not responsible for customs duties or import taxes.",
  "Terms of Service":
    "By placing an order with Fila Tó Wúyì you agree to these terms. All prices are displayed in GBP (£). Payment is processed securely via Paystack or Flutterwave. We reserve the right to cancel any order at our discretion with a full refund.",
  "Privacy Policy":
    "We collect your name, email, shipping address, and payment details solely to fulfil your orders. We do not sell your data to third parties. Your data is stored securely and you may request deletion at any time by emailing privacy@filatowuyi.com.",
};

function TabPolicies() {
  const [policies, setPolicies] = useState({ ...POLICY_DEFAULTS });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {Object.keys(policies).map((key) => (
        <SectionCard key={key}>
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: C.charcoal,
              marginBottom: "0.875rem",
            }}
          >
            {key}
          </div>
          <Textarea
            value={policies[key]}
            onChange={(v) => setPolicies((p) => ({ ...p, [key]: v }))}
            rows={6}
          />
        </SectionCard>
      ))}
      <div>
        <SaveButton />
      </div>
    </div>
  );
}

// ── Notifications tab ─────────────────────────────────────────────────────────

type NotifRow = {
  label: string;
  desc: string;
  email: boolean;
  push: boolean;
};

const NOTIF_DEFAULTS: NotifRow[] = [
  { label: "New Order", desc: "When a customer places a new order", email: true, push: true },
  {
    label: "New Custom Order Request",
    desc: "When a customer submits a custom order enquiry",
    email: true,
    push: true,
  },
  { label: "New Review", desc: "When a customer leaves a product review", email: true, push: false },
  { label: "New Message", desc: "When a customer sends you a message", email: true, push: true },
  {
    label: "Low Stock Alert",
    desc: "When a product variant drops below 5 units",
    email: true,
    push: false,
  },
];

function TabNotifications() {
  const [rows, setRows] = useState<NotifRow[]>(NOTIF_DEFAULTS);

  const toggle = (i: number, field: "email" | "push") => {
    setRows((prev) =>
      prev.map((r, idx) =>
        idx === i ? { ...r, [field]: !r[field] } : r
      )
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div
        style={{
          ...CARD,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1rem 1.5rem 0.75rem",
            borderBottom: "1px solid rgba(43,35,32,0.06)",
          }}
        >
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: C.charcoal,
              fontFamily: UI,
            }}
          >
            Owner Notification Preferences
          </div>
          <div
            style={{
              fontSize: "0.7rem",
              color: "rgba(43,35,32,0.45)",
              fontFamily: UI,
              marginTop: "3px",
            }}
          >
            Choose which events trigger notifications and by which channel.
          </div>
        </div>

        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 90px 90px",
            padding: "0.5rem 1.5rem",
            borderBottom: "1px solid rgba(43,35,32,0.06)",
          }}
        >
          <span />
          {["Email", "Push"].map((ch) => (
            <span
              key={ch}
              style={{
                ...label,
                color: "rgba(43,35,32,0.38)",
                textAlign: "center",
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {rows.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 90px 90px",
              alignItems: "center",
              padding: "0.875rem 1.5rem",
              borderBottom:
                i < rows.length - 1
                  ? "1px solid rgba(43,35,32,0.05)"
                  : "none",
              backgroundColor:
                i % 2 === 0 ? "transparent" : "rgba(43,35,32,0.018)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: C.charcoal,
                  fontFamily: UI,
                  marginBottom: "2px",
                }}
              >
                {r.label}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "rgba(43,35,32,0.45)",
                  fontFamily: UI,
                }}
              >
                {r.desc}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Toggle checked={r.email} onChange={() => toggle(i, "email")} />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Toggle checked={r.push} onChange={() => toggle(i, "push")} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sub-nav tabs ──────────────────────────────────────────────────────────────

const TABS = [
  "Store Profile",
  "Homepage Content",
  "Shipping & Delivery",
  "Payments & Payout",
  "Policies",
  "Notifications",
] as const;

type Tab = (typeof TABS)[number];

// ── Page root ─────────────────────────────────────────────────────────────────

export default function ConsoleSettings() {
  const [activeTab, setActiveTab] = useState<Tab>("Store Profile");

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: UI }}>
      {/* Left sub-nav */}
      <nav
        aria-label="Settings sections"
        style={{
          width: 192,
          flexShrink: 0,
          borderRight: "1px solid rgba(43,35,32,0.08)",
          backgroundColor: "rgba(43,35,32,0.025)",
          paddingTop: "1.25rem",
          paddingBottom: "1.25rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {TABS.map((tab) => {
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${active ? C.gold : "transparent"}`,
                textAlign: "left",
                padding: "0.6rem 1.25rem",
                fontFamily: UI,
                fontSize: "0.72rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontWeight: active ? 600 : 400,
                color: active ? C.charcoal : "rgba(43,35,32,0.5)",
                cursor: "pointer",
                transition: "color 0.12s, border-color 0.12s",
                lineHeight: 1.4,
              }}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      {/* Content pane */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.75rem",
          minWidth: 0,
        }}
      >
        {activeTab === "Store Profile" && <TabStoreProfile />}
        {activeTab === "Homepage Content" && <TabHomepageContent />}
        {activeTab === "Shipping & Delivery" && <TabShipping />}
        {activeTab === "Payments & Payout" && <TabPayments />}
        {activeTab === "Policies" && <TabPolicies />}
        {activeTab === "Notifications" && <TabNotifications />}
      </div>
    </div>
  );
}
