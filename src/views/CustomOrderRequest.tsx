'use client';

import { useMemo, useState, useTransition } from 'react';
import { Link } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';
import { GARMENT_TYPES, MEASUREMENT_FIELDS } from '@/server/custom-request-schema';
import { submitCustomRequest } from '@/server/custom-requests';

const STEPS = [
  { n: '01', title: 'Tell us what you want', body: 'Describe the piece, the occasion and when you need it. Measurements can be rough — we confirm them before cutting.' },
  { n: '02', title: 'We quote you', body: 'Within two working days you get a price and a completion date. Nothing is charged until you approve it.' },
  { n: '03', title: 'It gets made', body: 'Woven, shaped and embroidered by hand. You can follow the status from your account at any point.' },
];

const field: React.CSSProperties = {
  width: '100%', padding: '0.7rem 0.85rem', fontFamily: UI, fontSize: '0.875rem',
  border: '1px solid rgba(43,35,32,0.16)', borderRadius: 5, outline: 'none',
  color: C.charcoal, backgroundColor: '#fff',
};

function Field({ children, hint, htmlFor }: { children: React.ReactNode; hint: string; htmlFor: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} style={{ ...label, fontSize: '0.62rem', color: C.charcoal, display: 'block', marginBottom: '0.4rem' }}>
        {hint}
      </label>
      {children}
    </div>
  );
}

