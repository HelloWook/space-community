'use client';

// 별 주기 버튼 컴포넌트

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useGiveStar } from '@/entities/star';

interface GiveStarButtonProps {
  /** 대상 Planet ID */
  planetId: string;
  /** 현재 별 개수 */
  starCount: number;
  /** 별 부여 성공 콜백 */
  onSuccess?: () => void;
}

/** 행성에 별(좋아요)을 부여하는 버튼 */
export function GiveStarButton({
  planetId,
  starCount,
  onSuccess,
}: GiveStarButtonProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { mutate, isPending } = useGiveStar();

  // 별 상한 도달 여부
  const isMaxReached = starCount >= 100;

  // 별 부여 핸들러
  const handleGiveStar = () => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    mutate(
      { planetId },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  return (
    <div data-testid="give-star-button" style={{ marginTop: '16px' }}>
      {/* 별 개수 표시 */}
      <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '8px' }}>
        ⭐ {starCount}개
      </div>

      {/* 상한 도달 메시지 */}
      {isMaxReached && (
        <p
          style={{ color: '#ff9999', fontSize: '12px' }}
          data-testid="star-limit-message"
        >
          별 상한에 도달했습니다
        </p>
      )}

      {/* 비로그인 안내 메시지 */}
      {!isSignedIn && (
        <p
          style={{ color: '#ffcc00', fontSize: '12px', marginBottom: '8px' }}
          data-testid="login-required-message"
        >
          로그인이 필요합니다
        </p>
      )}

      {/* 메인 별 주기 버튼 */}
      <button
        onClick={handleGiveStar}
        disabled={isMaxReached || isPending}
        aria-label="별 주기"
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: isMaxReached ? '#555' : '#ffd700',
          color: isMaxReached ? '#999' : '#000',
          fontSize: '14px',
          cursor: isMaxReached || isPending ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending ? '전송 중...' : '⭐ 별 주기'}
      </button>
    </div>
  );
}
