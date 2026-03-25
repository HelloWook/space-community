'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import {
  useGalaxyNavigationStore,
  useGalaxies,
  Galaxy3D,
} from '@/entities/galaxy';
import { usePlanets, Planet3D } from '@/entities/planet';
import {
  useCameraTransition,
  BackButton,
} from '@/features/navigate-galaxy';

// 3D 장면 내부 컨텐츠 — R3F 컨텍스트 안에서 렌더링
function SceneContent() {
  const viewMode = useGalaxyNavigationStore((s) => s.viewMode);
  const selectedGalaxyId = useGalaxyNavigationStore((s) => s.selectedGalaxyId);
  const selectGalaxy = useGalaxyNavigationStore((s) => s.selectGalaxy);

  const { data: galaxies } = useGalaxies();
  const { data: planetsResponse } = usePlanets(selectedGalaxyId);

  // 선택된 은하의 위치 정보
  const selectedGalaxy = galaxies?.find((g) => g.id === selectedGalaxyId);

  // 카메라 전환 훅
  const { isTransitioning } = useCameraTransition({
    viewMode,
    targetPosition: selectedGalaxy?.position ?? null,
  });

  return (
    <>
      {/* 어두운 우주 배경 */}
      <color attach="background" args={['#050510']} />
      {/* 기본 조명 */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      {/* 줌/회전 — 전환 중에는 비활성화 */}
      <OrbitControls
        enableDamping
        enableZoom
        enableRotate
        enabled={!isTransitioning}
      />

      {/* 우주 뷰: 모든 은하 렌더링 */}
      {viewMode === 'universe' &&
        galaxies?.map((galaxy) => (
          <Galaxy3D
            key={galaxy.id}
            galaxy={galaxy}
            onClick={() => selectGalaxy(galaxy.id)}
            isSelected={false}
          />
        ))}

      {/* 은하 뷰: 선택된 은하의 행성들 렌더링 */}
      {viewMode === 'galaxy' &&
        planetsResponse?.data?.map((planet) => (
          <Planet3D
            key={planet.id}
            planet={planet}
            onClick={() => {
              // TODO: 행성 상세 네비게이션 (추후 구현)
            }}
          />
        ))}
    </>
  );
}

// 메인 은하 탐색 3D 씬 위젯
export function GalaxyScene() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 60 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>

      {/* 캔버스 위 오버레이 UI */}
      <BackButton />
    </div>
  );
}
