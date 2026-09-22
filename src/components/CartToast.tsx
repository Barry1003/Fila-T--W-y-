'use client';

import { useCart } from '@/lib/cart';
import { C, UI } from '../tokens';
import { Link } from '@/lib/router';

export default function CartToast() {
  const { lastAdded } = useCart();
  if (!lastAdded) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 p-4 flex gap-4 items-center shadow-lg rounded" 
      style={{ 
        backgroundColor: C.cream, 
        border: `1px solid ${C.gold}`,
        zIndex: 100, 
        fontFamily: UI,
        width: '320px',
        animation: 'pdp-img-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <div className="w-12 h-16 shrink-0 bg-[#ddd5c8]">
        <img src={lastAdded.imageUrl} alt="" className="w-full h-full object-cover block" />
      </div>
      <div className="flex flex-col flex-1 min-w-0 justify-center">
        <span style={{ fontSize: '0.75rem', color: C.charcoal, fontWeight: 600 }}>Added to Cart</span>
        <span style={{ fontSize: '0.85rem', color: C.charcoal, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lastAdded.title}</span>
        <span style={{ fontSize: '0.7rem', color: 'rgba(43,35,32,0.6)' }}>{lastAdded.size} {lastAdded.color ? `· ${lastAdded.color}` : ''}</span>
      </div>
      <Link 
        to="/cart" 
        className="shrink-0 px-3 py-2 cursor-pointer no-underline rounded"
        style={{ backgroundColor: C.charcoal, color: C.cream, fontSize: '0.7rem', fontWeight: 600 }}
      >
        View
      </Link>
    </div>
  );
}
