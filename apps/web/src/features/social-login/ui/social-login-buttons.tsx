'use client';

import { useClerk } from '@clerk/nextjs';
import { useState } from 'react';

const PROVIDERS = [
  { strategy: 'oauth_google' as const, label: 'Google로 로그인', icon: '🔵' },
  { strategy: 'oauth_github' as const, label: 'GitHub로 로그인', icon: '⚫' },
];

/** 소셜 로그인 버튼 컴포넌트 */
export function SocialLoginButtons() {
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
    } catch {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p className="text-sm text-red-500 text-center" role="alert">
          {error}
        </p>
      )}
      {PROVIDERS.map(({ strategy, label, icon }) => (
        <button
          key={strategy}
          type="button"
          onClick={() => handleLogin(strategy)}
          disabled={loadingProvider !== null || !clerk.loaded}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{icon}</span>
          <span>{loadingProvider === strategy ? '로그인 중...' : label}</span>
        </button>
      ))}
    </div>
  );
}
