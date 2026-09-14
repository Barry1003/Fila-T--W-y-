/**
 * Shown while a product loads — the two-column layout in skeleton form, so a
 * cold database start does not flash a blank page.
 */
export default function ProductLoading() {
  return (
    <div className="skeleton-page" aria-hidden="true">
      <div className="pdp-grid grid grid-cols-2 gap-20 items-start">
        {/* Gallery */}
        <div>
          <div className="skeleton aspect-[4/5]" style={{ marginBottom: '0.875rem' }} />
          <div className="flex gap-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton flex-1 aspect-square" />
            ))}
          </div>
        </div>

        {/* Detail */}
        <div>
          <div className="skeleton" style={{ height: 18, width: 120, marginBottom: '1rem' }} />
          <div className="skeleton" style={{ height: 40, width: '75%', marginBottom: '1rem' }} />
          <div className="skeleton" style={{ height: 30, width: 130, marginBottom: '2rem' }} />
          <div className="skeleton" style={{ height: 14, marginBottom: '0.75rem' }} />
          <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: '0.75rem' }} />
          <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: '2rem' }} />
          <div className="skeleton" style={{ height: 52, borderRadius: 8, marginBottom: '1rem' }} />
          <div className="skeleton" style={{ height: 52, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}
