'use client';

import { useState } from "react";
import { Link, useParams } from '@/lib/router';
import { C, UI } from "../../tokens";

// ── Icons ─────────────────────────────────────────────────────────────────────

function UploadIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function PlusSmallIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function XIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function DragIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <circle cx="9" cy="6" r="1.1" fill="currentColor" />
      <circle cx="15" cy="6" r="1.1" fill="currentColor" />
      <circle cx="9" cy="12" r="1.1" fill="currentColor" />
      <circle cx="15" cy="12" r="1.1" fill="currentColor" />
      <circle cx="9" cy="18" r="1.1" fill="currentColor" />
      <circle cx="15" cy="18" r="1.1" fill="currentColor" />
    </svg>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FormCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: 8,
      border: "1px solid rgba(43,35,32,0.07)",
      padding: "1.25rem",
    }}>
      {title && (
        <h2 style={{
          fontFamily: UI,
          fontSize: "0.82rem",
          fontWeight: 600,
          color: C.charcoal,
          margin: "0 0 1rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid rgba(43,35,32,0.06)",
          letterSpacing: "-0.01em",
        }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: "block",
      fontSize: "0.7rem",
      fontWeight: 500,
      color: "rgba(43,35,32,0.55)",
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      marginBottom: "0.375rem",
      fontFamily: UI,
    }}>
      {children}
    </label>
  );
}

// ── Variant row ───────────────────────────────────────────────────────────────

type Variant = { id: string; size: string; color: string; stock: string };

function VariantRow({ v, onChange, onRemove }: {
  v: Variant;
  onChange: (next: Variant) => void;
  onRemove: () => void;
}) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
      <span style={{ color: "rgba(43,35,32,0.25)", cursor: "grab", lineHeight: 0 }}><DragIcon /></span>
      <input
        placeholder="Size"
        value={v.size}
        onChange={e => onChange({ ...v, size: e.target.value })}
        style={{ ...inputBase, flex: "0 0 80px" }}
      />
      <input
        placeholder="Colour"
        value={v.color}
        onChange={e => onChange({ ...v, color: e.target.value })}
        style={{ ...inputBase, flex: 1 }}
      />
      <input
        placeholder="Stock"
        type="number"
        min="0"
        value={v.stock}
        onChange={e => onChange({ ...v, stock: e.target.value })}
        style={{ ...inputBase, flex: "0 0 72px" }}
      />
      <button
        onClick={onRemove}
        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(43,35,32,0.35)", lineHeight: 0, padding: 2 }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.maroon}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.35)"}
      >
        <XIcon size={12} />
      </button>
    </div>
  );
}

// ── Image slot ────────────────────────────────────────────────────────────────

type MockImage = { id: string; label: string; color: string };

