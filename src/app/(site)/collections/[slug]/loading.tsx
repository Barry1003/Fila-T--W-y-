/**
 * Shown while a collection's products load — masthead plus a skeleton grid, so a
 * cold database start does not flash a blank page.
 */
export default function CollectionLoading() {
  return (
    <div aria-hidden="true">
      {/* Masthead */}
      <div className="skeleton" style={{ height: 240, borderRadius: 0 }} />

      <div className="skeleton-page">
        <div className="skeleton" style={{ height: 22, width: 160, marginBottom: '1.5rem' }} />

        <div className="collection-grid grid gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton aspect-[3/4]" style={{ marginBottom: '0.75rem' }} />
              <div className="skeleton" style={{ height: 13, width: '75%', marginBottom: '0.4rem' }} />
              <div className="skeleton" style={{ height: 13, width: '35%' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
