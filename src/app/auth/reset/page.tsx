import { Suspense } from 'react';
import AuthReset from '@/views/AuthReset';

// useSearchParams needs a boundary or the route opts out of prerendering.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuthReset />
    </Suspense>
  );
}
