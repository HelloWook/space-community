'use client';

import { useUser } from '@clerk/nextjs';
import { SocialAccountList } from '@/features/manage-social-accounts';

/** 계정 설정 페이지 (보호 라우트 — clerkMiddleware에서 인증 강제) */
export default function SettingsPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">계정 설정</h1>

        {/* 프로필 정보 */}
        <section className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">프로필</h2>
          <div className="flex items-center gap-4">
            {user?.imageUrl && (
              <img
                src={user.imageUrl}
                alt="프로필 이미지"
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">
                {user?.fullName ?? '이름 없음'}
              </p>
              <p className="text-sm text-gray-500">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </section>

        {/* 소셜 계정 관리 */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <SocialAccountList />
        </section>
      </div>
    </div>
  );
}
