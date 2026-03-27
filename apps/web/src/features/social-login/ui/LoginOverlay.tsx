'use client';

import { useClerk } from '@clerk/nextjs';
import { useState } from 'react';
import { Overlay } from '@/widgets/overlay';
import { Button } from '@/shared/ui/shadcn/button';

const PROVIDERS = [
  { strategy: 'oauth_google' as const, label: 'Google로 로그인', icon: '🔵' },
  { strategy: 'oauth_github' as const, label: 'GitHub로 로그인', icon: '⚫' },
];

interface LoginOverlayProps {
  /** 열림 상태 */
  open: boolean;
  /** 닫기 콜백 */
  onClose: () => void;
  /** 로그인 성공 콜백 */
  onSuccess?: () => void;
}

/** 오버레이 로그인 폼 — 공통 Overlay 내에서 Clerk OAuth 제공 */
export function LoginOverlay({ open, onClose, onSuccess }: LoginOverlayProps) {
  const clerk = useClerk();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (strategy: 'oauth_google' | 'oauth_github') => {
    if (!clerk.loaded) return;
    setError(null);
    setLoadingProvider(strategy);
    try {
      await clerk.client.signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
      onSuccess?.();
    } catch {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      setLoadingProvider(null);
    }
  };

  return (
    <Overlay open={open} onClose={onClose} title="로그인" size="sm" description="소셜 계정으로 간편하게 로그인하세요">
      <div className="flex flex-col gap-3">

        {error && (
          <p className="text-sm text-destructive text-center" role="alert">
            {error}
          </p>
        )}

        {PROVIDERS.map(({ strategy, label, icon }) => (
          <Button
            key={strategy}
            variant="outline"
            onClick={() => handleLogin(strategy)}
            disabled={loadingProvider !== null || !clerk.loaded}
            className="w-full justify-center gap-2 py-6"
          >
            <span>{icon}</span>
            <span>{loadingProvider === strategy ? '로그인 중...' : label}</span>
          </Button>
        ))}
      </div>
    </Overlay>
  );
}
