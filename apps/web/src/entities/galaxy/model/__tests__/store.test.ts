import { useGalaxyNavigationStore } from '../index';

// 은하 네비게이션 스토어 테스트
describe('useGalaxyNavigationStore', () => {
  beforeEach(() => {
    // 각 테스트 전 스토어 초기화
    useGalaxyNavigationStore.setState({
      selectedGalaxyId: null,
      viewMode: 'universe',
      savedCameraPosition: null,
    });
  });

  it('초기 상태가 올바르다', () => {
    const state = useGalaxyNavigationStore.getState();
    expect(state.selectedGalaxyId).toBeNull();
    expect(state.viewMode).toBe('universe');
    expect(state.savedCameraPosition).toBeNull();
  });

  it('selectGalaxy 호출 시 id와 viewMode가 설정된다', () => {
    const { selectGalaxy } = useGalaxyNavigationStore.getState();
    selectGalaxy('galaxy-1');

    const state = useGalaxyNavigationStore.getState();
    expect(state.selectedGalaxyId).toBe('galaxy-1');
    expect(state.viewMode).toBe('galaxy');
  });

  it('returnToUniverse 호출 시 id가 null이 되고 viewMode가 universe로 복귀한다', () => {
    const { selectGalaxy, returnToUniverse } =
      useGalaxyNavigationStore.getState();

    // 먼저 은하 선택
    selectGalaxy('galaxy-1');
    expect(useGalaxyNavigationStore.getState().viewMode).toBe('galaxy');

    // 우주 뷰로 복귀
    returnToUniverse();

    const state = useGalaxyNavigationStore.getState();
    expect(state.selectedGalaxyId).toBeNull();
    expect(state.viewMode).toBe('universe');
  });

  it('saveCameraPosition 호출 시 카메라 위치가 저장된다', () => {
    const { saveCameraPosition } = useGalaxyNavigationStore.getState();

    saveCameraPosition([1, 2, 3]);

    const state = useGalaxyNavigationStore.getState();
    expect(state.savedCameraPosition).toEqual([1, 2, 3]);
  });

  it('returnToUniverse 호출 후에도 savedCameraPosition이 유지된다', () => {
    const { saveCameraPosition, selectGalaxy, returnToUniverse } =
      useGalaxyNavigationStore.getState();

    // 카메라 위치 저장 후 은하 진입
    saveCameraPosition([10, 20, 30]);
    selectGalaxy('galaxy-1');

    // 우주 뷰로 복귀
    returnToUniverse();

    // savedCameraPosition은 복귀 후에도 유지되어야 함
    const state = useGalaxyNavigationStore.getState();
    expect(state.savedCameraPosition).toEqual([10, 20, 30]);
  });
});