export default function CustomOrderRequest() {
  const [pending, startTransition] = useTransition();
  const [garmentType, setGarmentType] = useState<string>(GARMENT_TYPES[0]);
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  // The fields asked for change with the garment: a cap needs a head
  // circumference, an agbada needs four.
  const measurementFields = useMemo(() => MEASUREMENT_FIELDS[garmentType] ?? [], [garmentType]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await submitCustomRequest({
        name: data.get('name'),
        email: data.get('email'),
        phone: data.get('phone') ?? '',
        location: data.get('location') ?? '',
        garmentType,
        occasion: data.get('occasion') ?? '',
        neededBy: data.get('neededBy') ?? '',
        fabricPreference: data.get('fabricPreference') ?? '',
        colorPreference: data.get('colorPreference') ?? '',
        notes: data.get('notes') ?? '',
        measurements: measurementFields.map(l => ({ label: l, value: measurements[l] ?? '' })),
      });

      if (result.ok) setReference(result.reference);
      else setError(result.message);
    });
  }

  if (reference) {
    return (
      <div style={{ backgroundColor: C.cream, minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <div style={{ ...label, color: C.gold, fontSize: '0.6rem' }}>Request received</div>
          <h1 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 400, color: C.charcoal, margin: '0.75rem 0 1rem', letterSpacing: '-0.02em' }}>
            Thank you — we have it
          </h1>
          <p style={{ fontFamily: UI, fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(43,35,32,0.68)', margin: 0 }}>
            Your reference is <strong style={{ color: C.charcoal }}>{reference}</strong>. Quote your
            reference in any message about this piece. We will email you a price and a completion
            date within two working days.
          </p>
          <Link to="/shop" style={{ ...label, display: 'inline-block', marginTop: '2rem', fontSize: '0.68rem', padding: '0.875rem 2.25rem', backgroundColor: C.gold, color: C.charcoal, borderRadius: 4, textDecorationLine: 'none' }}>
            Browse the collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.cream }}>
      {/* ── Masthead ── */}
      <header style={{ backgroundColor: C.maroon, color: C.cream }}>
        <div className="custom-masthead">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div>
              <div style={{ ...label, color: C.gold, fontSize: '0.58rem', letterSpacing: '0.16em' }}>Made to order</div>
              <h1 style={{ fontFamily: DISPLAY, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 400, letterSpacing: '-0.025em', margin: '0.6rem 0 0', lineHeight: 1.05 }}>
                Commission a piece
              </h1>
              <p style={{ fontFamily: UI, fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(250,246,240,0.76)', margin: '1rem 0 0', maxWidth: '52ch' }}>
                Filà, Gele, Agbada or a full aso-ebi set, cut to your measurements and finished in
                the fabric you choose. Tell us what you have in mind and we will quote you.
              </p>
            </div>

            {/* Questions go to the FAQ rather than cluttering this page. */}
            <Link to="/help" className="custom-help-link" aria-label="Read the frequently asked questions">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Help
            </Link>
          </div>
        </div>
      </header>

      {/* ── How it works ── */}
      <section className="custom-steps">
        <div className="rg-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {STEPS.map(s => (
            <div key={s.n} style={{ backgroundColor: '#fff', border: '1px solid rgba(43,35,32,0.08)', borderRadius: 8, padding: '1.75rem 1.5rem' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: '1.6rem', color: C.gold, lineHeight: 1 }}>{s.n}</div>
              <h2 style={{ fontFamily: UI, fontSize: '0.95rem', fontWeight: 600, color: C.charcoal, margin: '0.75rem 0 0.5rem' }}>{s.title}</h2>
              <p style={{ fontFamily: UI, fontSize: '0.85rem', lineHeight: 1.65, color: 'rgba(43,35,32,0.62)', margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The request ── */}
      <section className="custom-form">
        <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {error && (
            <div role="alert" style={{ fontFamily: UI, fontSize: '0.85rem', color: C.maroon, backgroundColor: 'rgba(122,46,56,0.07)', border: '1px solid rgba(122,46,56,0.25)', borderRadius: 6, padding: '0.8rem 1rem' }}>
              {error}
            </div>
          )}

          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend style={{ ...label, fontSize: '0.62rem', color: 'rgba(43,35,32,0.45)', marginBottom: '1rem' }}>1 · The piece</legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field htmlFor="garmentType" hint="What would you like made?">
                <select id="garmentType" value={garmentType} onChange={e => setGarmentType(e.target.value)} style={field}>
                  {GARMENT_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>

              <div className="rg-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field htmlFor="occasion" hint="Occasion (optional)">
                  <input id="occasion" name="occasion" placeholder="Traditional wedding, gala…" style={field} />
                </Field>
                <Field htmlFor="neededBy" hint="Needed by (optional)">
                  <input id="neededBy" name="neededBy" type="date" style={field} />
                </Field>
              </div>

              <div className="rg-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field htmlFor="fabricPreference" hint="Fabric preference (optional)">
                  <input id="fabricPreference" name="fabricPreference" placeholder="Aso-oke, brocade, damask…" style={field} />
                </Field>
                <Field htmlFor="colorPreference" hint="Colour preference (optional)">
                  <input id="colorPreference" name="colorPreference" placeholder="Royal blue with gold" style={field} />
                </Field>
              </div>
            </div>
          </fieldset>

          {measurementFields.length > 0 && (
            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend style={{ ...label, fontSize: '0.62rem', color: 'rgba(43,35,32,0.45)', marginBottom: '0.5rem' }}>2 · Measurements</legend>
              <p style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.5)', margin: '0 0 1rem' }}>
                Rough is fine — we confirm every measurement before anything is cut.
              </p>
              <div className="rg-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {measurementFields.map(name => (
                  <Field key={name} htmlFor={`m-${name}`} hint={name}>
                    <input
                      id={`m-${name}`}
                      value={measurements[name] ?? ''}
                      onChange={e => setMeasurements(m => ({ ...m, [name]: e.target.value }))}
                      placeholder={name === 'Preferred yards' ? '5' : '44"'}
                      style={field}
                    />
                  </Field>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend style={{ ...label, fontSize: '0.62rem', color: 'rgba(43,35,32,0.45)', marginBottom: '1rem' }}>
              {measurementFields.length > 0 ? '3' : '2'} · How to reach you
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="rg-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field htmlFor="name" hint="Full name">
                  <input id="name" name="name" required autoComplete="name" placeholder="Adunola Okonkwo" style={field} />
                </Field>
                <Field htmlFor="email" hint="Email address">
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" style={field} />
                </Field>
              </div>
              <div className="rg-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field htmlFor="phone" hint="Phone (optional)">
                  <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+234 801 234 5678" style={field} />
                </Field>
                <Field htmlFor="location" hint="Where you are (optional)">
                  <input id="location" name="location" placeholder="Lagos, Nigeria" style={field} />
                </Field>
              </div>
              <Field htmlFor="notes" hint="Anything else (optional)">
                <textarea id="notes" name="notes" rows={4} placeholder="Embroidery style, a reference you have seen, who it is for…" style={{ ...field, resize: 'vertical' }} />
              </Field>
            </div>
          </fieldset>

          <div>
            <button
              type="submit"
              disabled={pending}
              style={{
                minHeight: 50, padding: '0 2.5rem', border: 'none', borderRadius: 5,
                backgroundColor: C.gold, color: C.charcoal, ...label, fontSize: '0.7rem',
                cursor: pending ? 'wait' : 'pointer', opacity: pending ? 0.7 : 1,
              }}
            >
              {pending ? 'Sending…' : 'Send request'}
            </button>
            <p style={{ fontFamily: UI, fontSize: '0.78rem', color: 'rgba(43,35,32,0.5)', margin: '0.9rem 0 0' }}>
              No payment is taken now. You will get a quote before anything is made.
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
