'use client';

import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/shared/ui/shadcn/button';
import { LoginOverlay } from '@/features/social-login/ui/LoginOverlay';

/** 로그인 상태 표시 바 — 화면 상단에 고정 */
export function AuthStatusBar() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [showLogin, setShowLogin] = useState(false);

  if (!isLoaded) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-sm text-white px-4 py-2 flex items-center justify-end gap-4 text-sm">
        {isSignedIn ? (
          <>
            <span className="text-gray-300">
              {user?.fullName ?? user?.primaryEmailAddress?.emailAddress}
            </span>
            <Link
              href="/settings"
              className="text-blue-300 hover:text-blue-200 transition-colors"
            >
              설정
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-gray-400 hover:text-white h-auto p-0"
            >
              로그아웃
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLogin(true)}
            className="text-blue-300 hover:text-blue-200 h-auto p-0"
          >
            로그인
          </Button>
        )}
      </div>

      {/* 로그인 오버레이 */}
      <LoginOverlay
        open={showLogin}
        onClose={() => setShowLogin(false)}
      />
    </>
  );
}