function ImageSlot({ img, isMain, onRemove }: { img: MockImage; isMain: boolean; onRemove: () => void }) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{
        width: "100%",
        aspectRatio: "1",
        borderRadius: 7,
        backgroundColor: img.color,
        opacity: 0.82,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <span style={{ color: "#fff", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.05em" }}>{img.label}</span>
      </div>
      {isMain && (
        <span style={{
          position: "absolute", top: 4, left: 4,
          backgroundColor: C.gold, color: C.charcoal,
          fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.06em",
          padding: "2px 6px", borderRadius: 3, textTransform: "uppercase",
        }}>Main</span>
      )}
      <button
        onClick={onRemove}
        style={{
          position: "absolute", top: 4, right: 4,
          width: 20, height: 20, borderRadius: "50%",
          backgroundColor: "rgba(43,35,32,0.55)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", lineHeight: 0,
        }}
      >
        <XIcon size={9} />
      </button>
    </div>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = ["Filà", "Gele", "Ipele", "Kaftan", "Trousers", "Roundneck Shirts", "Shoes", "Pam Slippers", "Accessories"];
const TAGS = ["New Arrival", "Made to Order", "Limited Edition", "Bestseller", "Sale"];
const SLOT_COLORS = [C.teal, "#2E4A9E", "rgba(43,35,32,0.55)", C.maroon, C.gold];
const SLOT_LABELS = ["IMG1", "IMG2", "IMG3", "IMG4", "IMG5"];

// ── Shared input style ────────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  fontFamily: UI,
  fontSize: "0.82rem",
  color: "#2B2320",
  backgroundColor: "#fff",
  border: "1px solid rgba(43,35,32,0.14)",
  borderRadius: 6,
  padding: "0.5rem 0.75rem",
  outline: "none",
  boxSizing: "border-box",
  lineHeight: 1.4,
  display: "block",
};

// ── Main export ───────────────────────────────────────────────────────────────

export default function ConsoleProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id && id !== "new");
  const pageTitle = isEdit ? "Edit Product" : "Add New Product";

  const [name, setName] = useState(isEdit ? "Yoruba Filà (Custom)" : "");
  const [description, setDescription] = useState(isEdit ? "Handcrafted Yoruba Filà made to order in your choice of colour and embroidery pattern. Each cap takes 5–7 working days to complete." : "");
  const [category, setCategory] = useState(isEdit ? "Filà" : "");
  const [priceCad, setPriceCad] = useState(isEdit ? "285" : "");
  const [productionDays, setProductionDays] = useState(isEdit ? "5–7" : "");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(isEdit ? new Set(["Made to Order"]) : new Set());
  const [publishStatus, setPublishStatus] = useState<"published" | "draft">(isEdit ? "published" : "draft");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");

  const [variants, setVariants] = useState<Variant[]>(
    isEdit
      ? [
          { id: "v1", size: "S", color: "Burgundy", stock: "4" },
          { id: "v2", size: "M", color: "Burgundy", stock: "6" },
          { id: "v3", size: "L", color: "Navy", stock: "2" },
        ]
      : [{ id: "v1", size: "", color: "", stock: "" }]
  );

  const [images, setImages] = useState<MockImage[]>(
    isEdit
      ? [
          { id: "i1", label: "FRONT", color: C.maroon },
          { id: "i2", label: "SIDE", color: C.gold },
          { id: "i3", label: "DETAIL", color: "#2E4A9E" },
        ]
      : []
  );

  function addVariant() {
    setVariants(vs => [...vs, { id: `v${Date.now()}`, size: "", color: "", stock: "" }]);
  }
  function removeVariant(vid: string) {
    setVariants(vs => vs.filter(v => v.id !== vid));
  }
  function updateVariant(vid: string, next: Variant) {
    setVariants(vs => vs.map(v => v.id === vid ? next : v));
  }
  function addMockImage() {
    const idx = images.length % 5;
    setImages(imgs => [...imgs, { id: `i${Date.now()}`, label: SLOT_LABELS[idx], color: SLOT_COLORS[idx] }]);
  }
  function removeImage(iid: string) {
    setImages(imgs => imgs.filter(i => i.id !== iid));
  }
  function toggleTag(tag: string) {
    const next = new Set(selectedTags);
    if (next.has(tag)) next.delete(tag); else next.add(tag);
    setSelectedTags(next);
  }

  return (
    <div className="console-page" style={{ padding: "1.75rem", fontFamily: UI, minHeight: "100%" }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.25rem" }}>
        <Link
          to="/console/products"
          style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.45)", textDecorationLine: "none" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.charcoal}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.45)"}
        >
          Products
        </Link>
        <span style={{ color: "rgba(43,35,32,0.28)", fontSize: "0.75rem" }}>/</span>
        <span style={{ fontSize: "0.78rem", color: C.charcoal, fontWeight: 500 }}>{pageTitle}</span>
      </div>

      <h1 style={{ fontSize: "1.35rem", fontWeight: 600, color: C.charcoal, letterSpacing: "-0.02em", margin: "0 0 1.5rem" }}>
        {pageTitle}
      </h1>

      {/* Two-column layout */}
      <div className="rg-split" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.25rem", alignItems: "start" }}>

        {/* ── LEFT ─────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Product details */}
          <FormCard title="Product Details">
            <FieldLabel>Product Name</FieldLabel>
            <input
              type="text"
              placeholder="e.g. Aso-Oke Gele Set"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ ...inputBase, width: "100%", marginBottom: "1rem" }}
            />

            <FieldLabel>Description</FieldLabel>
            <textarea
              placeholder="Describe your product — materials, craftsmanship, care instructions..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={5}
              style={{ ...inputBase, width: "100%", resize: "vertical", lineHeight: 1.6, marginBottom: "1rem" }}
            />

            <FieldLabel>Category</FieldLabel>
            <div style={{ position: "relative", width: "100%", marginBottom: "1rem" }}>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ ...inputBase, width: "100%", appearance: "none", paddingRight: "2rem", cursor: "pointer" }}
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span style={{ position: "absolute", right: "0.625rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(43,35,32,0.4)", lineHeight: 0 }}>
                <ChevronDownIcon />
              </span>
            </div>

            <FieldLabel>Production Time (working days)</FieldLabel>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <input
                type="text"
                placeholder="e.g. 5–7"
                value={productionDays}
                onChange={e => setProductionDays(e.target.value)}
                style={{ ...inputBase, width: 120 }}
              />
              <span style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.45)" }}>
                Shown to buyers before checkout
              </span>
            </div>
          </FormCard>

          {/* Pricing */}
          <FormCard title="Pricing">
            <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <FieldLabel>Price (CAD)</FieldLabel>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.82rem", color: "rgba(43,35,32,0.4)", fontWeight: 600 }}>CAD $</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={priceCad}
                    onChange={e => setPriceCad(e.target.value)}
                    style={{ ...inputBase, paddingLeft: "1.6rem", width: "100%" }}
                  />
                </div>
              </div>
            </div>
          </FormCard>

          {/* Variants */}
          <FormCard title="Variants">
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", paddingLeft: "22px" }}>
              {[["80px", "Size"], ["1", "Colour"], ["72px", "Stock"]].map(([w, h]) => (
                <span key={h} style={{ flex: w === "1" ? 1 : `0 0 ${w}`, fontSize: "0.63rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500 }}>
                  {h}
                </span>
              ))}
            </div>
            {variants.map(v => (
              <VariantRow
                key={v.id}
                v={v}
                onChange={next => updateVariant(v.id, next)}
                onRemove={() => removeVariant(v.id)}
              />
            ))}
            <button
              onClick={addVariant}
              style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                marginTop: "0.375rem",
                background: "none",
                border: "1px dashed rgba(43,35,32,0.2)",
                borderRadius: 6,
                padding: "0.4rem 0.875rem",
                fontSize: "0.75rem", color: "rgba(43,35,32,0.5)",
                cursor: "pointer", fontFamily: UI,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.gold; (e.currentTarget as HTMLElement).style.color = C.charcoal; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(43,35,32,0.2)"; (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.5)"; }}
            >
              <PlusSmallIcon /> Add Variant
            </button>
          </FormCard>

          {/* SEO accordion */}
          <div style={{ backgroundColor: "#fff", borderRadius: 8, border: "1px solid rgba(43,35,32,0.07)", overflow: "hidden" }}>
            <button
              onClick={() => setAdvancedOpen(o => !o)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.875rem 1.25rem", background: "none", border: "none", cursor: "pointer",
                fontFamily: UI, fontSize: "0.82rem", fontWeight: 600, color: C.charcoal,
              }}
            >
              <span>Advanced — SEO</span>
              <span style={{ lineHeight: 0, transition: "transform 0.2s", transform: advancedOpen ? "rotate(180deg)" : "none" }}>
                <ChevronDownIcon />
              </span>
            </button>
            {advancedOpen && (
              <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "1px solid rgba(43,35,32,0.06)" }}>
                <div style={{ height: "0.875rem" }} />
                <FieldLabel>Meta Title</FieldLabel>
                <input
                  type="text"
                  placeholder="Page title shown in search results (60 chars max)"
                  maxLength={60}
                  value={metaTitle}
                  onChange={e => setMetaTitle(e.target.value)}
                  style={{ ...inputBase, width: "100%", marginBottom: "1rem" }}
                />
                <FieldLabel>Meta Description</FieldLabel>
                <textarea
                  placeholder="Short description for search engines (155 chars max)"
                  maxLength={155}
                  value={metaDesc}
                  onChange={e => setMetaDesc(e.target.value)}
                  rows={3}
                  style={{ ...inputBase, width: "100%", resize: "vertical", lineHeight: 1.6 }}
                />
                {metaDesc && (
                  <p style={{ fontSize: "0.63rem", color: "rgba(43,35,32,0.38)", marginTop: "4px", textAlign: "right" }}>
                    {metaDesc.length}/155
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT ────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "sticky", top: "1.5rem" }}>

          {/* Save actions */}
          <FormCard>
            <button style={{
              width: "100%", backgroundColor: C.gold, color: C.charcoal, border: "none",
              borderRadius: 7, padding: "0.625rem 1rem", fontSize: "0.82rem", fontWeight: 700,
              cursor: "pointer", fontFamily: UI, letterSpacing: "0.01em", marginBottom: "0.5rem",
            }}>
              {isEdit ? "Save Changes" : "Save Product"}
            </button>
            <button style={{
              width: "100%", backgroundColor: "transparent", color: C.charcoal,
              border: "1px solid rgba(43,35,32,0.18)", borderRadius: 7, padding: "0.575rem 1rem",
              fontSize: "0.82rem", fontWeight: 500, cursor: "pointer", fontFamily: UI, letterSpacing: "0.01em",
            }}>
              Save as Draft
            </button>
          </FormCard>

          {/* Status toggle */}
          <FormCard title="Status">
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["published", "draft"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setPublishStatus(s)}
                  style={{
                    flex: 1, padding: "0.45rem 0", borderRadius: 6,
                    border: publishStatus === s ? "none" : "1px solid rgba(43,35,32,0.14)",
                    backgroundColor: publishStatus === s
                      ? (s === "published" ? C.teal : "rgba(43,35,32,0.08)")
                      : "transparent",
                    color: publishStatus === s
                      ? (s === "published" ? "#fff" : C.charcoal)
                      : "rgba(43,35,32,0.45)",
                    fontSize: "0.75rem",
                    fontWeight: publishStatus === s ? 600 : 400,
                    cursor: "pointer", fontFamily: UI, letterSpacing: "0.01em",
                  }}
                >
                  {s === "published" ? "Published" : "Draft"}
                </button>
              ))}
            </div>
          </FormCard>

          {/* Images */}
          <FormCard title="Images">
            <div className="rg-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {images.map((img, i) => (
                <ImageSlot key={img.id} img={img} isMain={i === 0} onRemove={() => removeImage(img.id)} />
              ))}
              <button
                onClick={addMockImage}
                style={{
                  aspectRatio: "1", borderRadius: 7,
                  border: "2px dashed rgba(43,35,32,0.16)",
                  backgroundColor: "rgba(43,35,32,0.02)",
                  cursor: "pointer", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: "6px",
                  color: "rgba(43,35,32,0.35)", minHeight: 80,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.gold; (e.currentTarget as HTMLElement).style.color = C.charcoal; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(43,35,32,0.16)"; (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.35)"; }}
              >
                <UploadIcon size={20} />
                <span style={{ fontSize: "0.62rem", fontFamily: UI }}>Add Image</span>
              </button>
            </div>
            <p style={{ fontSize: "0.63rem", color: "rgba(43,35,32,0.38)", lineHeight: 1.5 }}>
              First image is used as the main photo. Max 10 images, 8 MB each.
            </p>
          </FormCard>

          {/* Tags */}
          <FormCard title="Tags">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {TAGS.map(tag => (
                <label
                  key={tag}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.625rem",
                    cursor: "pointer", fontSize: "0.78rem",
                    color: selectedTags.has(tag) ? C.charcoal : "rgba(43,35,32,0.6)",
                    fontWeight: selectedTags.has(tag) ? 500 : 400,
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.has(tag)}
                    onChange={() => toggleTag(tag)}
                    style={{ accentColor: C.maroon, cursor: "pointer", width: 14, height: 14 }}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </FormCard>

          {/* Back link */}
          <Link
            to="/console/products"
            style={{ display: "block", textAlign: "center", fontSize: "0.72rem", color: "rgba(43,35,32,0.38)", textDecorationLine: "none", padding: "0.25rem" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.charcoal}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.38)"}
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
