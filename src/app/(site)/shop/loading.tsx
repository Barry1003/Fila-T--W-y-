/**
 * Shown while the shop's catalogue query runs — so a cold database start shows a
 * branded skeleton grid rather than a blank page.
 */
export default function ShopLoading() {
  return (
    <div className="skeleton-page" aria-hidden="true">
      {/* Promo banner */}
      <div className="skeleton" style={{ height: 300, borderRadius: 12, marginBottom: '2rem' }} />

      {/* Result count */}
      <div className="skeleton" style={{ height: 26, width: 200, marginBottom: '1.5rem' }} />

      {/* Product grid */}
      <div className="shop-grid grid grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton aspect-[3/4]" style={{ marginBottom: '1rem' }} />
            <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: '0.5rem' }} />
            <div className="skeleton" style={{ height: 14, width: '40%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
