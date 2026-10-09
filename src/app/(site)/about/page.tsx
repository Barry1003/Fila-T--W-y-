import About from '@/views/About';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Discover the people, craft and Yoruba heritage behind AdeClassics.',
};

export default function Page() {
  return <About />;
}
