'use client';

import dynamic from 'next/dynamic';

const HomePage = dynamic(
  () => import('@/views/home/ui/HomePage').then((mod) => mod.HomePage),
  { ssr: false },
);

export default function Page() {
  return <HomePage />;
}
