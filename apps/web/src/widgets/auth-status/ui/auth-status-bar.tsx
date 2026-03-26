'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import Link from 'next/link';

/** 로그인 상태 표시 바 — 화면 상단에 고정 */
export function AuthStatusBar() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) return null;

  return (
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
          <button
            type="button"
            onClick={() => signOut()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            로그아웃
          </button>
        </>
      ) : (
        <Link
          href="/sign-in"
          className="text-blue-300 hover:text-blue-200 transition-colors"
        >
          로그인
        </Link>
      )}
    </div>
  );
}
