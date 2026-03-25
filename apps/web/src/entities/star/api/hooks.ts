// Star API 훅

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { StarResponse, CreateStarInput } from '@galaxy-board/types';

/** Planet에 Star(별/좋아요) 부여 뮤테이션 훅 */
export function useGiveStar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      planetId,
      data,
    }: {
      planetId: string;
      data: CreateStarInput;
    }) =>
      apiFetch<StarResponse>(`/planets/${planetId}/stars`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    // 성공 시 행성 관련 쿼리 캐시 무효화
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.planets.detail(variables.planetId),
      });
    },
  });
}
