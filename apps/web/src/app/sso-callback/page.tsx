'use client';

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

/** SSO 콜백 처리 페이지 — Clerk OAuth 리다이렉트를 처리한다 */
export default function SSOCallbackPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">로그인 처리 중...</p>
        <AuthenticateWithRedirectCallback
          signInFallbackRedirectUrl="/sign-in?error=callback_failed"
          signUpFallbackRedirectUrl="/sign-in?error=callback_failed"
        />
      </div>
    </div>
  );
}
