import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { PaginatedResponse, PlanetSummary } from '@galaxy-board/types';

// 특정 은하에 속한 행성 목록 조회 훅 (커서 기반 페이지네이션)
export function usePlanets(galaxyId: string | null) {
  return useQuery({
    queryKey: queryKeys.planets.byGalaxy(galaxyId ?? ''),
    queryFn: () =>
      apiFetch<PaginatedResponse<PlanetSummary>>(
        `/galaxies/${galaxyId}/planets`,
      ),
    enabled: !!galaxyId,
  });
}
