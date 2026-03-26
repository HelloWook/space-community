// User 엔티티 API 쿼리 — TanStack Query 훅

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiFetch } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { UserResponse } from '@galaxy-board/types';

/** 현재 로그인한 사용자 정보 조회 */
export function useCurrentUser() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.users.me,
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<UserResponse>('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    enabled: !!isSignedIn,
  });
}
