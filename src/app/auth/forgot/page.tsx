import { Suspense } from 'react';
import AuthForgot from '@/views/AuthForgot';

// useSearchParams needs a boundary or the route opts out of prerendering.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuthForgot />
    </Suspense>
  );
}
