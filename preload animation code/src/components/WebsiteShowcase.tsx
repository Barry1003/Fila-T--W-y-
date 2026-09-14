import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Award,
  ChevronRight,
  MapPin,
  Calendar,
  CheckCircle,
  Gem,
  Clock,
  Scissors,
} from 'lucide-react';
import { PageId } from '../types';

interface WebsiteShowcaseProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onTriggerReload: () => void;
}

export const WebsiteShowcase: React.FC<WebsiteShowcaseProps> = ({
  currentPage,
  onNavigate,
  onTriggerReload,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#0f0407] text-[#f7f2e7] flex flex-col selection:bg-[#d4af37] selection:text-[#2c060d]">
      {/* Luxury Brand Header Bar */}
      <div className="bg-[#24060d] border-b border-[#d4af37]/20 py-1.5 px-4 text-center">
        <p className="font-cormorant italic text-xs tracking-widest text-[#fae5a2]">
          Bespoke Appointments Now Open for London, Paris & New York Ateliers
        </p>
      </div>

      {/* Main Luxury Navigation */}
      <nav className="border-b border-[#d4af37]/15 bg-[#170509]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full border border-[#d4af37]/60 flex items-center justify-center bg-[#420912] group-hover:border-[#d4af37] transition-all">
              <span className="font-cinzel text-xs font-bold text-[#f7e096]">AC</span>
            </div>
            <div>
              <span className="font-cinzel text-lg tracking-widest font-semibold gold-gradient-text block">
                AdeClassics
              </span>
              <span className="font-cormorant italic text-[10px] text-[#d8c290]/70 tracking-widest block -mt-1">
                Timeless Elegance
              </span>
            </div>
          </button>

          {/* Navigation links - each calls onNavigate which triggers the preloader */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className={`font-montserrat text-xs tracking-[0.2em] uppercase transition-colors cursor-pointer ${
                currentPage === 'home' ? 'text-[#f7e096] font-semibold border-b border-[#d4af37]' : 'text-[#c7b293] hover:text-[#fae5a2]'
              }`}
            >
              The Maison
            </button>
            <button
              type="button"
              onClick={() => onNavigate('collections')}
              className={`font-montserrat text-xs tracking-[0.2em] uppercase transition-colors cursor-pointer ${
                currentPage === 'collections' ? 'text-[#f7e096] font-semibold border-b border-[#d4af37]' : 'text-[#c7b293] hover:text-[#fae5a2]'
              }`}
            >
              Collections
            </button>
            <button
              type="button"
              onClick={() => onNavigate('bespoke')}
              className={`font-montserrat text-xs tracking-[0.2em] uppercase transition-colors cursor-pointer ${
                currentPage === 'bespoke' ? 'text-[#f7e096] font-semibold border-b border-[#d4af37]' : 'text-[#c7b293] hover:text-[#fae5a2]'
              }`}
            >
              Bespoke Tailoring
            </button>
            <button
              type="button"
              onClick={() => onNavigate('heritage')}
              className={`font-montserrat text-xs tracking-[0.2em] uppercase transition-colors cursor-pointer ${
                currentPage === 'heritage' ? 'text-[#f7e096] font-semibold border-b border-[#d4af37]' : 'text-[#c7b293] hover:text-[#fae5a2]'
              }`}
            >
              Heritage 1892
            </button>
            <button
              type="button"
              onClick={() => onNavigate('atelier')}
              className={`font-montserrat text-xs tracking-[0.2em] uppercase transition-colors cursor-pointer ${
                currentPage === 'atelier' ? 'text-[#f7e096] font-semibold border-b border-[#d4af37]' : 'text-[#c7b293] hover:text-[#fae5a2]'
              }`}
            >
              Private Atelier
            </button>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={() => onNavigate('bespoke')}
            className="px-4 py-2 border border-[#d4af37]/70 text-[#fcedaa] font-cinzel text-xs uppercase tracking-widest hover:bg-[#d4af37]/15 transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)] cursor-pointer"
          >
            Book Fitting
          </button>
        </div>
      </nav>

      {/* Interactive Helper Banner */}
      <div className="bg-[#2a0b12]/70 border-b border-[#d4af37]/25 px-4 py-2 text-center flex items-center justify-center gap-3">
        <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0" />
        <p className="text-xs text-[#ebd8b2] font-montserrat">
          <strong>Preloader Demonstration:</strong> Click any collection, menu item, or button below to watch the preloader trigger on page transition!
        </p>
        <button
          type="button"
          onClick={onTriggerReload}
          className="underline text-xs font-semibold text-[#f7e096] hover:text-white cursor-pointer ml-2"
        >
          Reload Page Now &rarr;
        </button>
      </div>

      {/* PAGE 1: HOME (THE GRAND MAISON) */}
      {currentPage === 'home' && (
        <div className="flex-1">
          {/* Hero section */}
          <section className="relative min-h-[68vh] flex items-center justify-center px-6 py-20 overflow-hidden bg-[radial-gradient(circle_at_center,#470c17_0%,#1f040a_70%,#0e0205_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.15)_0%,transparent_60%)] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
              <span className="inline-block px-4 py-1 border border-[#d4af37]/40 rounded-full font-cinzel text-[11px] uppercase tracking-[0.3em] text-[#fae5a2] bg-[#2a070e]/80">
                Haute Horology &amp; Bespoke Sartorial Art
              </span>

              <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight gold-gradient-text drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                Timeless Elegance.<br />
                <span className="font-cormorant italic font-normal text-3xl sm:text-5xl md:text-6xl text-[#fbf6ea]">
                  Enduring Heritage.
                </span>
              </h1>

              <p className="font-cormorant text-lg sm:text-2xl text-[#dccbb0] max-w-2xl mx-auto italic font-light leading-relaxed">
                "Where noble fabrics meet Swiss horological majesty. AdeClassics crafts rare bespoke commissions for those who appreciate absolute perfection."
              </p>

              <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('collections')}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#f7e096] to-[#aa771c] text-[#2c070e] font-cinzel font-bold text-xs uppercase tracking-[0.25em] shadow-[0_5px_25px_rgba(212,175,55,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Explore Masterpieces</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('bespoke')}
                  className="px-8 py-3.5 border border-[#d4af37]/80 text-[#fcedaa] font-cinzel text-xs uppercase tracking-[0.25em] hover:bg-[#d4af37]/15 transition-all cursor-pointer"
                >
                  The Bespoke Commission
                </button>
              </div>
            </div>
          </section>

          {/* Pillars of AdeClassics */}
          <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[#d4af37]/15">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-[#1f060c]/60 border border-[#d4af37]/20 rounded-sm hover:border-[#d4af37]/50 transition-all group">
                <Scissors className="w-8 h-8 text-[#d4af37] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-cinzel text-lg font-bold text-[#f7e096] mb-2">
                  Bespoke Savile Craft
                </h3>
                <p className="font-cormorant text-base text-[#d8c290]/80 leading-relaxed italic">
                  Every suit requires over 80 hours of hand-stitching by master tailors, utilizing pure Vicuña, cashmere, and superfine worsted wools.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('bespoke')}
                  className="mt-4 text-xs font-cinzel tracking-widest text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Discover Tailoring</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-8 bg-[#1f060c]/60 border border-[#d4af37]/20 rounded-sm hover:border-[#d4af37]/50 transition-all group">
                <Clock className="w-8 h-8 text-[#d4af37] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-cinzel text-lg font-bold text-[#f7e096] mb-2">
                  Grand Horology
                </h3>
                <p className="font-cormorant text-base text-[#d8c290]/80 leading-relaxed italic">
                  Chronometers crafted in Geneva with hand-beveled tourbillons, perpetual calendars, and solid 18-karat rose gold bezels.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('collections')}
                  className="mt-4 text-xs font-cinzel tracking-widest text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Timepieces</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-8 bg-[#1f060c]/60 border border-[#d4af37]/20 rounded-sm hover:border-[#d4af37]/50 transition-all group">
                <Gem className="w-8 h-8 text-[#d4af37] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-cinzel text-lg font-bold text-[#f7e096] mb-2">
                  Heritage Leathergoods
                </h3>
                <p className="font-cormorant text-base text-[#d8c290]/80 leading-relaxed italic">
                  Full-grain calfskin and saddle leather finished with 24-karat gold-plated hardware, aging with a lustrous natural patina.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('collections')}
                  className="mt-4 text-xs font-cinzel tracking-widest text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Leathercraft</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* Masterpiece Showcase Cards */}
          <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[#d4af37]/15">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#d4af37]">
                  The Signature Collection
                </span>
                <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#fae5a2] mt-2">
                  Featured Masterpieces
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('collections')}
                className="mt-4 md:mt-0 font-cinzel text-xs tracking-widest uppercase text-[#d4af37] hover:text-[#fff3ce] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Browse All 24 Pieces</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: 'tourbillon',
                  title: 'AdeClassics Sovereign Tourbillon',
                  category: 'Horology',
                  price: '€48,500',
                  desc: '18k Rose gold case, 72-hour power reserve, hand-engraved royal crest.',
                },
                {
                  id: 'vicuna',
                  title: 'Double-Breasted Vicuña Overcoat',
                  category: 'Bespoke Suiting',
                  price: '€14,800',
                  desc: '100% pure Peruvian Vicuña with hand-carved horn buttons and silk lining.',
                },
                {
                  id: 'bag',
                  title: 'The Sovereign Weekender Duffle',
                  category: 'Leathergoods',
                  price: '€4,200',
                  desc: 'Full-grain Tuscan calfskin with 24k gold-plated brass lock mechanism.',
                },
                {
                  id: 'cufflinks',
                  title: 'Imperial Medallion Cufflinks',
                  category: 'Jewellery',
                  price: '€2,650',
                  desc: 'Solid 18k yellow gold with vitreous grand feu maroon enamel and diamonds.',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1c060b] border border-[#d4af37]/25 p-5 rounded flex flex-col justify-between hover:border-[#d4af37] transition-all group"
                >
                  <div>
                    <span className="text-[10px] font-montserrat uppercase tracking-[0.2em] text-[#d4af37]">
                      {item.category}
                    </span>
                    <h4 className="font-cinzel text-base font-bold text-[#fae5a2] mt-1 group-hover:text-white transition-colors">
                      {item.title}
                    </h4>
                    <p className="font-cormorant italic text-sm text-[#d8c290]/80 mt-2 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#d4af37]/20 flex items-center justify-between">
                    <span className="font-cinzel text-sm font-semibold text-[#f7e096]">
                      {item.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('collections')}
                      className="text-xs font-montserrat uppercase tracking-wider text-[#d4af37] hover:text-white cursor-pointer"
                    >
                      Inquire &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* PAGE 2: COLLECTIONS */}
      {currentPage === 'collections' && (
        <div className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#d4af37]">
              AdeClassics Portfolio
            </span>
            <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-[#fae5a2] mt-2">
              Haute Horology &amp; Sartorial Works
            </h1>
            <p className="font-cormorant italic text-lg text-[#d8c290] mt-3">
              Each piece is produced in numbered, limited allocations to preserve the timeless exclusivity of the Maison.
            </p>
          </div>

          {/* Collection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: '1',
                title: 'The Royal Tourbillon No. 07',
                tag: 'Haute Horology',
                meta: 'Limited to 15 pieces globally',
                specs: '41mm 18k Rose Gold, 3Hz Flying Tourbillon, Hand-stitched Alligator Strap',
              },
              {
                id: '2',
                title: 'Savile Bespoke Evening Tuxedo',
                tag: 'Evening Sartorial',
                meta: 'Made to Individual Measure',
                specs: 'Super 180s Wool & Mulberry Silk Grosgrain, Hand-padded lapels',
              },
              {
                id: '3',
                title: 'Imperial Briefcase & Valise',
                tag: 'Leathercraft',
                meta: 'Handcrafted in Florence',
                specs: 'Vegetable-tanned saddle leather, English bridle handle, numbered plaque',
              },
              {
                id: '4',
                title: 'The Perpetual Calendar Gold',
                tag: 'Complications',
                meta: 'Bespoke Order Only',
                specs: 'Moonphase aperture with aventurine glass, leap year indicator, solid gold rotor',
              },
              {
                id: '5',
                title: 'Vicuña & Cashmere Greatcoat',
                tag: 'Outerwear',
                meta: 'Rare Noble Fiber',
                specs: '100% Undyed natural camel vicuña, horn buttons, full bespoke canvas',
              },
              {
                id: '6',
                title: 'AdeClassics Signet Crest Ring',
                tag: 'Jewellery',
                meta: 'Personalized Monogram',
                specs: 'Solid 18k yellow gold with hand-engraved AdeClassics AC crest',
              },
            ].map((p) => (
              <div
                key={p.id}
                className="bg-[#1f060d]/80 border border-[#d4af37]/30 p-6 rounded flex flex-col justify-between hover:border-[#d4af37] transition-all group"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-montserrat uppercase tracking-widest text-[#fae5a2] bg-[#3a0c16] border border-[#d4af37]/40 mb-3">
                    {p.tag}
                  </span>
                  <h3 className="font-cinzel text-xl font-bold text-[#fae5a2] group-hover:text-white transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs font-montserrat text-[#d4af37] mt-1">{p.meta}</p>
                  <p className="font-cormorant italic text-sm text-[#d8c290]/80 mt-3">{p.specs}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#d4af37]/20 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onNavigate('bespoke')}
                    className="px-4 py-2 border border-[#d4af37] text-xs font-cinzel uppercase tracking-widest text-[#fcedaa] hover:bg-[#d4af37]/20 transition-all cursor-pointer"
                  >
                    Request Private Viewing
                  </button>
                  <span className="font-cormorant italic text-xs text-[#d8c290]">By Appointment</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 3: BESPOKE TAILORING */}
      {currentPage === 'bespoke' && (
        <div className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
          <div className="text-center mb-12">
            <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#d4af37]">
              The Atelier Experience
            </span>
            <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-[#fae5a2] mt-2">
              Bespoke Sartorial Commission
            </h1>
            <p className="font-cormorant italic text-lg text-[#d8c290] mt-3 max-w-2xl mx-auto">
              Our Master Tailors travel worldwide to conduct private fittings in London, Paris, Zurich, and New York.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#1e070d] p-8 border border-[#d4af37]/30 rounded">
            {/* The Process */}
            <div className="space-y-6">
              <h3 className="font-cinzel text-lg font-bold text-[#f7e096] border-b border-[#d4af37]/30 pb-2">
                The Four Pillars of Commission
              </h3>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="font-cinzel text-sm font-bold text-[#d4af37] shrink-0 w-6 h-6 rounded-full border border-[#d4af37] flex items-center justify-center">
                    I
                  </span>
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-[#fcedaa]">Private Consultation</h4>
                    <p className="font-cormorant italic text-sm text-[#d8c290]">
                      Personal measurement of 36 body coordinates, posture analysis, and silhouette styling.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="font-cinzel text-sm font-bold text-[#d4af37] shrink-0 w-6 h-6 rounded-full border border-[#d4af37] flex items-center justify-center">
                    II
                  </span>
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-[#fcedaa]">Noble Cloth Selection</h4>
                    <p className="font-cormorant italic text-sm text-[#d8c290]">
                      Curated archives from Dormeuil, Loro Piana, Holland &amp; Sherry, and AdeClassics private mill reserves.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="font-cinzel text-sm font-bold text-[#d4af37] shrink-0 w-6 h-6 rounded-full border border-[#d4af37] flex items-center justify-center">
                    III
                  </span>
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-[#fcedaa]">The Baste Fitting</h4>
                    <p className="font-cormorant italic text-sm text-[#d8c290]">
                      The floating horsehair canvas is sculpted directly to your physique for flawless drape.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="font-cinzel text-sm font-bold text-[#d4af37] shrink-0 w-6 h-6 rounded-full border border-[#d4af37] flex items-center justify-center">
                    IV
                  </span>
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-[#fcedaa]">Final Delivery &amp; Monogram</h4>
                    <p className="font-cormorant italic text-sm text-[#d8c290]">
                      Hand-stitched silk AdeClassics label, personal monogram, and garment preservation case.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Request Form */}
            <div className="bg-[#2a0b12] p-6 border border-[#d4af37]/30 rounded">
              <h3 className="font-cinzel text-base font-bold text-[#f7e096] mb-4">
                Request Atelier Fitting
              </h3>

              {formSubmitted ? (
                <div className="p-6 text-center space-y-3 bg-[#1a0509] border border-[#d4af37]/40 rounded">
                  <CheckCircle className="w-10 h-10 text-[#d4af37] mx-auto" />
                  <h4 className="font-cinzel text-sm font-bold text-[#fae5a2]">
                    Appointment Request Received
                  </h4>
                  <p className="font-cormorant italic text-xs text-[#d8c290]">
                    Our concierge atelier will contact you within 24 hours to confirm your private session.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-montserrat text-[#d8c290] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Alistair Vance"
                      className="w-full bg-[#180509] border border-[#d4af37]/30 rounded px-3 py-2 text-sm text-[#fae5a2] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-montserrat text-[#d8c290] mb-1">
                      Preferred Atelier City
                    </label>
                    <select className="w-full bg-[#180509] border border-[#d4af37]/30 rounded px-3 py-2 text-sm text-[#fae5a2] focus:outline-none focus:border-[#d4af37]">
                      <option>Mayfair, London</option>
                      <option>Place Vendôme, Paris</option>
                      <option>Madison Ave, New York</option>
                      <option>Ginza, Tokyo</option>
                      <option>Private Residence Fitting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-montserrat text-[#d8c290] mb-1">
                      Commission Category
                    </label>
                    <select className="w-full bg-[#180509] border border-[#d4af37]/30 rounded px-3 py-2 text-sm text-[#fae5a2] focus:outline-none focus:border-[#d4af37]">
                      <option>Three-Piece Bespoke Suit</option>
                      <option>Haute Horology Custom Commission</option>
                      <option>Vicuña / Cashmere Overcoat</option>
                      <option>Black Tie Formal Gala Attire</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#2c070e] font-cinzel font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer mt-2"
                  >
                    Submit Private Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PAGE 4: HERITAGE */}
      {currentPage === 'heritage' && (
        <div className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
          <div className="text-center mb-12">
            <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#d4af37]">
              An Illustrious History
            </span>
            <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-[#fae5a2] mt-2">
              Heritage 1892
            </h1>
            <p className="font-cormorant italic text-lg text-[#d8c290] mt-3">
              Over a century dedicated to the relentless pursuit of timeless elegance.
            </p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-[1px] before:bg-[#d4af37]/30 before:hidden md:before:block">
            {[
              {
                year: '1892',
                title: 'The Founding Atelier',
                desc: 'Founded as a bespoke sartorial and horological salon dedicated to European royalty and discerning connoisseurs.',
              },
              {
                year: '1934',
                title: 'The Sovereign Tourbillon Patent',
                desc: 'Inventing the inverted dual-escapement cage, recognized for chronometric precision at the Geneva Observatory.',
              },
              {
                year: '1976',
                title: 'The Monogram AC & Fleur-de-Lis',
                desc: 'The timeless visual identity of AdeClassics was immortalized in fine gold relief and regal burgundy livery.',
              },
              {
                year: 'Today',
                title: 'The Modern Grand Maison',
                desc: 'Maintaining hand-stitched traditions alongside cutting-edge material science for a global family of connoisseurs.',
              },
            ].map((milestone, idx) => (
              <div
                key={milestone.year}
                className={`flex flex-col md:flex-row items-center gap-6 ${
                  idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="w-full md:w-1/2 p-6 bg-[#1f060c] border border-[#d4af37]/30 rounded">
                  <span className="font-cinzel text-2xl font-bold text-[#d4af37]">
                    {milestone.year}
                  </span>
                  <h3 className="font-cinzel text-lg font-bold text-[#fae5a2] mt-1">
                    {milestone.title}
                  </h3>
                  <p className="font-cormorant italic text-sm text-[#d8c290] mt-2">
                    {milestone.desc}
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#d4af37] border-4 border-[#24060d] shadow-[0_0_10px_#d4af37] shrink-0 hidden md:block" />
                <div className="w-full md:w-1/2 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 5: ATELIER & BOUTIQUES */}
      {currentPage === 'atelier' && (
        <div className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
          <div className="text-center mb-12">
            <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#d4af37]">
              Global Salons
            </span>
            <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-[#fae5a2] mt-2">
              Private Ateliers
            </h1>
            <p className="font-cormorant italic text-lg text-[#d8c290] mt-3">
              Experience the private salons of AdeClassics across the world's fashion capitals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                city: 'London',
                addr: '14 Savile Row, Mayfair, London W1S 3JN',
                hours: 'By Private Appointment Only',
                tel: '+44 20 7946 0912',
              },
              {
                city: 'Paris',
                addr: '28 Place Vendôme, 75001 Paris',
                hours: 'Salon Prive & Horology Gallery',
                tel: '+33 1 42 68 55 00',
              },
              {
                city: 'New York',
                addr: '740 Madison Avenue, New York, NY 10065',
                hours: 'Penthouse Fitting Suite',
                tel: '+1 212 555 0192',
              },
            ].map((loc) => (
              <div
                key={loc.city}
                className="bg-[#1f060c] border border-[#d4af37]/30 p-6 rounded hover:border-[#d4af37] transition-all"
              >
                <div className="flex items-center space-x-2 text-[#d4af37] mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-cinzel text-xs tracking-widest uppercase">Maison Flagship</span>
                </div>
                <h3 className="font-cinzel text-xl font-bold text-[#fae5a2]">{loc.city}</h3>
                <p className="font-cormorant italic text-sm text-[#d8c290] mt-2">{loc.addr}</p>
                <p className="text-xs font-montserrat text-[#e5d4b5]/80 mt-4 border-t border-[#d4af37]/20 pt-3">
                  {loc.hours}
                </p>
                <p className="text-xs font-mono text-[#d4af37] mt-1">{loc.tel}</p>
                <button
                  type="button"
                  onClick={() => onNavigate('bespoke')}
                  className="mt-4 w-full py-2 border border-[#d4af37]/50 text-[#fae5a2] text-xs font-cinzel tracking-wider hover:bg-[#d4af37]/15 transition-all cursor-pointer"
                >
                  Book Private Fitting
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Luxury Brand Footer */}
      <footer className="border-t border-[#d4af37]/20 bg-[#160408] px-6 py-12 text-center mt-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-center space-x-2">
            <span className="font-cinzel text-xl font-bold tracking-widest gold-gradient-text">
              AdeClassics
            </span>
          </div>

          <p className="font-cormorant italic text-sm text-[#d8c290]/80">
            ... Timeless Elegance
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-montserrat tracking-widest uppercase text-[#b8a280]">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-[#fae5a2] cursor-pointer"
            >
              The Maison
            </button>
            <button
              type="button"
              onClick={() => onNavigate('collections')}
              className="hover:text-[#fae5a2] cursor-pointer"
            >
              Collections
            </button>
            <button
              type="button"
              onClick={() => onNavigate('bespoke')}
              className="hover:text-[#fae5a2] cursor-pointer"
            >
              Bespoke Tailoring
            </button>
            <button
              type="button"
              onClick={() => onNavigate('heritage')}
              className="hover:text-[#fae5a2] cursor-pointer"
            >
              Heritage
            </button>
            <button
              type="button"
              onClick={() => onNavigate('atelier')}
              className="hover:text-[#fae5a2] cursor-pointer"
            >
              Ateliers
            </button>
            <button
              type="button"
              onClick={onTriggerReload}
              className="text-[#d4af37] font-semibold hover:underline cursor-pointer"
            >
              Simulate Page Reload
            </button>
          </div>

          <div className="pt-4 border-t border-[#d4af37]/10 text-[11px] text-[#8e7a5e] font-montserrat">
            &copy; {new Date().getFullYear()} AdeClassics. All rights reserved. Crafted with timeless precision.
          </div>
        </div>
      </footer>
    </div>
  );
};
