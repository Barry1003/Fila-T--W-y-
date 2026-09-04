'use client';

import { useState } from 'react';
import { Link } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';

type FaqItem = { id: string; q: string; a: string };
type FaqSection = { id: string; title: string; icon: React.ReactNode; items: FaqItem[] };

const FAQ_SECTIONS: FaqSection[] = [
  {
    id: 'orders',
    title: 'Orders & Shipping',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    items: [
      { id: 'o1', q: "How long does shipping take?", a: "Standard international shipping takes 7–14 business days. Express options (3–5 business days) are available at checkout. All orders are dispatched from Lagos within 2–3 business days of payment confirmation." },
      { id: 'o2', q: "Do you ship worldwide?", a: "Yes. We ship to over 40 countries across North America, Europe, and Africa. Shipping costs and estimated delivery times are calculated at checkout based on your destination." },
      { id: 'o3', q: "How do I track my order?", a: "Once your order ships, you'll receive a tracking number by email. You can also view your tracking status in your account under Orders & Tracking." },
      { id: 'o4', q: "Can I change or cancel my order?", a: "Orders can be amended or cancelled within 12 hours of placement, before they enter fulfilment. Contact us via your Support Inbox as soon as possible with your order number." },
      { id: 'o5', q: "Are there customs duties or taxes?", a: "Import duties and taxes are the responsibility of the buyer and vary by country. We declare accurate values on all packages and do not mark orders as gifts." },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Exchanges',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" />
      </svg>
    ),
    items: [
      { id: 'r1', q: "What is your returns window?", a: "We accept returns within 21 days of the delivery date. Items must be unworn, unaltered, and in original packaging. Embroidered or custom-order items are final sale and cannot be returned." },
      { id: 'r2', q: "How do I start a return?", a: "Log in to your account, go to Orders & Tracking, select the relevant order, and click 'Request Return'. Once approved, you'll receive a prepaid return label by email." },
      { id: 'r3', q: "When will I receive my refund?", a: "Refunds are processed within 5–7 business days of us receiving the returned item. Refunds are applied to the original payment method. Shipping costs are non-refundable." },
      { id: 'r4', q: "Can I exchange for a different size or colour?", a: "Yes, exchanges are processed as a return + new order. Once your return is received and approved, a store credit code will be emailed to you to use on your next purchase." },
      { id: 'r5', q: "Are made-to-order or custom pieces returnable?", a: "No. Custom and made-to-order items are crafted specifically for you and cannot be returned or exchanged unless they arrive damaged or significantly different from the description." },
    ],
  },
  {
    id: 'custom',
    title: 'Custom Orders',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    items: [
      { id: 'c1', q: "Do you offer bespoke or custom orders?", a: "Yes. We accept custom orders for Gele, Filà, and coordinated aso-ebi sets. Use the Custom Order page to submit your requirements, including occasion, colour preferences, and timeline." },
      { id: 'c2', q: "How far in advance should I place a custom order?", a: "We recommend a minimum of 6 weeks for custom headwear and 10–12 weeks for full aso-ebi coordinated sets, especially for wedding orders. Rush timelines may incur a fee and are not always possible." },
      { id: 'c3', q: "Can you match a specific fabric or colour?", a: "In many cases, yes. Share a reference photo or fabric swatch during the enquiry process. We'll confirm availability and a colour match before taking payment." },
    ],
  },
  {
    id: 'payments',
    title: 'Payments',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    items: [
      { id: 'p1', q: "What payment methods do you accept?", a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, and Google Pay. For Nigerian customers, we also accept bank transfer." },
      { id: 'p2', q: "Is your checkout secure?", a: "Yes. All transactions are processed through encrypted, PCI-DSS-compliant payment gateways. We do not store your full card details on our servers." },
      { id: 'p3', q: "Can I pay in my local currency?", a: "Orders are billed in Canadian Dollars (CAD) by default. Your card provider will apply the current exchange rate. Some checkout methods may display estimated local currency equivalents." },
      { id: 'p4', q: "Do you offer payment plans?", a: "We offer a buy-now-pay-later option via Affirm and Klarna for eligible orders over CAD $150. Select your preferred option at checkout." },
    ],
  },
];

function Accordion({ section, openItems, toggle }: {
  section: FaqSection;
  openItems: Set<string>;
  toggle: (id: string) => void;
}) {
  return (
    <div id={section.id} style={{ marginBottom: '3rem' }}>
      <h2 style={{ fontFamily: DISPLAY, fontSize: '1.4rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.01em', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `1px solid rgba(43,35,32,0.09)` }}>
        {section.title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {section.items.map(item => {
          const open = openItems.has(item.id);
          return (
            <div key={item.id} style={{ borderBottom: `1px solid rgba(43,35,32,0.07)` }}>
              <button
                onClick={() => toggle(item.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  padding: '1.1rem 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontFamily: UI, fontSize: '0.92rem', fontWeight: 500, color: C.charcoal, lineHeight: 1.4 }}>
                  {item.q}
                </span>
                <span style={{
                  color: C.gold,
                  flexShrink: 0,
                  transition: 'transform 0.2s ease',
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  lineHeight: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
              {open && (
                <div style={{ padding: '0 0 1.25rem', fontFamily: UI, fontSize: '0.9rem', color: 'rgba(43,35,32,0.65)', lineHeight: 1.7 }}>
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Help() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNum, setOrderNum] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const toggle = (id: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredSections = FAQ_SECTIONS.map(sec => ({
    ...sec,
    items: searchQuery
      ? sec.items.filter(item =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : sec.items,
  })).filter(sec => sec.items.length > 0);

  const inputBase: React.CSSProperties = {
    width: '100%',
    border: `1px solid rgba(43,35,32,0.15)`,
    borderRadius: '7px',
    padding: '0.65rem 0.875rem',
    fontFamily: UI,
    fontSize: '0.875rem',
    color: C.charcoal,
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(43,35,32,0.02)',
    transition: 'border-color 0.12s',
  };

  return (
    <div style={{ backgroundColor: C.cream, paddingBottom: '6rem' }}>

      {/* ── Header ───────────────────────────────────────── */}
      <div style={{ backgroundColor: '#fff', borderBottom: `1px solid rgba(43,35,32,0.08)`, padding: '4.5rem 2.5rem 3rem' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.18em', marginBottom: '0.875rem' }}>
            Help Centre
          </div>
          <h1 style={{ fontFamily: DISPLAY, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.75rem' }}>
            Help & Support
          </h1>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '560px', margin: '0 auto' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(43,35,32,0.35)', lineHeight: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for help topics…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                ...inputBase,
                paddingLeft: '2.75rem',
                fontSize: '0.95rem',
                borderRadius: '8px',
                boxShadow: '0 2px 12px rgba(43,35,32,0.06)',
                backgroundColor: '#fff',
              }}
              onFocus={e => (e.target.style.borderColor = C.gold)}
              onBlur={e => (e.target.style.borderColor = 'rgba(43,35,32,0.15)')}
            />
          </div>
        </div>
      </div>

      {/* ── Topic category cards ──────────────────────────── */}
      {!searchQuery && (
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '3rem 2.5rem 0' }}>
          <div className="help-cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {FAQ_SECTIONS.map(sec => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.75rem 1.25rem',
                  backgroundColor: '#fff',
                  border: `1px solid rgba(43,35,32,0.08)`,
                  borderRadius: '10px',
                  textDecorationLine: 'none',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.gold; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(43,35,32,0.07)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(43,35,32,0.08)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'; }}
              >
                <div style={{ color: C.maroon }}>{sec.icon}</div>
                <span style={{ ...label, fontSize: '0.64rem', color: C.charcoal, letterSpacing: '0.12em', textAlign: 'center' }}>
                  {sec.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── FAQ Accordion ─────────────────────────────────── */}
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '4rem 2.5rem 2rem' }}>
        {searchQuery && filteredSections.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', fontFamily: UI, fontSize: '0.9rem', color: 'rgba(43,35,32,0.45)' }}>
            No results for "{searchQuery}" — try different keywords or browse the sections below.
          </div>
        )}
        {filteredSections.map(sec => (
          <Accordion key={sec.id} section={sec} openItems={openItems} toggle={toggle} />
        ))}
      </div>

      {/* ── Contact block ─────────────────────────────────── */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 2.5rem 0' }}>
        <div style={{ borderTop: `1px solid rgba(43,35,32,0.08)`, paddingTop: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Still need help?
            </h2>
            <p style={{ fontFamily: UI, fontSize: '0.9rem', color: 'rgba(43,35,32,0.52)', marginTop: '0.5rem' }}>
              Our customer care team is here Monday–Friday, 9am–6pm WAT.
            </p>
          </div>

          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>

            {/* Contact form */}
            <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: `1px solid rgba(43,35,32,0.08)`, padding: '2.25rem' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ color: C.teal, marginBottom: '1rem', lineHeight: 0 }}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <p style={{ fontFamily: DISPLAY, fontSize: '1.2rem', color: C.charcoal, marginBottom: '0.5rem' }}>Message sent!</p>
                  <p style={{ fontFamily: UI, fontSize: '0.85rem', color: 'rgba(43,35,32,0.5)' }}>
                    We typically respond within 1–2 business days.
                  </p>
                  <button
                    onClick={() => { setSent(false); setName(''); setEmail(''); setOrderNum(''); setMessage(''); }}
                    style={{ ...label, fontSize: '0.64rem', marginTop: '1.5rem', backgroundColor: 'transparent', border: `1px solid rgba(43,35,32,0.2)`, borderRadius: '6px', padding: '0.55rem 1.25rem', cursor: 'pointer', color: 'rgba(43,35,32,0.55)' }}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); if (name && email && message) setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="rg-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ ...label, display: 'block', fontSize: '0.64rem', color: 'rgba(43,35,32,0.5)', marginBottom: '0.4rem' }}>Name</label>
                      <input
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Adunola Okonkwo"
                        style={inputBase}
                        onFocus={e => (e.target.style.borderColor = C.gold)}
                        onBlur={e => (e.target.style.borderColor = 'rgba(43,35,32,0.15)')}
                      />
                    </div>
                    <div>
                      <label style={{ ...label, display: 'block', fontSize: '0.64rem', color: 'rgba(43,35,32,0.5)', marginBottom: '0.4rem' }}>Email</label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={inputBase}
                        onFocus={e => (e.target.style.borderColor = C.gold)}
                        onBlur={e => (e.target.style.borderColor = 'rgba(43,35,32,0.15)')}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ ...label, display: 'block', fontSize: '0.64rem', color: 'rgba(43,35,32,0.5)', marginBottom: '0.4rem' }}>Order Number (optional)</label>
                    <input
                      value={orderNum}
                      onChange={e => setOrderNum(e.target.value)}
                      placeholder="#FTW-10492"
                      style={inputBase}
                      onFocus={e => (e.target.style.borderColor = C.gold)}
                      onBlur={e => (e.target.style.borderColor = 'rgba(43,35,32,0.15)')}
                    />
                  </div>
                  <div>
                    <label style={{ ...label, display: 'block', fontSize: '0.64rem', color: 'rgba(43,35,32,0.5)', marginBottom: '0.4rem' }}>Message</label>
                    <textarea
                      required
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Describe your question or issue…"
                      rows={5}
                      style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6 }}
                      onFocus={e => (e.target.style.borderColor = C.gold)}
                      onBlur={e => (e.target.style.borderColor = 'rgba(43,35,32,0.15)')}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      ...label,
                      backgroundColor: C.gold,
                      color: C.charcoal,
                      border: 'none',
                      borderRadius: '7px',
                      padding: '0.75rem 1.5rem',
                      cursor: 'pointer',
                      fontSize: '0.68rem',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingTop: '0.5rem' }}>
              <div>
                <div style={{ ...label, fontSize: '0.62rem', color: 'rgba(43,35,32,0.45)', letterSpacing: '0.16em', marginBottom: '0.5rem' }}>Email</div>
                <a href="mailto:support@filato.ca" style={{ fontFamily: UI, fontSize: '0.95rem', color: C.indigo, textDecorationLine: 'none', borderBottom: `1px solid rgba(46,74,158,0.25)`, paddingBottom: '1px' }}>
                  support@filato.ca
                </a>
              </div>
              <div>
                <div style={{ ...label, fontSize: '0.62rem', color: 'rgba(43,35,32,0.45)', letterSpacing: '0.16em', marginBottom: '0.5rem' }}>Response Time</div>
                <p style={{ fontFamily: UI, fontSize: '0.9rem', color: 'rgba(43,35,32,0.65)', lineHeight: 1.6 }}>
                  We typically respond within 1–2 business days. For urgent enquiries, mention "URGENT" in your subject line.
                </p>
              </div>
              <div>
                <div style={{ ...label, fontSize: '0.62rem', color: 'rgba(43,35,32,0.45)', letterSpacing: '0.16em', marginBottom: '0.5rem' }}>Hours</div>
                <p style={{ fontFamily: UI, fontSize: '0.9rem', color: 'rgba(43,35,32,0.65)', lineHeight: 1.6 }}>
                  Monday – Friday<br />9:00 AM – 6:00 PM WAT (West Africa Time)
                </p>
              </div>
              <div>
                <div style={{ ...label, fontSize: '0.62rem', color: 'rgba(43,35,32,0.45)', letterSpacing: '0.16em', marginBottom: '0.5rem' }}>Existing Customers</div>
                <p style={{ fontFamily: UI, fontSize: '0.9rem', color: 'rgba(43,35,32,0.65)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  For faster help with an existing order, log in and use your
                </p>
                <Link
                  to="/account/support"
                  style={{
                    ...label,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.64rem',
                    color: C.maroon,
                    textDecorationLine: 'none',
                    border: `1px solid rgba(122,46,56,0.3)`,
                    borderRadius: '5px',
                    padding: '0.45rem 0.875rem',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Support Inbox
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .help-cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .help-cat-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
