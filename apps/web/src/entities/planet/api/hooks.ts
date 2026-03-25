import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  PaginatedResponse,
  PlanetSummary,
  PlanetDetail,
  CreatePlanetInput,
} from '@galaxy-board/types';

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

// 행성 상세 조회 훅
export function usePlanet(id: string | null) {
  return useQuery({
    queryKey: queryKeys.planets.detail(id ?? ''),
    queryFn: () => apiFetch<PlanetDetail>(`/planets/${id}`),
    enabled: !!id,
  });
}

// 행성(게시글) 생성 뮤테이션 훅
export function useCreatePlanet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      galaxyId,
      data,
    }: {
      galaxyId: string;
      data: CreatePlanetInput;
    }) =>
      apiFetch<PlanetDetail>(`/galaxies/${galaxyId}/planets`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    // 성공 시 행성 목록 캐시 무효화
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.planets.byGalaxy(variables.galaxyId),
      });
    },
  });
}
