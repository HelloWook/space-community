import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Galaxy, CreateGalaxyInput } from '@galaxy-board/types';

// 전체 은하 목록 조회 훅
export function useGalaxies() {
  return useQuery({
    queryKey: queryKeys.galaxies.all,
    queryFn: () => apiFetch<Galaxy[]>('/galaxies'),
  });
}

// 단일 은하 상세 조회 훅
export function useGalaxy(id: string | null) {
  return useQuery({
    queryKey: queryKeys.galaxies.detail(id ?? ''),
    queryFn: () => apiFetch<Galaxy>(`/galaxies/${id}`),
    enabled: !!id,
  });
}

// 은하(주제) 생성 뮤테이션 훅
export function useCreateGalaxy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGalaxyInput) =>
      apiFetch<Galaxy>('/galaxies', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    // 성공 시 은하 목록 캐시 무효화
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.galaxies.all,
      });
    },
  });
}
