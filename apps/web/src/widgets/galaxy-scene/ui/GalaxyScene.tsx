'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  useGalaxyNavigationStore,
  useGalaxies,
  Galaxy3D,
} from '@/entities/galaxy';
import { usePlanets, Planet3D } from '@/entities/planet';
import { Star3D } from '@/entities/star';
import { Satellite3D } from '@/entities/satellite';
import { useCommentFocusStore } from '@/entities/comment';
import {
  Starfield,
  Meteor,
  Asteroid,
  BlackHole,
  Sun,
} from '@/entities/decoration';
import {
  useCameraTransition,
  BackButton,
} from '@/features/navigate-galaxy';
import { CreatePostForm } from '@/features/create-post';
import { CreateGalaxyForm } from '@/features/create-galaxy';
import { PostOverlay } from '@/widgets/post-overlay';
import { Overlay } from '@/widgets/overlay';
import { Button } from '@/shared/ui/shadcn/button';

interface SceneContentProps {
  /** 행성 클릭 시 호출되는 콜백 */
  onPlanetClick?: (planetId: string) => void;
  /** 현재 포커스된 댓글 ID (위성 강조용) */
  focusedCommentId?: string | null;
  /** 위성 클릭 시 댓글 포커스 콜백 */
  onSatelliteClick?: (commentId: string) => void;
}

// 3D 장면 내부 컨텐츠 — R3F 컨텍스트 안에서 렌더링
function SceneContent({ onPlanetClick, focusedCommentId, onSatelliteClick }: SceneContentProps) {
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

      {/* 우주 장식 요소 */}
      <Starfield count={1000} radius={100} />
      <Meteor startPosition={[40, 20, -10]} direction={[-1, -0.5, -0.2]} speed={0.4} />
      <Meteor startPosition={[-30, 30, 5]} direction={[0.8, -0.7, -0.1]} speed={0.6} />
      <Meteor startPosition={[20, -25, 15]} direction={[-0.5, 0.3, -0.8]} speed={0.3} />
      {Array.from({ length: 10 }, (_, i) => (
        <Asteroid
          key={`asteroid-${i}`}
          center={[
            Math.cos(i * 0.63) * 35,
            Math.sin(i * 0.97) * 15,
            Math.sin(i * 0.43) * 25,
          ]}
          orbitRadius={3 + (i % 4)}
          scale={0.2 + Math.random() * 0.6}
          orbitSpeed={0.005 + (i % 5) * 0.003}
        />
      ))}
      <BlackHole position={[30, -20, -25]} scale={3} distortionStrength={0.5} />
      <Sun position={[-25, 20, -15]} scale={2} lightIntensity={1.5} />
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

      {/* 은하 뷰: 선택된 은하의 행성들 및 주변 별 렌더링 */}
      {viewMode === 'galaxy' &&
        planetsResponse?.data?.map((planet) => (
          <group key={planet.id}>
            <Planet3D
              planet={planet}
              onClick={() => {
                onPlanetClick?.(planet.id);
              }}
            />
            {/* 행성 주변 별 렌더링 */}
            <Star3D
              count={planet.starCount}
              planetPosition={planet.position}
            />
            {/* 행성 주변 댓글 위성 렌더링 (commentCount 기반 더미 배열) */}
            <Satellite3D
              comments={Array.from({ length: planet.commentCount }, (_, i) => ({
                id: `comment-${planet.id}-${i}`,
                parentId: null,
              }))}
              planetPosition={planet.position}
              onSatelliteClick={onSatelliteClick}
              focusedCommentId={focusedCommentId}
            />
          </group>
        ))}
    </>
  );
}

// 메인 은하 탐색 3D 씬 위젯
export function GalaxyScene() {
  // 선택된 행성 ID (상세 오버레이 표시용)
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  // 게시글 작성 폼 표시 여부
  const [showCreatePost, setShowCreatePost] = useState(false);
  // 은하계 생성 폼 표시 여부
  const [showCreateGalaxy, setShowCreateGalaxy] = useState(false);

  const { isSignedIn } = useAuth();
  const router = useRouter();

  const viewMode = useGalaxyNavigationStore((s) => s.viewMode);
  const selectedGalaxyId = useGalaxyNavigationStore((s) => s.selectedGalaxyId);

  // 댓글 포커스 스토어 — 위성 클릭 ↔ 댓글 하이라이트 연동
  const focusedCommentId = useCommentFocusStore((s) => s.focusedCommentId);
  const setFocusedComment = useCommentFocusStore((s) => s.setFocusedComment);

  // 행성 클릭 핸들러
  const handlePlanetClick = useCallback((planetId: string) => {
    setSelectedPlanetId(planetId);
    setShowCreatePost(false);
  }, []);

  // 오버레이 닫기 핸들러
  const handleCloseOverlay = useCallback(() => {
    setSelectedPlanetId(null);
  }, []);

  // 게시글 작성 성공 핸들러
  const handleCreateSuccess = useCallback(() => {
    setShowCreatePost(false);
  }, []);

  // 은하계 생성 성공 핸들러
  const handleCreateGalaxySuccess = useCallback(() => {
    setShowCreateGalaxy(false);
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 60 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <SceneContent
            onPlanetClick={handlePlanetClick}
            focusedCommentId={focusedCommentId}
            onSatelliteClick={setFocusedComment}
          />
        </Suspense>
      </Canvas>

      {/* 캔버스 위 오버레이 UI */}
      <BackButton />

      {/* 우주 뷰에서 은하계 만들기 버튼 */}
      {viewMode === 'universe' && !showCreateGalaxy && (
        <Button
          onClick={() => {
            if (!isSignedIn) { router.push('/sign-in'); return; }
            setShowCreateGalaxy(true);
          }}
          className="absolute bottom-6 right-6 z-50 shadow-lg"
        >
          은하계 만들기
        </Button>
      )}

      {/* 은하계 생성 폼 오버레이 */}
      <Overlay
        open={showCreateGalaxy}
        onClose={() => setShowCreateGalaxy(false)}
        title="새 은하계"
      >
        <CreateGalaxyForm onSuccess={handleCreateGalaxySuccess} />
      </Overlay>

      {/* 은하 뷰에서 게시글 작성 버튼 */}
      {viewMode === 'galaxy' && !showCreatePost && !selectedPlanetId && (
        <Button
          onClick={() => {
            if (!isSignedIn) { router.push('/sign-in'); return; }
            setShowCreatePost(true);
          }}
          className="absolute bottom-6 right-6 z-50 shadow-lg"
        >
          게시글 작성
        </Button>
      )}

      {/* 게시글 작성 폼 오버레이 */}
      <Overlay
        open={showCreatePost && !!selectedGalaxyId}
        onClose={() => setShowCreatePost(false)}
        title="새 게시글"
      >
        {selectedGalaxyId && (
          <CreatePostForm
            galaxyId={selectedGalaxyId}
            onSuccess={handleCreateSuccess}
          />
        )}
      </Overlay>

      {/* 행성 상세 오버레이 */}
      {selectedPlanetId && (
        <PostOverlay planetId={selectedPlanetId} onClose={handleCloseOverlay} />
      )}
    </div>
  );
}
