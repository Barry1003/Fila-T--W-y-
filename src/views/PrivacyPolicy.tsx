'use client';

import { C, DISPLAY, UI, label } from '../tokens';

export default function PrivacyPolicy() {
  return (
    <div className="pb-24" style={{ backgroundColor: C.cream, minHeight: '100vh' }}>
      {/* ── Header ───────────────────────────────────────── */}
      <div className="pt-[4.5rem] px-10 pb-12" style={{ backgroundColor: '#fff', borderBottom: `1px solid rgba(43,35,32,0.08)` }}>
        <div className="max-w-[820px] mx-auto text-center">
          <div className="mb-3.5" style={{ ...label, fontSize: '0.62rem', color: C.gold, letterSpacing: '0.18em' }}>
            Legal
          </div>
          <h1 className="mb-7" style={{ fontFamily: DISPLAY, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Privacy Policy
          </h1>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="max-w-[820px] mx-auto pt-16 px-10 pb-8" style={{ fontFamily: UI, color: C.charcoal, lineHeight: 1.7 }}>
        <h2 className="mb-4" style={{ fontFamily: DISPLAY, fontSize: '1.4rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.01em' }}>
          1. Introduction
        </h2>
        <p className="mb-8" style={{ color: 'rgba(43,35,32,0.65)' }}>
          Welcome to AdeClassics. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
        </p>

        <h2 className="mb-4" style={{ fontFamily: DISPLAY, fontSize: '1.4rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.01em' }}>
          2. The data we collect about you
        </h2>
        <p className="mb-4" style={{ color: 'rgba(43,35,32,0.65)' }}>
          Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
        </p>
        <ul className="mb-8 pl-5" style={{ color: 'rgba(43,35,32,0.65)', listStyleType: 'disc' }}>
          <li className="mb-2"><strong>Identity Data</strong> includes first name, last name, username or similar identifier, title.</li>
          <li className="mb-2"><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
          <li className="mb-2"><strong>Financial Data</strong> includes payment card details (which are securely processed by our third-party payment providers).</li>
          <li className="mb-2"><strong>Transaction Data</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
        </ul>

        <h2 className="mb-4" style={{ fontFamily: DISPLAY, fontSize: '1.4rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.01em' }}>
          3. How we use your personal data
        </h2>
        <p className="mb-8" style={{ color: 'rgba(43,35,32,0.65)' }}>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: Where we need to perform the contract we are about to enter into or have entered into with you (such as processing and fulfilling your order). Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.
        </p>

        <h2 className="mb-4" style={{ fontFamily: DISPLAY, fontSize: '1.4rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.01em' }}>
          4. Data security
        </h2>
        <p className="mb-8" style={{ color: 'rgba(43,35,32,0.65)' }}>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
        </p>

        <h2 className="mb-4" style={{ fontFamily: DISPLAY, fontSize: '1.4rem', fontWeight: 500, color: C.charcoal, letterSpacing: '-0.01em' }}>
          5. Contact details
        </h2>
        <p className="mb-8" style={{ color: 'rgba(43,35,32,0.65)' }}>
          If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:Help@adeclassics.ca" className="underline" style={{ color: 'inherit' }}>Help@adeclassics.ca</a>.
        </p>
      </div>
    </div>
  );
}
