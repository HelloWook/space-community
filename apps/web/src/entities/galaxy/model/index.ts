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
  /** 은하 진입 직전 저장된 카메라 위치 (복귀 시 복원용) */
  savedCameraPosition: [number, number, number] | null;
  /** 은하 선택 — 해당 은하 내부로 진입 */
  selectGalaxy: (id: string) => void;
  /** 우주 전체 뷰로 복귀 */
  returnToUniverse: () => void;
  /** 카메라 위치 저장 — 은하 진입 전 호출 */
  saveCameraPosition: (position: [number, number, number]) => void;
}

// 은하 네비게이션 상태 관리 스토어
export const useGalaxyNavigationStore = create<GalaxyNavigationState>(
  (set) => ({
    selectedGalaxyId: null,
    viewMode: 'universe',
    // 카메라 위치 초기값 — 저장된 위치 없음
    savedCameraPosition: null,

    selectGalaxy: (id: string) =>
      set({ selectedGalaxyId: id, viewMode: 'galaxy' }),

    // 우주 뷰로 복귀 시 savedCameraPosition은 유지 (복귀 전환에 사용)
    returnToUniverse: () =>
      set({ selectedGalaxyId: null, viewMode: 'universe' }),

    // 카메라 위치 저장
    saveCameraPosition: (position: [number, number, number]) =>
      set({ savedCameraPosition: position }),
  }),
);
