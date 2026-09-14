'use client';

import { useState } from "react";
import { Link, useNavigate } from '@/lib/router';
import { saveProduct } from '@/server/product-actions';
import { PRODUCT_TAGS, TAG_LABELS } from '@/server/product-schema';
import type { CategoryOption, ProductForEdit } from '@/server/catalogue';
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
    <div className="rounded-lg p-5" style={{ backgroundColor: "#fff", border: "1px solid rgba(43,35,32,0.07)" }}>
      {title && (
        <h2
          className="mb-4 pb-3"
          style={{
            fontFamily: UI,
            fontSize: "0.82rem",
            fontWeight: 600,
            color: C.charcoal,
            borderBottom: "1px solid rgba(43,35,32,0.06)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block mb-1.5"
      style={{
        fontSize: "0.7rem",
        fontWeight: 500,
        color: "rgba(43,35,32,0.55)",
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        fontFamily: UI,
      }}
    >
      {children}
    </label>
  );
}

// ── Variant row ───────────────────────────────────────────────────────────────

/** A size, colour, and stock count. */
type Variant = { id: string; size: string; color: string; stock: string };

function VariantRow({ v, onChange, onRemove }: {
  v: Variant;
  onChange: (next: Variant) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="cursor-grab" style={{ color: "rgba(43,35,32,0.25)", lineHeight: 0 }}><DragIcon /></span>
      <input
        placeholder="Size"
        value={v.size}
        onChange={e => onChange({ ...v, size: e.target.value })}
        className={`${INPUT_CLS} w-[90px] shrink-0`}
        style={inputBase}
      />
      <input
        placeholder="Colour"
        list="known-colours"
        value={v.color}
        onChange={e => onChange({ ...v, color: e.target.value })}
        className={`${INPUT_CLS} w-[100px] shrink-0`}
        style={inputBase}
      />
      <input
        placeholder="Stock"
        type="number"
        min="0"
        value={v.stock}
        onChange={e => onChange({ ...v, stock: e.target.value })}
        className={`${INPUT_CLS} flex-1`}
        style={inputBase}
      />
      <button
        onClick={onRemove}
        className="p-[2px] cursor-pointer"
        style={{ background: "none", border: "none", color: "rgba(43,35,32,0.35)", lineHeight: 0 }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.maroon}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.35)"}
      >
        <XIcon size={12} />
      </button>
    </div>
  );
}

// ── Image slot ────────────────────────────────────────────────────────────────

type ImageEntry = { id: string; url: string; color: string };

function ImageSlot({ img, isMain, colors, onColorChange, onRemove }: {
  img: ImageEntry;
  isMain: boolean;
  /** The product's variant colours, for tying this photo to one. */
  colors: string[];
  onColorChange: (color: string) => void;
  onRemove: () => void;
}) {
  // A colour set on the image but no longer among the variants still needs an
  // option, or the select would fall blank and silently lose the tie.
  const options = img.color && !colors.includes(img.color) ? [...colors, img.color] : colors;

  return (
    <div className="relative">
      <img
        src={img.url}
        alt=""
        className="block w-full aspect-square rounded-[7px] object-cover"
        style={{ backgroundColor: "rgba(43,35,32,0.08)" }}
      />
      {isMain && (
        <span
          className="absolute top-1 left-1 py-[2px] px-[6px] rounded-[3px] uppercase"
          style={{
            backgroundColor: C.gold,
            color: C.charcoal,
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
          }}
        >
          Main
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove image"
        className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: "rgba(43,35,32,0.55)", border: "none", color: "#fff", lineHeight: 0 }}
      >
        <XIcon size={9} />
      </button>
      {/* Which colour this photo shows. "All colours" is a general image. */}
      <select
        value={img.color}
        onChange={e => onColorChange(e.target.value)}
        aria-label="Colour this image shows"
        className="block box-border w-full rounded-[5px] mt-1 pl-1.5 pr-4 py-1 cursor-pointer"
        style={{ fontFamily: UI, fontSize: "0.62rem", color: C.charcoal, backgroundColor: "#fff", border: "1px solid rgba(43,35,32,0.14)", outline: "none" }}
      >
        <option value="">All colours</option>
        {options.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}

// ── Shared input style ────────────────────────────────────────────────────────

/** Box/layout for every field control, as classes; colour and type stay in inputBase. */
const INPUT_CLS = "block box-border rounded-[6px] px-3 py-2";

const inputBase: React.CSSProperties = {
  fontFamily: UI,
  fontSize: "0.82rem",
  color: "#2B2320",
  backgroundColor: "#fff",
  border: "1px solid rgba(43,35,32,0.14)",
  outline: "none",
  lineHeight: 1.4,
};

// ── Main export ───────────────────────────────────────────────────────────────

export type ProductFormProps = {
  /** Absent when adding; the product being edited otherwise. */
  product: ProductForEdit | null;
  categories: CategoryOption[];
  knownColors: string[];
};

export default function ConsoleProductForm({ product, categories, knownColors }: ProductFormProps) {
  const navigate = useNavigate();
  const isEdit = product !== null;
  const pageTitle = isEdit ? "Edit Product" : "Add New Product";

  const [name, setName] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [priceCad, setPriceCad] = useState(product ? (product.priceCadCents / 100).toFixed(2) : "");
  const [productionDays, setProductionDays] = useState(product?.productionDays ?? "");
  const [tag, setTag] = useState<string>(product?.tag ?? "");
  const [publishStatus, setPublishStatus] = useState<"PUBLISHED" | "DRAFT">(product?.status ?? "DRAFT");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [metaTitle, setMetaTitle] = useState(product?.metaTitle ?? "");
  const [metaDesc, setMetaDesc] = useState(product?.metaDescription ?? "");

  const [variants, setVariants] = useState<Variant[]>(
    product && product.variants.length > 0
      ? product.variants.map((v, i) => ({ id: `v${i}`, size: v.size, color: v.color, stock: String(v.stock) }))
      : [{ id: "v0", size: "", color: "", stock: "" }]
  );

  const [images, setImages] = useState<ImageEntry[]>(
    (product?.images ?? []).map((img, i) => ({ id: `i${i}`, url: img.url, color: img.color }))
  );
  const [imageDraft, setImageDraft] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function addVariant() {
    setVariants(vs => [...vs, { id: `v${Date.now()}`, size: "", color: "", stock: "" }]);
  }
  function removeVariant(vid: string) {
    setVariants(vs => (vs.length > 1 ? vs.filter(v => v.id !== vid) : vs));
  }
  function updateVariant(vid: string, next: Variant) {
    setVariants(vs => vs.map(v => v.id === vid ? next : v));
  }

  function addImage() {
    const url = imageDraft.trim();
    if (!url) return;
    // New photos are general until the owner ties them to a colour.
    setImages(imgs => [...imgs, { id: `i${Date.now()}`, url, color: "" }]);
    setImageDraft("");
  }
  function removeImage(iid: string) {
    setImages(imgs => imgs.filter(i => i.id !== iid));
  }
  function setImageColor(iid: string, color: string) {
    setImages(imgs => imgs.map(i => (i.id === iid ? { ...i, color } : i)));
  }

  // The colours the images can be tied to — whatever the variants currently name.
  const variantColors = [...new Set(variants.map(v => v.color.trim()).filter(Boolean))];

  async function save(status: "PUBLISHED" | "DRAFT") {
    setSaving(true);
    setError("");
    setFieldErrors({});

    const result = await saveProduct({
      id: product?.id,
      title: name,
      description,
      categoryId,
      // Prices are typed in dollars and stored in cents; round once, here.
      priceCadCents: Math.round((Number(priceCad) || 0) * 100),
      productionDays,
      tag: tag === "" ? null : tag,
      status,
      metaTitle,
      metaDescription: metaDesc,
      images: images.map(i => ({ url: i.url, color: i.color })),
      variants: variants
        // A blank trailing row is how people leave a form, not an error.
        .filter(v => v.size.trim() !== "" || v.color.trim() !== "")
        .map(v => ({ size: v.size.trim(), color: v.color.trim(), stock: Number(v.stock) || 0 })),
    });

    if (!result.ok) {
      setSaving(false);
      setError(result.message);
      setFieldErrors(result.fieldErrors ?? {});
      return;
    }

    setPublishStatus(status);
    navigate('/console/products');
  }

  const firstError = (field: string) => fieldErrors[field]?.[0];

  return (
    <div className="console-page p-7 min-h-full" style={{ fontFamily: UI }}>

      {/* Breadcrumb */}
      <div className="flex items-center gap-[0.4rem] mb-5">
        <Link
          to="/console/products"
          className="no-underline"
          style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.45)" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = C.charcoal}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.45)"}
        >
          Products
        </Link>
        <span style={{ color: "rgba(43,35,32,0.28)", fontSize: "0.75rem" }}>/</span>
        <span style={{ fontSize: "0.78rem", color: C.charcoal, fontWeight: 500 }}>{pageTitle}</span>
      </div>

      <h1 className="mb-6" style={{ fontSize: "1.35rem", fontWeight: 600, color: C.charcoal, letterSpacing: "-0.02em" }}>
        {pageTitle}
      </h1>

      {/* Two-column layout */}
      <div className="rg-split grid grid-cols-[1fr_300px] gap-5 items-start">

        {/* ── LEFT ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Product details */}
          <FormCard title="Product Details">
            <FieldLabel>Product Name</FieldLabel>
            <input
              type="text"
              placeholder="e.g. Aso-Oke Gele Set"
              value={name}
              onChange={e => setName(e.target.value)}
              className={`${INPUT_CLS} w-full mb-4`}
              style={inputBase}
            />

            <FieldLabel>Description</FieldLabel>
            <textarea
              placeholder="Describe your product — materials, craftsmanship, care instructions..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={5}
              className={`${INPUT_CLS} w-full mb-4 resize-y`}
              style={{ ...inputBase, lineHeight: 1.6 }}
            />

            <FieldLabel>Category</FieldLabel>
            <div className="relative w-full mb-4">
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="block box-border w-full rounded-[6px] py-2 pl-3 pr-8 appearance-none cursor-pointer"
                style={inputBase}
              >
                <option value="">Select a category…</option>
                {/* Grouped by collection, and leaves only — a product is never
                    filed directly under "Pre-Order". */}
                {[...new Set(categories.map(c => c.collectionName))].map(collection => (
                  <optgroup key={collection} label={collection}>
                    {categories.filter(c => c.collectionName === collection).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(43,35,32,0.4)", lineHeight: 0 }}>
                <ChevronDownIcon />
              </span>
            </div>

            <FieldLabel>Production Time (working days)</FieldLabel>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="e.g. 5–7"
                value={productionDays}
                onChange={e => setProductionDays(e.target.value)}
                className={`${INPUT_CLS} w-[120px]`}
                style={inputBase}
              />
              <span style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.45)" }}>
                Shown to buyers before checkout
              </span>
            </div>
          </FormCard>

          {/* Pricing */}
          <FormCard title="Pricing">
            <div className="rg-2 grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Price (CAD)</FieldLabel>
                <div className="relative">
                  <span className="absolute left-[0.7rem] top-1/2 -translate-y-1/2" style={{ fontSize: "0.82rem", color: "rgba(43,35,32,0.4)", fontWeight: 600 }}>CAD $</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={priceCad}
                    onChange={e => setPriceCad(e.target.value)}
                    className="block box-border w-full rounded-[6px] py-2 pr-3 pl-[3.6rem]"
                    style={inputBase}
                  />
                </div>
              </div>
            </div>
          </FormCard>

          {/* Variants */}
          <FormCard title="Variants">
            <div className="flex gap-2 mb-3 pl-[22px]">
              {[["80px", "Size"], ["90px", "Colour"], ["72px", "Stock"]].map(([w, h]) => (
                <span key={h} style={{ flex: w === "1" ? 1 : `0 0 ${w}`, fontSize: "0.63rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(43,35,32,0.38)", fontWeight: 500 }}>
                  {h}
                </span>
              ))}
            </div>
            <datalist id="known-colours">
              {knownColors.map(c => <option key={c} value={c} />)}
            </datalist>
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
              className="inline-flex items-center gap-[5px] mt-1.5 rounded-[6px] py-[0.4rem] px-3.5 cursor-pointer"
              style={{
                background: "none",
                border: "1px dashed rgba(43,35,32,0.2)",
                fontSize: "0.75rem",
                color: "rgba(43,35,32,0.5)",
                fontFamily: UI,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.gold; (e.currentTarget as HTMLElement).style.color = C.charcoal; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(43,35,32,0.2)"; (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.5)"; }}
            >
              <PlusSmallIcon /> Add Variant
            </button>
          </FormCard>

          {/* SEO accordion */}
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#fff", border: "1px solid rgba(43,35,32,0.07)" }}>
            <button
              onClick={() => setAdvancedOpen(o => !o)}
              className="w-full flex items-center justify-between py-3.5 px-5 cursor-pointer"
              style={{ background: "none", border: "none", fontFamily: UI, fontSize: "0.82rem", fontWeight: 600, color: C.charcoal }}
            >
              <span>Advanced — SEO</span>
              <span style={{ lineHeight: 0, transition: "transform 0.2s", transform: advancedOpen ? "rotate(180deg)" : "none" }}>
                <ChevronDownIcon />
              </span>
            </button>
            {advancedOpen && (
              <div className="pt-0 px-5 pb-5" style={{ borderTop: "1px solid rgba(43,35,32,0.06)" }}>
                <div className="h-3.5" />
                <FieldLabel>Meta Title</FieldLabel>
                <input
                  type="text"
                  placeholder="Page title shown in search results (60 chars max)"
                  maxLength={60}
                  value={metaTitle}
                  onChange={e => setMetaTitle(e.target.value)}
                  className={`${INPUT_CLS} w-full mb-4`}
                  style={inputBase}
                />
                <FieldLabel>Meta Description</FieldLabel>
                <textarea
                  placeholder="Short description for search engines (155 chars max)"
                  maxLength={155}
                  value={metaDesc}
                  onChange={e => setMetaDesc(e.target.value)}
                  rows={3}
                  className={`${INPUT_CLS} w-full resize-y`}
                  style={{ ...inputBase, lineHeight: 1.6 }}
                />
                {metaDesc && (
                  <p className="mt-1 text-right" style={{ fontSize: "0.63rem", color: "rgba(43,35,32,0.38)" }}>
                    {metaDesc.length}/155
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT ────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sticky top-6">

          {/* Save actions */}
          <FormCard>
            {error && (
              <div
                role="alert"
                className="rounded-[6px] py-[0.55rem] px-[0.7rem] mb-2.5"
                style={{
                  fontSize: "0.72rem",
                  color: C.maroon,
                  lineHeight: 1.5,
                  backgroundColor: "rgba(122,31,42,0.06)",
                  border: "1px solid rgba(122,31,42,0.18)",
                }}
              >
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={() => save(publishStatus)}
              disabled={saving}
              className="w-full rounded-[7px] py-2.5 px-4 mb-2"
              style={{
                backgroundColor: saving ? "rgba(43,35,32,0.15)" : C.gold,
                color: C.charcoal,
                border: "none",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: saving ? "wait" : "pointer",
                fontFamily: UI,
                letterSpacing: "0.01em",
              }}
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Save Product"}
            </button>
            {/* Saving as a draft is the same save with a different status, so
                the two buttons cannot drift apart. */}
            <button
              type="button"
              onClick={() => save("DRAFT")}
              disabled={saving}
              className="w-full rounded-[7px] py-[0.575rem] px-4"
              style={{
                backgroundColor: "transparent",
                color: C.charcoal,
                border: "1px solid rgba(43,35,32,0.18)",
                fontSize: "0.82rem",
                fontWeight: 500,
                cursor: saving ? "wait" : "pointer",
                fontFamily: UI,
                letterSpacing: "0.01em",
              }}
            >
              Save as Draft
            </button>
          </FormCard>

          {/* Status toggle */}
          <FormCard title="Status">
            <div className="flex gap-2">
              {(["PUBLISHED", "DRAFT"] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPublishStatus(s)}
                  className="flex-1 rounded-[6px] py-[0.45rem] px-0 cursor-pointer"
                  style={{
                    border: publishStatus === s ? "none" : "1px solid rgba(43,35,32,0.14)",
                    backgroundColor: publishStatus === s
                      ? (s === "PUBLISHED" ? C.teal : "rgba(43,35,32,0.08)")
                      : "transparent",
                    color: publishStatus === s
                      ? (s === "PUBLISHED" ? "#fff" : C.charcoal)
                      : "rgba(43,35,32,0.45)",
                    fontSize: "0.75rem",
                    fontWeight: publishStatus === s ? 600 : 400,
                    fontFamily: UI,
                    letterSpacing: "0.01em",
                  }}
                >
                  {s === "PUBLISHED" ? "Published" : "Draft"}
                </button>
              ))}
            </div>
          </FormCard>

          {/* Images */}
          <FormCard title="Images">
            <div className="rg-2 grid grid-cols-2 gap-2 mb-3">
              {images.map((img, i) => (
                <ImageSlot
                  key={img.id}
                  img={img}
                  isMain={i === 0}
                  colors={variantColors}
                  onColorChange={color => setImageColor(img.id, color)}
                  onRemove={() => removeImage(img.id)}
                />
              ))}
            </div>
            <div className="flex gap-[0.4rem] mb-2">
              <input
                type="url"
                placeholder="Paste an image URL"
                value={imageDraft}
                onChange={e => setImageDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
                className={`${INPUT_CLS} flex-1 min-w-0`}
                style={inputBase}
              />
              <button
                type="button"
                onClick={addImage}
                aria-label="Add image"
                className="shrink-0 rounded-[6px] px-[0.6rem] py-0 flex items-center cursor-pointer"
                style={{
                  border: "1px dashed rgba(43,35,32,0.2)",
                  background: "none",
                  color: "rgba(43,35,32,0.5)",
                  lineHeight: 0,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.gold; (e.currentTarget as HTMLElement).style.color = C.charcoal; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(43,35,32,0.2)"; (e.currentTarget as HTMLElement).style.color = "rgba(43,35,32,0.5)"; }}
              >
                <UploadIcon size={15} />
              </button>
            </div>
            {firstError('images') && (
              <p className="mb-[0.4rem]" style={{ fontSize: "0.68rem", color: C.maroon }}>{firstError('images')}</p>
            )}
            <p style={{ fontSize: "0.63rem", color: "rgba(43,35,32,0.38)", lineHeight: 1.5 }}>
              The first image is the main photo. Uploads need blob storage, which
              is not configured yet — paste a link for now.
            </p>
          </FormCard>

          {/* Tags */}
          <FormCard title="Tags">
            <div className="flex flex-col gap-2">
              {[{ value: "", label: "No tag" }, ...PRODUCT_TAGS.map(t => ({ value: t, label: TAG_LABELS[t] }))].map(option => (
                <label
                  key={option.value || "none"}
                  className="flex items-center gap-2.5 cursor-pointer select-none"
                  style={{
                    fontSize: "0.78rem",
                    color: tag === option.value ? C.charcoal : "rgba(43,35,32,0.6)",
                    fontWeight: tag === option.value ? 500 : 400,
                  }}
                >
                  <input
                    type="radio"
                    name="productTag"
                    checked={tag === option.value}
                    onChange={() => setTag(option.value)}
                    className="w-3.5 h-3.5 cursor-pointer"
                    style={{ accentColor: C.maroon }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <p className="mt-2.5" style={{ fontSize: "0.63rem", color: "rgba(43,35,32,0.38)", lineHeight: 1.5 }}>
              The badge shown on the product card. A product carries one at a time.
            </p>
          </FormCard>

          {/* Back link */}
          <Link
            to="/console/products"
            className="block text-center no-underline p-1"
            style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.38)" }}
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
