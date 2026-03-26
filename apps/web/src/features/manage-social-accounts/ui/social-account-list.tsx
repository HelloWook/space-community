'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import type { OAuthStrategy } from '@clerk/types';

const ALL_PROVIDERS: { strategy: OAuthStrategy; label: string; icon: string }[] = [
  { strategy: 'oauth_google', label: 'Google', icon: '🔵' },
  { strategy: 'oauth_github', label: 'GitHub', icon: '⚫' },
];

/** 소셜 계정 연동 관리 컴포넌트 */
export function SocialAccountList() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  if (!isLoaded || !user) {
    return <div className="animate-pulse space-y-3">
      <div className="h-12 bg-gray-200 rounded-lg" />
      <div className="h-12 bg-gray-200 rounded-lg" />
    </div>;
  }

  const connectedProviders = user.externalAccounts.map((a) => a.provider);
  const canDisconnect = user.externalAccounts.length > 1;

  const handleConnect = async (strategy: OAuthStrategy) => {
    setLoading(strategy);
    try {
      await user.createExternalAccount({
        strategy,
        redirectUrl: '/settings',
      });
    } catch {
      // 에러는 Clerk가 리다이렉트로 처리
    } finally {
      setLoading(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    setLoading(accountId);
    try {
      const account = user.externalAccounts.find((a) => a.id === accountId);
      if (account) {
        await account.destroy();
      }
    } catch {
      // 에러 처리
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">연동된 소셜 계정</h3>

      <div className="space-y-3">
        {ALL_PROVIDERS.map(({ strategy, label, icon }) => {
          const account = user.externalAccounts.find(
            (a) => a.provider === strategy,
          );
          const isConnected = !!account;

          return (
            <div
              key={strategy}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{label}</p>
                  {isConnected && account && (
                    <p className="text-sm text-gray-500">
                      {(account as { emailAddress?: string }).emailAddress}
                    </p>
                  )}
                </div>
              </div>

              {isConnected ? (
                <button
                  type="button"
                  onClick={() => handleDisconnect(account!.id)}
                  disabled={!canDisconnect || loading !== null}
                  className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === account!.id ? '처리 중...' : '연동 해제'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleConnect(strategy)}
                  disabled={loading !== null}
                  className="px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 disabled:opacity-50"
                >
                  {loading === strategy ? '처리 중...' : `${label} 연동`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!canDisconnect && (
        <p className="text-xs text-gray-400">
          최소 하나의 로그인 수단이 필요합니다
        </p>
      )}
    </div>
  );
}
