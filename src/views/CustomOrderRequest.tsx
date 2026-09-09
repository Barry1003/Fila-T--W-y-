'use client';

import { useMemo, useState, useTransition } from 'react';
import { Link } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';
import { GARMENT_TYPES, MEASUREMENT_FIELDS } from '@/server/custom-request-schema';
import { submitCustomRequest } from '@/server/custom-requests';

const STEPS = [
  { n: '01', title: 'Tell us what you want', body: 'Describe the piece, the occasion and when you need it. Measurements can be rough — we confirm them before cutting.' },
  { n: '02', title: 'We Quote you', body: 'Within two working days you get a price and a completion date. Nothing is charged until you approve it.' },
  { n: '03', title: 'It gets made', body: 'Woven, shaped and embroidered by hand. You can follow the status from your account at any point.' },
];

// Layout for fields is on the elements (FIELD_CLS); colour/type here.
const field: React.CSSProperties = {
  fontFamily: UI, fontSize: '0.875rem',
  border: '1px solid rgba(43,35,32,0.16)', outline: 'none',
  color: C.charcoal, backgroundColor: '#fff',
};
const FIELD_CLS = 'w-full py-[0.7rem] px-[0.85rem] rounded-[5px]';

function Field({ children, hint, htmlFor }: { children: React.ReactNode; hint: string; htmlFor: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block mb-[0.4rem]" style={{ ...label, fontSize: '0.62rem', color: C.charcoal }}>
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
      <div className="min-h-[70vh] grid place-items-center py-20 px-6" style={{ backgroundColor: C.cream }}>
        <div className="max-w-[480px] text-center">
          <div style={{ ...label, color: C.gold, fontSize: '0.6rem' }}>Request received</div>
          <h1 className="mt-3 mx-0 mb-4" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 400, color: C.charcoal, letterSpacing: '-0.02em' }}>
            Thank you — we have it
          </h1>
          <p className="m-0" style={{ fontFamily: UI, fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(43,35,32,0.68)' }}>
            Your reference is <strong style={{ color: C.charcoal }}>{reference}</strong>. Quote your
            reference in any message about this piece. We will email you a price and a completion
            date within two working days.
          </p>
          <Link to="/shop" className="inline-block no-underline mt-8 py-3.5 px-9 rounded-[4px]" style={{ ...label, fontSize: '0.68rem', backgroundColor: C.gold, color: C.charcoal }}>
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
          <div className="flex items-start justify-between gap-6">
            <div>
              <div style={{ ...label, color: C.gold, fontSize: '0.58rem', letterSpacing: '0.16em' }}>Made to order</div>
              <h1 className="mt-[0.6rem] mx-0 mb-0" style={{ fontFamily: DISPLAY, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
                Commission a piece
              </h1>
              <p className="mt-4 mx-0 mb-0 max-w-[52ch]" style={{ fontFamily: UI, fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(250,246,240,0.76)' }}>
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
        <div className="rg-3 grid grid-cols-3 gap-6">
          {STEPS.map(s => (
            <div key={s.n} className="rounded-lg py-7 px-6" style={{ backgroundColor: '#fff', border: '1px solid rgba(43,35,32,0.08)' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: '1.6rem', color: C.gold, lineHeight: 1 }}>{s.n}</div>
              <h2 className="mt-3 mx-0 mb-2" style={{ fontFamily: UI, fontSize: '0.95rem', fontWeight: 600, color: C.charcoal }}>{s.title}</h2>
              <p className="m-0" style={{ fontFamily: UI, fontSize: '0.85rem', lineHeight: 1.65, color: 'rgba(43,35,32,0.62)' }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The request ── */}
      <section className="custom-form">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
          {error && (
            <div role="alert" className="rounded-[6px] py-[0.8rem] px-4" style={{ fontFamily: UI, fontSize: '0.85rem', color: C.maroon, backgroundColor: 'rgba(122,46,56,0.07)', border: '1px solid rgba(122,46,56,0.25)' }}>
              {error}
            </div>
          )}

          <fieldset className="border-none p-0 m-0">
            <legend className="mb-4" style={{ ...label, fontSize: '0.62rem', color: 'rgba(43,35,32,0.45)' }}>1 · The piece</legend>
            <div className="flex flex-col gap-4">
              <Field htmlFor="garmentType" hint="What would you like made?">
                <select id="garmentType" value={garmentType} onChange={e => setGarmentType(e.target.value)} className={FIELD_CLS} style={field}>
                  {GARMENT_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>

              <div className="rg-2 grid grid-cols-2 gap-4">
                <Field htmlFor="occasion" hint="Occasion (optional)">
                  <input id="occasion" name="occasion" placeholder="Traditional wedding, gala…" className={FIELD_CLS} style={field} />
                </Field>
                <Field htmlFor="neededBy" hint="Needed by (optional)">
                  <input id="neededBy" name="neededBy" type="date" className={FIELD_CLS} style={field} />
                </Field>
              </div>

              <div className="rg-2 grid grid-cols-2 gap-4">
                <Field htmlFor="fabricPreference" hint="Fabric preference (optional)">
                  <input id="fabricPreference" name="fabricPreference" placeholder="Aso-oke, brocade, damask…" className={FIELD_CLS} style={field} />
                </Field>
                <Field htmlFor="colorPreference" hint="Colour preference (optional)">
                  <input id="colorPreference" name="colorPreference" placeholder="Royal blue with gold" className={FIELD_CLS} style={field} />
                </Field>
              </div>
            </div>
          </fieldset>

          {measurementFields.length > 0 && (
            <fieldset className="border-none p-0 m-0">
              <legend className="mb-2" style={{ ...label, fontSize: '0.62rem', color: 'rgba(43,35,32,0.45)' }}>2 · Measurements</legend>
              <p className="m-0 mb-4" style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.5)' }}>
                Rough is fine — we confirm every measurement before anything is cut.
              </p>
              <div className="rg-2 grid grid-cols-2 gap-4">
                {measurementFields.map(name => (
                  <Field key={name} htmlFor={`m-${name}`} hint={name}>
                    <input
                      id={`m-${name}`}
                      value={measurements[name] ?? ''}
                      onChange={e => setMeasurements(m => ({ ...m, [name]: e.target.value }))}
                      placeholder={name === 'Preferred yards' ? '5' : '44"'}
                      className={FIELD_CLS}
                      style={field}
                    />
                  </Field>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="border-none p-0 m-0">
            <legend className="mb-4" style={{ ...label, fontSize: '0.62rem', color: 'rgba(43,35,32,0.45)' }}>
              {measurementFields.length > 0 ? '3' : '2'} · How to reach you
            </legend>
            <div className="flex flex-col gap-4">
              <div className="rg-2 grid grid-cols-2 gap-4">
                <Field htmlFor="name" hint="Full name">
                  <input id="name" name="name" required autoComplete="name" placeholder="Adunola Okonkwo" className={FIELD_CLS} style={field} />
                </Field>
                <Field htmlFor="email" hint="Email address">
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={FIELD_CLS} style={field} />
                </Field>
              </div>
              <div className="rg-2 grid grid-cols-2 gap-4">
                <Field htmlFor="phone" hint="Phone (optional)">
                  <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+234 801 234 5678" className={FIELD_CLS} style={field} />
                </Field>
                <Field htmlFor="location" hint="Where you are (optional)">
                  <input id="location" name="location" placeholder="Lagos, Nigeria" className={FIELD_CLS} style={field} />
                </Field>
              </div>
              <Field htmlFor="notes" hint="Anything else (optional)">
                <textarea id="notes" name="notes" rows={4} placeholder="Embroidery style, a reference you have seen, who it is for…" className={`${FIELD_CLS} resize-y`} style={field} />
              </Field>
            </div>
          </fieldset>

          <div>
            <button
              type="submit"
              disabled={pending}
              className="min-h-[50px] px-10 rounded-[5px]"
              style={{
                border: 'none',
                backgroundColor: C.gold, color: C.charcoal, ...label, fontSize: '0.7rem',
                cursor: pending ? 'wait' : 'pointer', opacity: pending ? 0.7 : 1,
              }}
            >
              {pending ? 'Sending…' : 'Send request'}
            </button>
            <p className="mt-[0.9rem] mx-0 mb-0" style={{ fontFamily: UI, fontSize: '0.78rem', color: 'rgba(43,35,32,0.5)' }}>
              No payment is taken now. You will get a quote before anything is made.
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
