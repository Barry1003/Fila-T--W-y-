'use client';

import { Link } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';

const steps = [
  { number: '01', heading: 'Place your order', body: 'We record the items, shipping details and price before payment begins.' },
  { number: '02', heading: 'Pay securely', body: 'When online checkout is available, Stripe handles card payment on its hosted checkout page. Otherwise, we confirm the order and email payment instructions.' },
  { number: '03', heading: 'Stay informed', body: 'You can follow your order in your account and contact our team if you need help.' },
];

export default function EscrowProtection() {
  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh', color: C.charcoal }}>
      <section className="text-center py-24 px-6" style={{ backgroundColor: 'rgba(122,46,56,0.035)' }}>
        <div className="max-w-[900px] mx-auto">
          <span className="block mb-6" style={{ ...label, color: C.maroon, letterSpacing: '0.2em' }}>Orders &amp; Payments</span>
          <h1 className="mb-8" style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400, color: C.charcoal }}>A clear way to shop</h1>
          <p className="max-w-xl mx-auto text-lg leading-relaxed" style={{ fontFamily: UI, color: 'rgba(43,35,32,0.7)' }}>
            Your order details are confirmed before you pay. We explain the payment step at checkout and remain available if you need help with an order.
          </p>
        </div>
      </section>
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto rg-3 grid grid-cols-3 gap-8">
          {steps.map(step => (
            <div key={step.number} className="p-7" style={{ border: '1px solid rgba(43,35,32,0.1)' }}>
              <span className="block mb-5" style={{ fontFamily: DISPLAY, fontSize: '2.5rem', color: C.gold }}>{step.number}</span>
              <h2 className="mb-3" style={{ fontFamily: DISPLAY, fontSize: '1.35rem', fontWeight: 400 }}>{step.heading}</h2>
              <p className="m-0 text-sm leading-relaxed" style={{ fontFamily: UI, color: 'rgba(43,35,32,0.7)' }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-20 px-6 text-center">
        <h2 className="mb-4" style={{ fontFamily: DISPLAY, fontSize: '2rem', fontWeight: 400 }}>Need help with an order?</h2>
        <p className="mb-7" style={{ fontFamily: UI, color: 'rgba(43,35,32,0.7)' }}>Send us your order number and we will help you with the next step.</p>
        <Link to="/help" className="inline-block py-4 px-9 no-underline" style={{ backgroundColor: C.charcoal, color: C.cream, ...label, fontSize: '0.7rem' }}>Contact support</Link>
      </section>
    </div>
  );
}
