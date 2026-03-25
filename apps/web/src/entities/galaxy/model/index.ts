import { create } from 'zustand';

// Galaxy 타입 재내보내기
export type { Galaxy } from '@galaxy-board/types';

// 은하 네비게이션 뷰 모드
type ViewMode = 'universe' | 'galaxy';

// 은하 네비게이션 스토어 인터페이스
interface GalaxyNavigationState {
  /** 현재 선택된 은하 ID */
  selectedGalaxyId: string | null;
  /** 현재 뷰 모드 (우주 전체 or 은하 내부) */
  viewMode: ViewMode;
  /** 은하 선택 — 해당 은하 내부로 진입 */
  selectGalaxy: (id: string) => void;
  /** 우주 전체 뷰로 복귀 */
  returnToUniverse: () => void;
}

// 은하 네비게이션 상태 관리 스토어
export const useGalaxyNavigationStore = create<GalaxyNavigationState>(
  (set) => ({
    selectedGalaxyId: null,
    viewMode: 'universe',

    selectGalaxy: (id: string) =>
      set({ selectedGalaxyId: id, viewMode: 'galaxy' }),

    returnToUniverse: () =>
      set({ selectedGalaxyId: null, viewMode: 'universe' }),
  }),
);
