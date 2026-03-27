'use client';

import { GalaxyScene } from '@/widgets/galaxy-scene';

// 홈 페이지 — 전체 화면 은하 탐색 3D 장면
export function HomePage() {
  return (
    <div className="w-screen h-screen">
      <GalaxyScene />
    </div>
  );
}
