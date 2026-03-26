// Comment API 훅

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { CommentListResponse, CreateCommentInput } from '@galaxy-board/types';

/** Planet의 댓글 목록 조회 훅 */
export function useComments(planetId: string) {
  return useQuery({
    queryKey: queryKeys.comments.list(planetId),
    queryFn: () =>
      apiFetch<CommentListResponse>(`/planets/${planetId}/comments`),
    enabled: !!planetId,
  });
}

/** Planet에 댓글 작성 뮤테이션 훅 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      planetId,
      data,
    }: {
      planetId: string;
      data: CreateCommentInput;
    }) =>
      apiFetch(`/planets/${planetId}/comments`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    // 성공 시 해당 행성의 댓글 쿼리 캐시 무효화
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(variables.planetId),
      });
    },
  });
}
