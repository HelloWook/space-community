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
  useCameraTransition,
  BackButton,
} from '@/features/navigate-galaxy';
import { CreatePostForm } from '@/features/create-post';
import { CreateGalaxyForm } from '@/features/create-galaxy';
import { PostOverlay } from '@/widgets/post-overlay';

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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
        <button
          onClick={() => {
            if (!isSignedIn) { router.push('/sign-in'); return; }
            setShowCreateGalaxy(true);
          }}
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#4a90d9',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
            zIndex: 50,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          }}
        >
          은하계 만들기
        </button>
      )}

      {/* 은하계 생성 폼 오버레이 */}
      {showCreateGalaxy && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            height: '100%',
            backgroundColor: 'rgba(10, 10, 30, 0.92)',
            padding: '24px',
            zIndex: 100,
            overflowY: 'auto',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>새 은하계</h2>
            <button
              onClick={() => setShowCreateGalaxy(false)}
              aria-label="닫기"
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '24px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
          <CreateGalaxyForm onSuccess={handleCreateGalaxySuccess} />
        </div>
      )}

      {/* 은하 뷰에서 게시글 작성 버튼 */}
      {viewMode === 'galaxy' && !showCreatePost && !selectedPlanetId && (
        <button
          onClick={() => {
            if (!isSignedIn) { router.push('/sign-in'); return; }
            setShowCreatePost(true);
          }}
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#4a90d9',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
            zIndex: 50,
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          }}
        >
          게시글 작성
        </button>
      )}

      {/* 게시글 작성 폼 오버레이 */}
      {showCreatePost && selectedGalaxyId && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            height: '100%',
            backgroundColor: 'rgba(10, 10, 30, 0.92)',
            padding: '24px',
            zIndex: 100,
            overflowY: 'auto',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ color: '#fff', fontSize: '18px', margin: 0 }}>새 게시글</h2>
            <button
              onClick={() => setShowCreatePost(false)}
              aria-label="닫기"
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '24px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
          <CreatePostForm
            galaxyId={selectedGalaxyId}
            onSuccess={handleCreateSuccess}
          />
        </div>
      )}

      {/* 행성 상세 오버레이 */}
      {selectedPlanetId && (
        <PostOverlay planetId={selectedPlanetId} onClose={handleCloseOverlay} />
      )}
    </div>
  );
}
