import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Galaxy } from '@galaxy-board/types';

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
