'use client';

import { SocialLoginButtons } from '@/features/social-login/ui/social-login-buttons';

/** 커스텀 로그인 페이지 */
export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">은하계 게시판</h1>
          <p className="text-sm text-gray-500 mt-2">소셜 계정으로 로그인하세요</p>
        </div>

        <SocialLoginButtons />

        <p className="text-xs text-gray-400 text-center mt-6">
          로그인 시 서비스 이용약관에 동의합니다
        </p>
      </div>
    </div>
  );
}
