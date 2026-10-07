'use client';

import { Link } from '@/lib/router';
import { C, DISPLAY, UI, label } from '../tokens';
import { ShieldIcon } from '../icons';

export default function EscrowProtection() {
  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh', color: C.charcoal }}>
      {/* ── HERO SECTION ── */}
      <section className="text-center py-24 md:py-32 px-6" style={{ backgroundColor: 'rgba(122,46,56,0.035)' }}>
        <div className="max-w-[1440px] mx-auto">
          <span className="block mb-6" style={{ ...label, color: C.maroon, letterSpacing: '0.2em' }}>
            Trust & Safety
          </span>
          <h1 className="mb-8" style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400, letterSpacing: '-0.02em', color: C.charcoal }}>
            Peace of Mind Protection
          </h1>
          <p className="max-w-xl mx-auto text-lg leading-relaxed font-light" style={{ fontFamily: UI, color: 'rgba(43,35,32,0.7)' }}>
            We hold your payment securely until your order is delivered. Shop African luxury fashion with complete confidence.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS SECTION ── */}
      <section className="py-24 px-6 bg-white" style={{ backgroundColor: '#fff', borderTop: '1px solid rgba(43,35,32,0.08)', borderBottom: '1px solid rgba(43,35,32,0.08)' }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-px" style={{ backgroundColor: 'rgba(43,35,32,0.08)', zIndex: 0 }}></div>
            
            <div className="pt-8 relative bg-white" style={{ zIndex: 1 }}>
              <span className="block mb-6" style={{ fontFamily: DISPLAY, fontSize: '4rem', color: 'rgba(43,35,32,0.05)', lineHeight: 1 }}>01</span>
              <h3 className="mb-4" style={{ fontFamily: DISPLAY, fontSize: '1.25rem', color: C.charcoal }}>You Pay</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: UI, color: 'rgba(43,35,32,0.6)' }}>
                When you place an order, your payment is processed securely but <strong style={{ color: C.charcoal, fontWeight: 500 }}>held by us</strong>. The money stays safe in our escrow vault.
              </p>
            </div>
            
            <div className="pt-8 relative bg-white" style={{ zIndex: 1 }}>
              <span className="block mb-6" style={{ fontFamily: DISPLAY, fontSize: '4rem', color: 'rgba(43,35,32,0.05)', lineHeight: 1 }}>02</span>
              <h3 className="mb-4" style={{ fontFamily: DISPLAY, fontSize: '1.25rem', color: C.charcoal }}>We Ship</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: UI, color: 'rgba(43,35,32,0.6)' }}>
                Your order is carefully crafted and fulfilled. We ship your items and provide valid tracking numbers within the agreed timeframe.
              </p>
            </div>
            
            <div className="pt-8 relative bg-white" style={{ zIndex: 1 }}>
              <span className="block mb-6" style={{ fontFamily: DISPLAY, fontSize: '4rem', color: 'rgba(43,35,32,0.05)', lineHeight: 1 }}>03</span>
              <h3 className="mb-4" style={{ fontFamily: DISPLAY, fontSize: '1.25rem', color: C.charcoal }}>Funds Released</h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: UI, color: 'rgba(43,35,32,0.6)' }}>
                Only after you confirm delivery (or 48 hours after verified delivery) do the funds clear. If there's an issue, we freeze the payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ & CTA SECTION ── */}
      <section className="py-24 px-6" style={{ backgroundColor: C.cream }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="rg-split gap-16 md:gap-24 items-start" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            
            {/* FAQ */}
            <div className="flex-1">
              <h2 className="mb-8" style={{ fontFamily: DISPLAY, fontSize: 'clamp(1.875rem, 3.2vw, 2.75rem)', fontWeight: 400, color: C.charcoal }}>
                Common Questions
              </h2>
              <div className="space-y-10">
                <div>
                  <h4 className="mb-2" style={{ ...label, fontSize: '0.7rem', color: C.charcoal }}>What if my order never arrives?</h4>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: UI, color: 'rgba(43,35,32,0.7)' }}>
                    If the package is lost in transit, your funds are returned to you in full. You never pay for items you don't receive.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2" style={{ ...label, fontSize: '0.7rem', color: C.charcoal }}>What if the item is damaged?</h4>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: UI, color: 'rgba(43,35,32,0.7)' }}>
                    You have a 48-hour window after delivery to raise a dispute. Raise a dispute within this time, and we will hold the funds while we investigate and arrange a replacement or refund.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2" style={{ ...label, fontSize: '0.7rem', color: C.charcoal }}>How does it work?</h4>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: UI, color: 'rgba(43,35,32,0.7)' }}>
                    Log in to your account, go to "My Orders", and click "Confirm Delivery". If you forget, our system auto-releases funds 48 hours after carrier confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col justify-center max-w-[400px] w-full mt-12 md:mt-0">
              <div className="p-10 text-center" style={{ backgroundColor: '#fff', border: '1px solid rgba(43,35,32,0.08)' }}>
                <div className="flex justify-center mb-6 text-teal-600" style={{ color: C.teal }}>
                  <ShieldIcon />
                </div>
                <h3 className="mb-4" style={{ fontFamily: DISPLAY, fontSize: '1.5rem', color: C.charcoal }}>Ready to shop?</h3>
                <p className="mb-8 text-sm mx-auto" style={{ fontFamily: UI, color: 'rgba(43,35,32,0.6)', maxWidth: '240px' }}>
                  Explore our curated collection of authentic African fashion, backed by our promise.
                </p>
                <Link 
                  to="/shop" 
                  className="inline-block py-4 px-10 no-underline transition-colors" 
                  style={{ backgroundColor: C.charcoal, color: C.cream, ...label, fontSize: '0.7rem' }}
                >
                  Start Shopping
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
