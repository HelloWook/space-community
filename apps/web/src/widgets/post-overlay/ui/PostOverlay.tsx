'use client';

import { usePlanet } from '@/entities/planet';

interface PostOverlayProps {
  /** 조회할 행성(게시글) ID */
  planetId: string;
  /** 오버레이 닫기 콜백 */
  onClose: () => void;
}

// 행성(게시글) 상세 오버레이 패널 — 3D 캔버스 위에 표시
export function PostOverlay({ planetId, onClose }: PostOverlayProps) {
  const { data: planet, isLoading, isError } = usePlanet(planetId);

  return (
    <div
      data-testid="post-overlay"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '400px',
        height: '100%',
        backgroundColor: 'rgba(10, 10, 30, 0.92)',
        color: '#fff',
        padding: '24px',
        overflowY: 'auto',
        zIndex: 100,
        boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        aria-label="닫기"
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '24px',
          cursor: 'pointer',
        }}
      >
        ✕
      </button>

      {/* 로딩 상태 */}
      {isLoading && <p>로딩 중...</p>}

      {/* 에러 상태 */}
      {isError && <p>게시글을 불러올 수 없습니다.</p>}

      {/* 게시글 상세 내용 */}
      {planet && (
        <>
          <h2 style={{ fontSize: '20px', marginBottom: '8px', marginTop: '8px' }}>
            {planet.title}
          </h2>
          <div
            style={{
              fontSize: '12px',
              color: '#999',
              marginBottom: '16px',
              display: 'flex',
              gap: '12px',
            }}
          >
            <span>{planet.authorNickname}</span>
            <span>{new Date(planet.createdAt).toLocaleDateString('ko-KR')}</span>
          </div>
          {/* 내용을 프리포맷 텍스트로 렌더링 (MVP) */}
          <pre
            data-testid="post-content"
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'inherit',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#ddd',
            }}
          >
            {planet.content}
          </pre>
        </>
      )}
    </div>
  );
}
