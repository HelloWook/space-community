'use client';

import { useGalaxyNavigationStore } from '@/entities/galaxy';
import { Button } from '@/shared/ui/shadcn/button';

// 3D 캔버스 위에 오버레이되는 뒤로가기 버튼
// galaxy 뷰 모드에서만 표시됨
export function BackButton() {
  const viewMode = useGalaxyNavigationStore((s) => s.viewMode);
  const returnToUniverse = useGalaxyNavigationStore((s) => s.returnToUniverse);

  if (viewMode !== 'galaxy') return null;

  return (
    <Button
      variant="outline"
      onClick={returnToUniverse}
      className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm border-white/20 text-foreground hover:bg-black/80"
    >
      ← 우주로 돌아가기
    </Button>
  );
}
