'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLocation, useNavigate } from '@/lib/router';
import AccountShell from '../components/AccountShell';
import type { AccountAddress as Address } from '@/server/account';
import { saveAddress as saveAddressAction, deleteAddress, setDefaultAddress } from '@/server/address-actions';
import { C, DISPLAY, UI, label } from '../tokens';

/* ─── Form shapes ───────────────────────────────────────────── */
type AddrForm = Omit<Address, 'id'>;

const COUNTRIES = [
  'Nigeria', 'Canada', 'United Kingdom', 'United States',
  'Ghana', 'Kenya', 'South Africa', 'France', 'Germany', 'Australia',
];

const BLANK_ADDR: AddrForm = {
  isDefault: false, name: '', line1: '', line2: '',
  city: '', state: '', postal: '', country: 'Nigeria', phone: '',
};

/* ─── Form field primitives ──────────────────────────────────── */
function FInput({ label: lbl, placeholder, type = 'text', value, onChange, required }: {
  label: string; placeholder?: string; type?: string;
  value: string; onChange: (v: string) => void; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-[1.05rem]">
      <label className="block mb-[0.38rem] uppercase font-semibold tracking-[0.1em]" style={{
        fontFamily: UI, fontSize: '0.66rem',
        color: 'rgba(43,35,32,0.52)',
      }}>
        {lbl}{required && <span style={{ color: C.maroon }}> *</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="block w-full py-2.5 px-3.5 rounded-[5px] box-border border-[1.5px] border-solid outline-none transition-colors duration-150"
        style={{
          fontFamily: UI, fontSize: '0.875rem', color: C.charcoal,
          backgroundColor: '#fff',
          borderColor: focused ? C.gold : 'rgba(43,35,32,0.18)',
        }}
      />
    </div>
  );
}

function FSelect({ label: lbl, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-[1.05rem]">
      <label className="block mb-[0.38rem] uppercase font-semibold tracking-[0.1em]" style={{
        fontFamily: UI, fontSize: '0.66rem',
        color: 'rgba(43,35,32,0.52)',
      }}>
        {lbl}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="block w-full py-2.5 px-3.5 pr-10 rounded-[5px] box-border cursor-pointer appearance-none border-[1.5px] border-solid outline-none transition-colors duration-150 bg-no-repeat"
        style={{
          fontFamily: UI, fontSize: '0.875rem', color: C.charcoal,
          backgroundColor: '#fff',
          borderColor: focused ? C.gold : 'rgba(43,35,32,0.18)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(43,35,32,0.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.875rem center',
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FCheckbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-[15px] h-[15px] shrink-0 cursor-pointer"
        style={{ accentColor: C.gold }}
      />
      <span className="leading-[1.4]" style={{ fontFamily: UI, fontSize: '0.82rem', color: C.charcoal }}>{children}</span>
    </label>
  );
}

/* ─── Slide-over shell ───────────────────────────────────────── */
function SlideOver({ title, onClose, onSave, saveLabel, children }: {
  title: string; onClose: () => void; onSave: () => void; saveLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-stretch">
      <div
        onClick={onClose}
        className="flex-1 cursor-pointer bg-[rgba(43,35,32,0.42)] backdrop-blur-[3px]"
      />
      <div className="w-[min(520px,92vw)] flex flex-col shadow-[-16px_0_56px_rgba(43,35,32,0.18)]" style={{
        backgroundColor: C.cream,
      }}>
        {/* Header */}
        <div className="py-7 px-8 flex items-center justify-between shrink-0 border-b border-solid border-[rgba(43,35,32,0.1)]">
          <h2 className="font-medium tracking-[-0.01em] leading-[1.2]" style={{
            fontFamily: DISPLAY, fontSize: '1.375rem',
            color: C.charcoal,
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-[6px] rounded-[4px] cursor-pointer bg-none border-none leading-none transition-colors duration-150"
            style={{
              color: 'rgba(43,35,32,0.38)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = C.charcoal)}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(43,35,32,0.38)')}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 py-7 px-8 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        <div className="py-5 px-8 flex gap-3 shrink-0 border-t border-solid border-[rgba(43,35,32,0.1)] bg-white">
          <button
            onClick={onSave}
            className="flex-1 py-[0.8rem] px-5 rounded-[5px] cursor-pointer uppercase font-bold tracking-[0.1em] border-none shadow-[0_2px_14px_rgba(212,169,78,0.38)] transition-opacity duration-150"
            style={{
              backgroundColor: C.gold, color: C.charcoal,
              fontFamily: UI, fontSize: '0.7rem',
            }}
          >
            {saveLabel}
          </button>
          <button
            onClick={onClose}
            className="py-[0.8rem] px-[1.125rem] rounded-[5px] cursor-pointer uppercase font-semibold tracking-[0.08em] bg-transparent border-[1.5px] border-solid border-[rgba(43,35,32,0.2)] transition-colors duration-150"
            style={{
              color: 'rgba(43,35,32,0.52)',
              fontFamily: UI, fontSize: '0.7rem',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.charcoal; e.currentTarget.style.color = C.charcoal; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(43,35,32,0.2)'; e.currentTarget.style.color = 'rgba(43,35,32,0.52)'; }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Address slide-over form ────────────────────────────────── */
function AddressSlideOver({ initial, isEdit, onSave, onClose }: {
  initial: AddrForm; isEdit: boolean; onSave: (d: AddrForm) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<AddrForm>(initial);
  const set = <K extends keyof AddrForm>(k: K) => (v: AddrForm[K]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <SlideOver
      title={isEdit ? 'Edit Address' : 'Add New Address'}
      onClose={onClose}
      onSave={() => onSave(form)}
      saveLabel="Save Address"
    >
      <FInput label="Full Name" value={form.name} onChange={set('name')} required />
      <FInput label="Address Line 1" value={form.line1} onChange={set('line1')} required />
      <FInput label="Address Line 2" placeholder="Apartment, suite, etc. (optional)" value={form.line2} onChange={set('line2')} />
      <div className="rg-2 grid grid-cols-2 gap-x-3">
        <FInput label="City" value={form.city} onChange={set('city')} required />
        <FInput label="State / Province" value={form.state} onChange={set('state')} required />
      </div>
      <div className="rg-2 grid grid-cols-2 gap-x-3">
        <FInput label="Postal / ZIP" value={form.postal} onChange={set('postal')} required />
        <FSelect label="Country" value={form.country} onChange={set('country')} options={COUNTRIES} />
      </div>
      <FInput label="Phone Number" type="tel" placeholder="+1 000 000 0000" value={form.phone} onChange={set('phone')} required />
      <div className="pt-3 mt-1 border-t border-solid border-[rgba(43,35,32,0.08)]">
        <FCheckbox checked={form.isDefault} onChange={v => set('isDefault')(v)}>
          Set as default shipping address
        </FCheckbox>
      </div>
    </SlideOver>
  );
}

/* ─── Address card ───────────────────────────────────────────── */
function AddressCard({ addr, onEdit, onDelete, onSetDefault }: {
  addr: Address; onEdit: () => void; onDelete: () => void; onSetDefault: () => void;
}) {
  return (
    <div className="rounded-lg p-[1.375rem] flex flex-col bg-white border border-solid border-[rgba(43,35,32,0.11)] shadow-[0_1px_8px_rgba(43,35,32,0.05)]">
      {/* Default badge — same height whether visible or not */}
      <div className="h-[22px] mb-3 flex items-center">
        {addr.isDefault && (
          <span className="inline-block py-[2px] px-2 rounded-[3px] tracking-[0.12em]" style={{
            ...label, fontSize: '0.58rem',
            backgroundColor: C.gold, color: C.charcoal,
          }}>
            Default
          </span>
        )}
      </div>

      <div className="mb-[0.4rem] font-semibold" style={{ fontFamily: UI, fontSize: '0.875rem', color: C.charcoal }}>
        {addr.name}
      </div>
      <div className="flex-1 leading-[1.72]" style={{ fontFamily: UI, fontSize: '0.8rem', color: 'rgba(43,35,32,0.6)' }}>
        {addr.line1}
        {addr.line2 && <><br />{addr.line2}</>}
        <br />{addr.city}, {addr.state} {addr.postal}
        <br />{addr.country}
        <br />{addr.phone}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-[0.875rem] mt-[1.125rem] pt-[0.875rem] border-t border-solid border-[rgba(43,35,32,0.07)]">
        <TextBtn color={C.indigo} onClick={onEdit}>Edit</TextBtn>
        {!addr.isDefault && (
          <>
            <TextBtn color="rgba(43,35,32,0.42)" hoverColor={C.charcoal} onClick={onSetDefault}>
              Set Default
            </TextBtn>
            <TextBtn color="rgba(185,45,45,0.65)" hoverColor="#b92d2d" onClick={onDelete} right>
              Delete
            </TextBtn>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Add new (dashed) card ──────────────────────────────────── */
function AddNewCard({ text, onClick }: { text: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex flex-col items-center justify-center gap-[0.6rem] py-11 px-4 w-full rounded-lg cursor-pointer border-[1.5px] border-dashed transition-colors duration-150"
      style={{
        backgroundColor: hov ? 'rgba(43,35,32,0.03)' : 'transparent',
        borderColor: hov ? 'rgba(43,35,32,0.5)' : 'rgba(43,35,32,0.25)',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={hov ? C.charcoal : 'rgba(43,35,32,0.32)'} strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span className="uppercase font-semibold tracking-[0.09em] transition-colors duration-150" style={{
        fontFamily: UI, fontSize: '0.72rem',
        color: hov ? C.charcoal : 'rgba(43,35,32,0.4)',
      }}>
        {text}
      </span>
    </button>
  );
}

/* ─── Shared text button ─────────────────────────────────────── */
function TextBtn({ color, hoverColor, onClick, right, children }: {
  color: string; hoverColor?: string; onClick: () => void; right?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-0 cursor-pointer bg-none border-none font-semibold transition-colors duration-150 ${right ? 'ml-auto' : ''}`}
      style={{
        fontFamily: UI, fontSize: '0.77rem',
        color,
      }}
      onMouseEnter={e => { if (hoverColor) e.currentTarget.style.color = hoverColor; }}
      onMouseLeave={e => { if (hoverColor) e.currentTarget.style.color = color; }}
    >
      {children}
    </button>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function AddressesPayment({
  initialAddresses = [],
}: {
  initialAddresses?: Address[];
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeTab: 'addresses' | 'payment' = pathname.includes('/payment') ? 'payment' : 'addresses';

  const router = useRouter();
  const [, startTransition] = useTransition();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);

  // Reconcile with the server after each save: the route re-runs, the fresh
  // rows arrive as props (with their real database ids), and local state adopts
  // them — replacing the optimistic placeholders shown a moment earlier.
  useEffect(() => { setAddresses(initialAddresses); }, [initialAddresses]);

  // Modal state: null=closed, 'add'=new, an id string=editing that address
  const [addrModal, setAddrModal] = useState<'add' | string | null>(null);
  const isEditingAddr = addrModal !== null && addrModal !== 'add';

  /* Address actions — optimistic locally, then persisted and reconciled */
  function saveAddress(data: AddrForm) {
    const editingId = isEditingAddr ? (addrModal as string) : undefined;

    if (addrModal === 'add') {
      const newAddr: Address = { id: `tmp-${Date.now()}`, ...data };
      setAddresses(prev =>
        data.isDefault
          ? [...prev.map(a => ({ ...a, isDefault: false })), newAddr]
          : [...prev, newAddr]
      );
    } else if (editingId) {
      setAddresses(prev =>
        prev.map(a => {
          if (a.id === editingId) return { ...a, ...data };
          return data.isDefault ? { ...a, isDefault: false } : a;
        })
      );
    }
    setAddrModal(null);

    startTransition(async () => {
      const res = await saveAddressAction({ ...data, id: editingId });
      if (!res.ok) { alert(res.message); router.refresh(); return; }
      router.refresh();
    });
  }

  function deleteAddr(id: string) {
    setAddresses(prev => prev.filter(a => a.id !== id));
    startTransition(async () => {
      const res = await deleteAddress(id);
      if (!res.ok) alert(res.message);
      router.refresh();
    });
  }

  function makeDefaultAddr(id: string) {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    startTransition(async () => {
      const res = await setDefaultAddress(id);
      if (!res.ok) alert(res.message);
      router.refresh();
    });
  }

  const editingAddr = isEditingAddr
    ? addresses.find(a => a.id === addrModal)
    : undefined;

  return (
    <AccountShell>
      <style>{`
        .ap-tab { position: relative; }
        .ap-tab::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 2px;
          background: ${C.gold};
          transform: scaleX(0);
          transition: transform 0.22s ease;
          transform-origin: left;
        }
        .ap-tab.active::after { transform: scaleX(1); }
        .addr-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 720px) {
          .addr-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Page title */}
      <div className="mb-[1.375rem]">
        <h1 className="font-medium tracking-[-0.01em] leading-[1.1]" style={{
          fontFamily: DISPLAY, fontSize: '2rem',
          color: C.charcoal,
        }}>
          Addresses &amp; Payment Methods
        </h1>
      </div>

      {/* Sub-tabs */}
      <div className="flex mb-8 border-b border-solid border-[rgba(43,35,32,0.12)]">
        {(['addresses', 'payment'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => navigate(tab === 'addresses' ? '/account/addresses' : '/account/payment')}
            className={`ap-tab${activeTab === tab ? ' active font-bold' : ' font-medium'} py-[0.6rem] px-[1.375rem] pb-[0.85rem] cursor-pointer uppercase tracking-[0.11em] bg-none border-none transition-colors duration-150`}
            style={{
              fontFamily: UI, fontSize: '0.7rem',
              color: activeTab === tab ? C.charcoal : 'rgba(43,35,32,0.42)',
            }}
          >
            {tab === 'addresses' ? 'Addresses' : 'Payment Methods'}
          </button>
        ))}
      </div>

      {/* ── Addresses tab ───────────────────────────────────────── */}
      {activeTab === 'addresses' && (
        <div className="addr-grid">
          {addresses.map(addr => (
            <AddressCard
              key={addr.id}
              addr={addr}
              onEdit={() => setAddrModal(addr.id)}
              onDelete={() => deleteAddr(addr.id)}
              onSetDefault={() => makeDefaultAddr(addr.id)}
            />
          ))}
          <AddNewCard text="Add New Address" onClick={() => setAddrModal('add')} />
        </div>
      )}

      {/* ── Payment Methods tab ─────────────────────────────────── */}
      {activeTab === 'payment' && (
        <div className="rounded-lg bg-white border border-solid border-[rgba(43,35,32,0.11)] p-7">
          <h2 className="mb-2" style={{ fontFamily: DISPLAY, fontSize: '1.35rem', color: C.charcoal }}>Secure payment at checkout</h2>
          <p className="m-0" style={{ fontFamily: UI, fontSize: '0.875rem', lineHeight: 1.7, color: C.charcoal }}>
            Payment instructions appear when you place an order. If online card checkout is available, you enter your details on the payment provider’s secure page. We do not collect card numbers or CVCs in your account.
          </p>
        </div>
      )}

      {/* ── Slide-overs ──────────────────────────────────────────── */}
      {addrModal !== null && (
        <AddressSlideOver
          initial={editingAddr ? { ...editingAddr } : { ...BLANK_ADDR }}
          isEdit={isEditingAddr}
          onSave={saveAddress}
          onClose={() => setAddrModal(null)}
        />
      )}

    </AccountShell>
  );
}
