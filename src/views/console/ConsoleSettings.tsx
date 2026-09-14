'use client';

import { useState, useCallback } from "react";
import { C, UI, DISPLAY, label } from "../../tokens";
import { updatePageContent } from "@/server/content-actions";
import type { HomeContent, HeroSlide, AboutContent } from "@/server/content-schema";

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
  return <div className="p-6" style={{ ...CARD, ...style }}>{children}</div>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block mb-[0.4rem]"
      style={{
        ...label,
        color: "rgba(43,35,32,0.5)",
      }}
    >
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  border: "1px solid rgba(43,35,32,0.15)",
  fontFamily: UI,
  fontSize: "0.82rem",
  color: C.charcoal,
  backgroundColor: "#fff",
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
      className="w-full px-3 py-[0.55rem] rounded-md outline-none box-border transition-colors duration-120"
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
      className="w-full px-3 py-[0.55rem] rounded-md outline-none resize-y box-border transition-colors duration-120 leading-relaxed"
      style={{
        ...inputStyle,
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
      className="border-none rounded-md px-6 py-[0.55rem] font-semibold cursor-pointer transition-colors duration-[180ms]"
      style={{
        backgroundColor: saved ? C.teal : C.gold,
        color: saved ? "#fff" : C.charcoal,
        fontFamily: UI,
        fontSize: "0.8rem",
        letterSpacing: "0.02em",
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
        className="rounded-lg flex flex-col items-center justify-center gap-[0.35rem] cursor-pointer transition-colors duration-150"
        style={{
          border: `2px dashed ${dragging ? C.gold : "rgba(43,35,32,0.18)"}`,
          backgroundColor: dragging
            ? "rgba(212,169,78,0.05)"
            : "rgba(43,35,32,0.02)",
          height: wide ? 100 : 80,
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
      className="w-9 h-5 rounded-full border-none cursor-pointer relative shrink-0 transition-colors duration-150 p-0"
      style={{
        backgroundColor: checked ? C.teal : "rgba(43,35,32,0.18)",
      }}
    >
      <span
        className="absolute top-[2px] w-4 h-4 rounded-full bg-white transition-all duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
        style={{
          left: checked ? 18 : 2,
        }}
      />
    </button>
  );
}

// ── Store Profile tab ─────────────────────────────────────────────────────────

function TabStoreProfile() {
  const [name, setName] = useState("AdeClassics");
  const [tagline, setTagline] = useState(
    "One Brand. Endless Style. Timeless Elegance."
  );
  const [bio, setBio] = useState(
    "AdeClassics is a premium African fashion house specialising in handcrafted Aso-Oke, Adire, and embroidered headwear — rooted in Yoruba craftsmanship and dressed for the global stage."
  );
  const [email, setEmail] = useState("hello@adeclassics.com");
  const [phone, setPhone] = useState("+234 801 234 5678");
  const [address, setAddress] = useState("12 Bode Thomas Street, Surulere, Lagos, Nigeria");

  return (
    <div className="flex flex-col gap-5">
      {/* Image uploads */}
      <SectionCard>
        <div
          className="font-semibold mb-5"
          style={{
            fontSize: "0.78rem",
            color: C.charcoal,
          }}
        >
          Brand Images
        </div>
        <div className="rg-split">
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
          className="font-semibold mb-5"
          style={{
            fontSize: "0.78rem",
            color: C.charcoal,
          }}
        >
          Store Identity
        </div>
        <div className="flex flex-col gap-4">
          <div className="rg-2">
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
          className="font-semibold mb-5"
          style={{
            fontSize: "0.78rem",
            color: C.charcoal,
          }}
        >
          Contact Details
        </div>
        <div className="flex flex-col gap-4">
          <div className="rg-2">
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

function SlideIconButton({
  children, label: lbl, onClick, disabled, danger,
}: {
  children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={lbl}
      title={lbl}
      className="w-[26px] h-[26px] inline-flex items-center justify-center rounded-[5px] bg-white leading-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-[0.35]"
      style={{
        border: "1px solid rgba(43,35,32,0.15)",
        color: danger ? C.maroon : "rgba(43,35,32,0.6)",
        fontSize: "0.85rem",
      }}
    >
      {children}
    </button>
  );
}

// ── About Page tab ───────────────────────────────────────────────────────────

function TabAboutContent({ initial }: { initial: AboutContent }) {
  const [heroEyebrow, setHeroEyebrow] = useState(initial.hero.eyebrow);
  const [heroHeading, setHeroHeading] = useState(initial.hero.heading);
  const [heroImage, setHeroImage] = useState(initial.hero.imageUrl);

  const [origin, setOrigin] = useState(initial.origin);
  const [craft, setCraft] = useState(initial.craft);
  const [values, setValues] = useState(initial.values);
  const [quote, setQuote] = useState(initial.quote);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const result = await updatePageContent('about', {
      hero: { eyebrow: heroEyebrow, heading: heroHeading, imageUrl: heroImage },
      origin, craft, values, quote,
    });
    setSaving(false);
    if (result.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2600);
    } else if ('unreachable' in result && result.unreachable) {
      setError('Could not reach the database — nothing was saved. Try again in a moment.');
    } else {
      setError('Some fields could not be saved — check every image is a complete web address.');
    }
  }

  const proseCard = (
    title: string,
    section: AboutContent['origin'],
    set: (v: AboutContent['origin']) => void
  ) => (
    <SectionCard>
      <div className="font-semibold mb-5" style={{ fontSize: "0.78rem", color: C.charcoal }}>{title}</div>
      <div className="flex flex-col gap-4">
        <div>
          <FieldLabel>Eyebrow Text</FieldLabel>
          <Input value={section.eyebrow} onChange={v => set({ ...section, eyebrow: v })} placeholder="e.g. Where We Began" />
        </div>
        <div>
          <FieldLabel>Heading</FieldLabel>
          <Input value={section.heading} onChange={v => set({ ...section, heading: v })} placeholder="Section heading" />
        </div>
        <div>
          <FieldLabel>Body</FieldLabel>
          <Textarea value={section.body} onChange={v => set({ ...section, body: v })} rows={9} placeholder="Section copy…" />
          <p style={{ fontSize: "0.63rem", color: "rgba(43,35,32,0.4)", marginTop: "4px" }}>
            Leave a blank line between paragraphs.
          </p>
        </div>
        <div>
          <FieldLabel>Image URL</FieldLabel>
          <Input value={section.imageUrl} onChange={v => set({ ...section, imageUrl: v })} placeholder="https://…" />
        </div>
      </div>
    </SectionCard>
  );

  return (
    <div className="flex flex-col gap-5 max-w-[720px]">
      <SectionCard>
        <div className="font-semibold mb-5" style={{ fontSize: "0.78rem", color: C.charcoal }}>Page Header</div>
        <div className="flex flex-col gap-4">
          <div>
            <FieldLabel>Eyebrow Text</FieldLabel>
            <Input value={heroEyebrow} onChange={setHeroEyebrow} placeholder="e.g. Our Story" />
          </div>
          <div>
            <FieldLabel>Heading</FieldLabel>
            <Textarea value={heroHeading} onChange={setHeroHeading} rows={2} placeholder="Page heading" />
          </div>
          <div>
            <FieldLabel>Header Image URL</FieldLabel>
            <Input value={heroImage} onChange={setHeroImage} placeholder="https://…" />
          </div>
        </div>
      </SectionCard>

      {proseCard("Our Origin", origin, setOrigin)}
      {proseCard("How We Work", craft, setCraft)}

      <SectionCard>
        <div className="flex items-center justify-between mb-5">
          <div className="font-semibold" style={{ fontSize: "0.78rem", color: C.charcoal }}>What We Stand For</div>
          <button
            onClick={() => setValues(v => (v.length < 6 ? [...v, { title: "", body: "" }] : v))}
            disabled={values.length >= 6}
            className="bg-none rounded-[5px] px-[0.7rem] py-[0.3rem] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              border: "1px dashed rgba(43,35,32,0.25)",
              fontFamily: UI, fontSize: "0.72rem",
              color: "rgba(43,35,32,0.6)",
            }}
          >
          + Add
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {values.map((v, i) => (
            <div key={i} className="rounded-lg p-4" style={{ border: "1px solid rgba(43,35,32,0.12)" }}>
              <div className="flex items-center justify-between mb-[0.75rem]">
                <span className="font-semibold uppercase tracking-[0.1em]" style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.45)" }}>
                  Value {i + 1}
                </span>
                <SlideIconButton
                  label={`Remove value ${i + 1}`}
                  danger
                  onClick={() => setValues(list => list.filter((_, n) => n !== i))}
                >×</SlideIconButton>
              </div>
              <div className="flex flex-col gap-[0.75rem]">
                <div>
                  <FieldLabel>Title</FieldLabel>
                  <Input value={v.title} onChange={val => setValues(list => list.map((x, n) => (n === i ? { ...x, title: val } : x)))} placeholder="e.g. Authentic Craft" />
                </div>
                <div>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea value={v.body} onChange={val => setValues(list => list.map((x, n) => (n === i ? { ...x, body: val } : x)))} rows={3} placeholder="What this means…" />
                </div>
              </div>
            </div>
          ))}
          {values.length === 0 && (
            <p style={{ fontSize: "0.78rem", color: "rgba(43,35,32,0.45)", margin: 0 }}>
              No values yet — the section is hidden on the page.
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard>
        <div className="font-semibold mb-5" style={{ fontSize: "0.78rem", color: C.charcoal }}>Founder Quote</div>
        <div className="flex flex-col gap-4">
          <div>
            <FieldLabel>Quote</FieldLabel>
            <Textarea value={quote.text} onChange={v => setQuote(q => ({ ...q, text: v }))} rows={4} placeholder="The quote…" />
          </div>
          <div>
            <FieldLabel>Attribution</FieldLabel>
            <Input value={quote.attribution} onChange={v => setQuote(q => ({ ...q, attribution: v }))} placeholder="Name, role" />
          </div>
        </div>
      </SectionCard>

      <div className="flex items-center gap-[0.875rem] flex-wrap">
        <button
          onClick={save}
          disabled={saving}
          className="border-none rounded-md px-6 py-[0.55rem] font-semibold cursor-pointer disabled:cursor-wait"
          style={{
            backgroundColor: saved ? C.teal : C.gold, color: saved ? "#fff" : C.charcoal,
            fontFamily: UI, fontSize: "0.8rem",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving…" : saved ? "Saved — live on the site" : "Save Changes"}
        </button>
        {error && <span style={{ fontSize: "0.75rem", color: C.maroon }}>{error}</span>}
      </div>
    </div>
  );
}

// ── Homepage Content tab ──────────────────────────────────────────────────────

function TabHomepageContent({ initial }: { initial: HomeContent }) {
  const [slides, setSlides] = useState<HeroSlide[]>(initial.hero.slides);
  const [intervalSeconds, setIntervalSeconds] = useState(initial.hero.intervalSeconds);
  const [promoEnabled, setPromoEnabled] = useState(initial.promo.enabled);
  const [promo, setPromo] = useState(initial.promo.text);
  const [storyHeading, setStoryHeading] = useState(initial.story.heading);
  const [story, setStory] = useState(initial.story.body);
  const [storyImage, setStoryImage] = useState(initial.story.imageUrl);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patchSlide(id: string, patch: Partial<HeroSlide>) {
    setSlides(list => list.map(s => (s.id === id ? { ...s, ...patch } : s)));
  }

  function addSlide() {
    setSlides(list => [
      ...list,
      {
        id: `slide-${Date.now()}`,
        eyebrow: "",
        headline: "",
        ctaLabel: "Shop now",
        ctaHref: "/shop",
        imageUrl: "https://images.unsplash.com/photo-1763823133159-c6f8ec380e33?w=1800&h=1100&fit=crop&auto=format",
      },
    ]);
  }

  function removeSlide(id: string) {
    setSlides(list => (list.length > 1 ? list.filter(s => s.id !== id) : list));
  }

  function moveSlide(id: string, direction: -1 | 1) {
    setSlides(list => {
      const i = list.findIndex(s => s.id === id);
      const j = i + direction;
      if (i < 0 || j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setError(null);
    const result = await updatePageContent('home', {
      hero: { slides, intervalSeconds },
      story: { heading: storyHeading, body: story, imageUrl: storyImage },
      promo: { enabled: promoEnabled, text: promo },
    });
    setSaving(false);
    if (result.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2600);
    } else if ('unreachable' in result && result.unreachable) {
      setError('Could not reach the database — nothing was saved. Try again in a moment.');
    } else {
      setError('Some fields could not be saved — check every slide has a headline and a complete image URL.');
    }
  }

  return (
    <div className="settings-homepage-grid">
      {/* Fields */}
      <div className="flex flex-col gap-5">
        <SectionCard>
          <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
            <div className="font-semibold" style={{ fontSize: "0.78rem", color: C.charcoal }}>
              Hero Slideshow
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: "0.72rem", color: "rgba(43,35,32,0.55)" }}>
              <label htmlFor="hero-interval">Seconds per slide</label>
              <input
                id="hero-interval"
                type="number"
                min={3}
                max={30}
                value={intervalSeconds}
                onChange={e => setIntervalSeconds(Number(e.target.value))}
                style={{
                  width: 64, padding: "0.35rem 0.5rem",
                  border: "1px solid rgba(43,35,32,0.15)", borderRadius: 5,
                  fontFamily: UI, fontSize: "0.75rem", color: C.charcoal, outline: "none",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className="rounded-lg p-4"
                style={{
                  border: "1px solid rgba(43,35,32,0.12)",
                  backgroundColor: "rgba(43,35,32,0.015)",
                }}
              >
                <div className="flex items-center justify-between mb-[0.875rem]">
                  <span className="font-semibold uppercase tracking-[0.1em]" style={{ fontSize: "0.7rem", color: "rgba(43,35,32,0.45)" }}>
                    Slide {i + 1}
                  </span>
                  <div className="flex gap-1">
                    <SlideIconButton label={`Move slide ${i + 1} up`} disabled={i === 0} onClick={() => moveSlide(slide.id, -1)}>↑</SlideIconButton>
                    <SlideIconButton label={`Move slide ${i + 1} down`} disabled={i === slides.length - 1} onClick={() => moveSlide(slide.id, 1)}>↓</SlideIconButton>
                    <SlideIconButton label={`Remove slide ${i + 1}`} disabled={slides.length === 1} danger onClick={() => removeSlide(slide.id)}>×</SlideIconButton>
                  </div>
                </div>

                <div className="flex flex-col gap-[0.75rem]">
                  <div>
                    <FieldLabel>Eyebrow Text</FieldLabel>
                    <Input value={slide.eyebrow} onChange={v => patchSlide(slide.id, { eyebrow: v })} placeholder="e.g. The cap line" />
                  </div>
                  <div>
                    <FieldLabel>Headline</FieldLabel>
                    <Textarea value={slide.headline} onChange={v => patchSlide(slide.id, { headline: v })} rows={3} placeholder="Main hero headline" />
                    <p style={{ fontSize: "0.63rem", color: "rgba(43,35,32,0.4)", marginTop: "4px" }}>
                      Each new line becomes its own line on the hero.
                    </p>
                  </div>
                  <div className="rg-2">
                    <div>
                      <FieldLabel>Button Label</FieldLabel>
                      <Input value={slide.ctaLabel} onChange={v => patchSlide(slide.id, { ctaLabel: v })} placeholder="Shop the collection" />
                    </div>
                    <div>
                      <FieldLabel>Button Link</FieldLabel>
                      <Input value={slide.ctaHref} onChange={v => patchSlide(slide.id, { ctaHref: v })} placeholder="/shop" />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Slide Image URL</FieldLabel>
                    <Input value={slide.imageUrl} onChange={v => patchSlide(slide.id, { imageUrl: v })} placeholder="https://…" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addSlide}
            disabled={slides.length >= 8}
            className="mt-4 bg-none rounded-md px-4 py-[0.6rem] w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              border: "1px dashed rgba(43,35,32,0.25)",
              fontFamily: UI, fontSize: "0.78rem", color: "rgba(43,35,32,0.6)",
            }}
          >
            + Add slide
          </button>
        </SectionCard>

        <SectionCard>
          <div
            className="font-semibold mb-5"
            style={{
              fontSize: "0.78rem",
              color: C.charcoal,
            }}
          >
            Promo Strip
          </div>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-[0.6rem] cursor-pointer" style={{ fontSize: "0.8rem", color: C.charcoal }}>
              <input
                type="checkbox"
                checked={promoEnabled}
                onChange={e => setPromoEnabled(e.target.checked)}
                style={{ accentColor: C.gold, width: 15, height: 15, cursor: "pointer" }}
              />
              Show the promo strip on the homepage
            </label>
            <div>
              <FieldLabel>Promo Strip Message</FieldLabel>
              <Input
                value={promo}
                onChange={setPromo}
                placeholder="Scrolling promo bar text"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div
            className="font-semibold mb-5"
            style={{
              fontSize: "0.78rem",
              color: C.charcoal,
            }}
          >
            Our Story Section
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <FieldLabel>Section Heading</FieldLabel>
              <Input value={storyHeading} onChange={setStoryHeading} placeholder="e.g. Yoruba craft, made for the world." />
            </div>
            <div>
              <FieldLabel>Story Text</FieldLabel>
              <Textarea
                value={story}
                onChange={setStory}
                rows={7}
                placeholder="The brand story shown on the homepage..."
              />
              <p style={{ fontSize: "0.63rem", color: "rgba(43,35,32,0.4)", marginTop: "4px" }}>
                Leave a blank line between paragraphs.
              </p>
            </div>
            <div>
              <FieldLabel>Story Image URL</FieldLabel>
              <Input value={storyImage} onChange={setStoryImage} placeholder="https://…" />
            </div>
          </div>
        </SectionCard>

        <div className="flex items-center gap-[0.875rem] flex-wrap">
          <button
            onClick={save}
            disabled={saving}
            className="border-none rounded-md px-6 py-[0.55rem] font-semibold cursor-pointer disabled:cursor-wait transition-colors duration-[180ms]"
            style={{
              backgroundColor: saved ? C.teal : C.gold,
              color: saved ? "#fff" : C.charcoal,
              fontFamily: UI, fontSize: "0.8rem",
              opacity: saving ? 0.7 : 1,
              letterSpacing: "0.02em",
            }}
          >
            {saving ? "Saving…" : saved ? "Saved — live on the site" : "Save Changes"}
          </button>
          {error && (
            <span style={{ fontSize: "0.75rem", color: C.maroon }}>{error}</span>
          )}
        </div>
      </div>

      {/* Live preview */}
      <div className="sticky top-5 self-start">
        <div
          className="mb-2"
          style={{
            ...label,
            color: "rgba(43,35,32,0.4)",
          }}
        >
          Hero Preview
        </div>
        <div
          className="overflow-hidden rounded-[10px]"
          style={CARD}
        >
          <div
            className="p-[1.75rem_1.25rem_1.5rem] relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${C.maroon} 0%, #4A1820 100%)`,
            }}
          >
            {/* Decorative texture */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, rgba(212,169,78,0.15) 0%, transparent 60%)",
              }}
            />
            <div
              className="uppercase mb-2"
              style={{
                fontFamily: UI,
                fontSize: "0.6rem",
                letterSpacing: "0.14em",
                color: C.gold,
                opacity: slides[0]?.eyebrow ? 1 : 0.3,
              }}
            >
              {slides[0]?.eyebrow || "Eyebrow text…"}
            </div>
            <div
              className="font-medium whitespace-pre-line mb-[0.875rem] leading-tight"
              style={{
                fontFamily: DISPLAY,
                fontSize: "1.3rem",
                color: C.cream,
                opacity: slides[0]?.headline ? 1 : 0.3,
              }}
            >
              {slides[0]?.headline || "Hero headline…"}
            </div>
            <div
              className="inline-block rounded px-[0.9rem] py-[0.35rem] font-semibold"
              style={{
                backgroundColor: C.gold,
                color: C.charcoal,
                fontSize: "0.65rem",
                fontFamily: UI,
                letterSpacing: "0.04em",
              }}
            >
              Shop Now
            </div>
          </div>

          {/* Promo strip preview */}
          <div
            className="px-4 py-[0.45rem] overflow-hidden whitespace-nowrap text-ellipsis"
            style={{
              backgroundColor: C.charcoal,
              fontSize: "0.6rem",
              color: "rgba(250,246,240,0.75)",
              fontFamily: UI,
              letterSpacing: "0.04em",
              opacity: promo ? 1 : 0.4,
            }}
          >
            {promo || "Promo strip message…"}
          </div>

          {/* Story preview */}
          <div className="p-[1rem_1.25rem]">
            <div
              className="uppercase mb-[0.4rem]"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                color: "rgba(43,35,32,0.4)",
                fontFamily: UI,
              }}
            >
              Our Story
            </div>
            <p
              className="m-0 overflow-hidden"
              style={{
                fontSize: "0.72rem",
                color: "rgba(43,35,32,0.7)",
                lineHeight: 1.55,
                fontFamily: UI,
                opacity: story ? 1 : 0.3,
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
              }}
            >
              {story || "Your story text will appear here…"}
            </p>
          </div>
        </div>
        <div
          className="mt-2 text-center"
          style={{
            fontSize: "0.65rem",
            color: "rgba(43,35,32,0.35)",
            fontFamily: UI,
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
  costCad: string;
};

const DEFAULT_REGIONS: Region[] = [
  { id: 1, name: "United Kingdom", standard: "3–5 business days", express: "Next day", costCad: "CAD $12.02" },
  { id: 2, name: "Canada", standard: "7–10 business days", express: "3–5 days", costCad: "CAD $20.64" },
  { id: 3, name: "United States", standard: "7–10 business days", express: "3–5 days", costCad: "CAD $17.20" },
  { id: 4, name: "Nigeria", standard: "2–4 business days", express: "Same day (Lagos)", costCad: "CAD $0.00" },
  { id: 5, name: "Other / Rest of World", standard: "10–21 business days", express: "", costCad: "CAD $30.96" },
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
      { id: nextId, name: "", standard: "", express: "", costCad: "" },
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
    <div className="flex flex-col gap-5">
      <div
        className="overflow-hidden"
        style={CARD}
      >
        <div
          className="flex items-center justify-between p-[1rem_1.25rem_0.875rem]"
          style={{
            borderBottom: "1px solid rgba(43,35,32,0.06)",
          }}
        >
          <span
            className="font-semibold"
            style={{
              fontSize: "0.8rem",
              color: C.charcoal,
              fontFamily: UI,
            }}
          >
            Shipping Regions
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="table-scroll">
            <table className="card-table w-full border-collapse min-w-[560px]">
              <thead>
                <tr>
                  {colHead("Region")}
                  {colHead("Standard Delivery")}
                  {colHead("Express Delivery")}
                  {colHead("Cost (CAD)")}
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
                        ["costCad", r.costCad, "CAD $0.00"],
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
        </div>

        <div className="p-[1rem_1.25rem]">
          <button
            onClick={addRegion}
            className="bg-none rounded-md px-4 py-[0.45rem] cursor-pointer flex items-center gap-[0.4rem]"
            style={{
              border: `1px dashed rgba(43,35,32,0.22)`,
              fontFamily: UI,
              fontSize: "0.78rem",
              color: "rgba(43,35,32,0.55)",
            }}
          >
            <span className="leading-none" style={{ fontSize: "1.1rem" }}>+</span> Add Region
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
      className="inline-block px-[9px] py-[2px] rounded-full font-medium whitespace-nowrap"
      style={{
        fontSize: "0.68rem",
        backgroundColor: "rgba(59,138,147,0.12)",
        color: C.teal,
        fontFamily: UI,
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
    <div className="flex flex-col gap-5">
      {/* Providers */}
      <SectionCard>
        <div
          className="font-semibold mb-5"
          style={{
            fontSize: "0.78rem",
            color: C.charcoal,
          }}
        >
          Payment Providers
        </div>
        <div className="flex flex-col gap-3">
          {providers.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-4 p-[0.875rem_1rem] rounded-lg"
              style={{
                border: "1px solid rgba(43,35,32,0.08)",
                backgroundColor: "rgba(43,35,32,0.015)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shrink-0"
                style={{
                  backgroundColor: p.logoColor,
                  fontSize: "0.9rem",
                  fontFamily: UI,
                }}
              >
                {p.logo}
              </div>
              <div className="flex-1">
                <div
                  className="font-semibold mb-[2px]"
                  style={{
                    fontSize: "0.82rem",
                    color: C.charcoal,
                    fontFamily: UI,
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
                className="bg-none rounded-[5px] px-[0.8rem] py-[0.35rem] cursor-pointer font-medium"
                style={{
                  border: "1px solid rgba(43,35,32,0.15)",
                  fontSize: "0.73rem",
                  color: C.charcoal,
                  fontFamily: UI,
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
          className="flex items-center justify-between mb-5"
        >
          <div
            className="font-semibold"
            style={{
              fontSize: "0.78rem",
              color: C.charcoal,
            }}
          >
            Payout Bank Account
          </div>
          <button
            onClick={() => setEditingBank(!editingBank)}
            className="bg-none border-none cursor-pointer p-0 font-medium"
            style={{
              fontSize: "0.73rem",
              color: C.maroon,
              fontFamily: UI,
            }}
          >
            {editingBank ? "Cancel" : "Edit"}
          </button>
        </div>

        {editingBank ? (
          <div
            className="flex flex-col gap-[0.875rem]"
          >
            <div className="rg-2">
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
                className="border-none rounded-md px-5 py-2 font-semibold cursor-pointer"
                style={{
                  backgroundColor: C.gold,
                  color: C.charcoal,
                  fontSize: "0.78rem",
                  fontFamily: UI,
                }}
              >
                Save Bank Details
              </button>
            </div>
          </div>
        ) : (
          <div className="rg-3">
            {[
              ["Bank", bankName],
              ["Account Number", acctNum],
              ["Account Name", acctName],
            ].map(([lbl, val]) => (
              <div key={lbl}>
                <div
                  className="mb-1"
                  style={{
                    ...label,
                    color: "rgba(43,35,32,0.4)",
                  }}
                >
                  {lbl}
                </div>
                <div
                  className="font-medium"
                  style={{
                    fontSize: "0.82rem",
                    color: C.charcoal,
                    fontFamily: UI,
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
          className="font-semibold mb-5"
          style={{
            fontSize: "0.78rem",
            color: C.charcoal,
          }}
        >
          Payout Schedule
        </div>
        <div className="max-w-[280px]">
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
    "We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in original packaging. Custom-made garments are non-returnable unless faulty. To initiate a return, contact hello@adeclassics.com with your order number.",
  "Shipping Policy":
    "All orders are dispatched from Lagos, Nigeria within 2 business days. International orders are shipped via DHL or FedEx. Estimated delivery times vary by region — see our Shipping & Delivery table for details. We are not responsible for customs duties or import taxes.",
  "Terms of Service":
    "By placing an order with AdeClassics you agree to these terms. All prices are displayed in Canadian dollars (CAD). Payment is processed securely via Paystack or Flutterwave. We reserve the right to cancel any order at our discretion with a full refund.",
  "Privacy Policy":
    "We collect your name, email, shipping address, and payment details solely to fulfil your orders. We do not sell your data to third parties. Your data is stored securely and you may request deletion at any time by emailing privacy@adeclassics.com.",
};

function TabPolicies() {
  const [policies, setPolicies] = useState({ ...POLICY_DEFAULTS });

  return (
    <div className="flex flex-col gap-5">
      {Object.keys(policies).map((key) => (
        <SectionCard key={key}>
          <div
            className="font-semibold mb-[0.875rem]"
            style={{
              fontSize: "0.78rem",
              color: C.charcoal,
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
          className="p-[1rem_1.5rem_0.75rem]"
          style={{
            borderBottom: "1px solid rgba(43,35,32,0.06)",
          }}
        >
          <div
            className="font-semibold"
            style={{
              fontSize: "0.78rem",
              color: C.charcoal,
              fontFamily: UI,
            }}
          >
            Owner Notification Preferences
          </div>
          <div
            className="mt-[3px]"
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
          className="grid p-[0.5rem_1.5rem]"
          style={{
            gridTemplateColumns: "1fr 90px 90px",
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
            className="grid items-center p-[0.875rem_1.5rem]"
            style={{
              gridTemplateColumns: "1fr 90px 90px",
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
                className="font-medium mb-[2px]"
                style={{
                  fontSize: "0.8rem",
                  color: C.charcoal,
                  fontFamily: UI,
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
            <div className="flex justify-center">
              <Toggle checked={r.email} onChange={() => toggle(i, "email")} />
            </div>
            <div className="flex justify-center">
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
  "About Page",
  "Shipping & Delivery",
  "Payments & Payout",
  "Policies",
  "Notifications",
] as const;

type Tab = (typeof TABS)[number];

// ── Page root ─────────────────────────────────────────────────────────────────

export default function ConsoleSettings({ homeContent, aboutContent }: { homeContent: HomeContent; aboutContent: AboutContent }) {
  const [activeTab, setActiveTab] = useState<Tab>("Store Profile");

  return (
    <div className="flex h-full" style={{ fontFamily: UI }}>
      {/* Left sub-nav */}
      <nav
        aria-label="Settings sections"
        className="w-[192px] shrink-0 py-5 flex flex-col"
        style={{
          borderRight: "1px solid rgba(43,35,32,0.08)",
          backgroundColor: "rgba(43,35,32,0.025)",
        }}
      >
        {TABS.map((tab) => {
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="bg-none border-none text-left px-5 py-[0.6rem] uppercase cursor-pointer leading-snug transition-colors duration-120"
              style={{
                borderBottom: `2px solid ${active ? C.gold : "transparent"}`,
                fontFamily: UI,
                fontSize: "0.72rem",
                letterSpacing: "0.06em",
                fontWeight: active ? 600 : 400,
                color: active ? C.charcoal : "rgba(43,35,32,0.5)",
              }}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      {/* Content pane */}
      <div className="flex-1 overflow-y-auto p-7 min-w-0">
        {activeTab === "Store Profile" && <TabStoreProfile />}
        {activeTab === "Homepage Content" && <TabHomepageContent initial={homeContent} />}
        {activeTab === "About Page" && <TabAboutContent initial={aboutContent} />}
        {activeTab === "Shipping & Delivery" && <TabShipping />}
        {activeTab === "Payments & Payout" && <TabPayments />}
        {activeTab === "Policies" && <TabPolicies />}
        {activeTab === "Notifications" && <TabNotifications />}
      </div>
    </div>
  );
}
