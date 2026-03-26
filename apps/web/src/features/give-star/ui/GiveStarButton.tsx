'use client';

// 별 주기 버튼 컴포넌트

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useGiveStar } from '@/entities/star';
import { Button } from '@/shared/ui/shadcn/button';

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
    <div data-testid="give-star-button" className="mt-4">
      {/* 별 개수 표시 */}
      <div className="text-sm text-muted-foreground mb-2">
        ⭐ {starCount}개
      </div>

      {/* 상한 도달 메시지 */}
      {isMaxReached && (
        <p
          className="text-destructive/70 text-xs"
          data-testid="star-limit-message"
        >
          별 상한에 도달했습니다
        </p>
      )}

      {/* 비로그인 안내 메시지 */}
      {!isSignedIn && (
        <p
          className="text-yellow-400 text-xs mb-2"
          data-testid="login-required-message"
        >
          로그인이 필요합니다
        </p>
      )}

      {/* 메인 별 주기 버튼 */}
      <Button
        onClick={handleGiveStar}
        disabled={isMaxReached || isPending}
        aria-label="별 주기"
        variant={isMaxReached ? 'secondary' : 'default'}
        className={isMaxReached ? '' : 'bg-yellow-500 hover:bg-yellow-600 text-black font-bold'}
      >
        {isPending ? '전송 중...' : '⭐ 별 주기'}
      </Button>
    </div>
  );
}
