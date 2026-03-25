'use client';

// 별 주기 버튼 컴포넌트

import { useState } from 'react';
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
  const [nickname, setNickname] = useState('');
  const [showInput, setShowInput] = useState(false);
  const { mutate, isPending } = useGiveStar();

  // 별 상한 도달 여부
  const isMaxReached = starCount >= 100;

  // 별 부여 핸들러
  const handleGiveStar = () => {
    if (!nickname.trim()) return;
    mutate(
      { planetId, data: { giverNickname: nickname.trim() } },
      {
        onSuccess: () => {
          setNickname('');
          setShowInput(false);
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

      {/* 닉네임 입력 필드 (토글) */}
      {showInput && !isMaxReached && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 입력"
            aria-label="닉네임"
            maxLength={20}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid #555',
              backgroundColor: '#1a1a3a',
              color: '#fff',
              fontSize: '13px',
            }}
          />
          <button
            onClick={handleGiveStar}
            disabled={isPending || !nickname.trim()}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#ffd700',
              color: '#000',
              fontSize: '13px',
              cursor: isPending || !nickname.trim() ? 'not-allowed' : 'pointer',
              opacity: isPending || !nickname.trim() ? 0.5 : 1,
            }}
          >
            {isPending ? '전송 중...' : '확인'}
          </button>
        </div>
      )}

      {/* 메인 별 주기 버튼 */}
      {!showInput && (
        <button
          onClick={() => setShowInput(true)}
          disabled={isMaxReached}
          aria-label="별 주기"
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: isMaxReached ? '#555' : '#ffd700',
            color: isMaxReached ? '#999' : '#000',
            fontSize: '14px',
            cursor: isMaxReached ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          ⭐ 별 주기
        </button>
      )}
    </div>
  );
}
