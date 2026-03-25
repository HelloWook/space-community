'use client';

import { useGalaxyNavigationStore } from '@/entities/galaxy';

// 3D 캔버스 위에 오버레이되는 뒤로가기 버튼
// galaxy 뷰 모드에서만 표시됨
export function BackButton() {
  const viewMode = useGalaxyNavigationStore((s) => s.viewMode);
  const returnToUniverse = useGalaxyNavigationStore((s) => s.returnToUniverse);

  if (viewMode !== 'galaxy') return null;

  return (
    <button
      onClick={returnToUniverse}
      style={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        padding: '8px 16px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: 14,
        backdropFilter: 'blur(4px)',
      }}
    >
      ← 우주로 돌아가기
    </button>
  );
}
