// TanStack Query 키 팩토리 — 중앙 관리로 일관성 보장
export const queryKeys = {
  galaxies: {
    all: ['galaxies'] as const,
    detail: (id: string) => ['galaxies', id] as const,
  },
  planets: {
    byGalaxy: (galaxyId: string) => ['planets', 'galaxy', galaxyId] as const,
    detail: (id: string) => ['planets', id] as const,
  },
  users: {
    me: ['users', 'me'] as const,
  },
} as const;
