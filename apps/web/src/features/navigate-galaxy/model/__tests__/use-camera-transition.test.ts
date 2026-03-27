import { Vector3 } from 'three';

// useFrame 콜백 캡처용
let frameCallback: (() => void) | null = null;
// useEffect 콜백 캡처용 — 의존성 변경 시 호출
let effectCallbacks: Array<{ cb: () => void; deps: unknown[] }> = [];
let prevDeps: unknown[] | null = null;

const mockCamera = {
  position: new Vector3(0, 0, 50),
};

// React 훅 모킹 — 훅이 React 컨텍스트 없이 동작하도록
const refMap = new Map<number, { current: unknown }>();
let refCounter = 0;

jest.mock('react', () => ({
  useRef: (initial: unknown) => {
    const id = refCounter++;
    if (!refMap.has(id)) {
      refMap.set(id, { current: initial });
    }
    return refMap.get(id)!;
  },
  useCallback: (fn: Function, _deps: unknown[]) => fn,
  useEffect: (cb: () => void, deps: unknown[]) => {
    effectCallbacks.push({ cb, deps });
  },
}));

jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn((cb: () => void) => {
    frameCallback = cb;
  }),
  useThree: jest.fn(() => ({ camera: mockCamera })),
}));

import { useCameraTransition } from '../use-camera-transition';

// 훅을 호출하여 useFrame/useEffect 콜백 등록
function setupHook(options: Parameters<typeof useCameraTransition>[0]) {
  // ref 카운터와 콜백 초기화 — 새 훅 호출 시뮬레이션
  refCounter = 0;
  frameCallback = null;
  effectCallbacks = [];
  useCameraTransition(options);
  // useEffect 즉시 실행 (최초 마운트 시뮬레이션)
  effectCallbacks.forEach((e) => e.cb());
}

describe('useCameraTransition', () => {
  beforeEach(() => {
    // 매 테스트 전 상태 초기화
    mockCamera.position.set(0, 0, 50);
    frameCallback = null;
    effectCallbacks = [];
    refMap.clear();
    refCounter = 0;
  });

  it('전환 완료 후 useFrame에서 카메라를 이동하지 않는다 (hasArrived)', () => {
    // 카메라가 이미 목표 위치에 있는 상태 (universe 모드, 기본 위치 [0,0,50])
    setupHook({ viewMode: 'universe', targetPosition: null });

    // useFrame 콜백 실행 — 이미 도착 (distance < threshold) → hasArrived = true
    frameCallback!();

    // WASD로 카메라를 이동시킨 상황을 시뮬레이션
    mockCamera.position.set(5, 0, 50);

    // 다시 useFrame 실행 — hasArrived가 true이므로 lerp하지 않아야 함
    frameCallback!();

    // 카메라 위치가 WASD로 이동한 그대로 유지되어야 함 (원점 복귀 없음)
    expect(mockCamera.position.x).toBe(5);
    expect(mockCamera.position.y).toBe(0);
    expect(mockCamera.position.z).toBe(50);
  });

  it('새로운 전환 트리거 시 hasArrived가 리셋되어 lerp가 재개된다', () => {
    // 먼저 universe 모드에서 도착 상태로 만든다
    setupHook({ viewMode: 'universe', targetPosition: null });
    frameCallback!(); // hasArrived = true

    // galaxy 모드로 전환 — useEffect가 hasArrived를 리셋
    setupHook({
      viewMode: 'galaxy',
      targetPosition: { x: 10, y: 0, z: 0 },
    });

    const beforeX = mockCamera.position.x;
    frameCallback!();

    // lerp가 진행되어 카메라 위치가 변해야 한다
    expect(mockCamera.position.x).not.toBe(beforeX);
  });

  it('savedPosition이 제공되면 universe 복귀 시 해당 위치를 목표로 사용한다', () => {
    // 카메라를 원점 근처에 배치
    mockCamera.position.set(0, 0, 0);

    // 저장된 위치 [20, 10, 40]으로 복귀
    setupHook({
      viewMode: 'universe',
      targetPosition: null,
      savedPosition: [20, 10, 40],
    });

    frameCallback!();

    // [0,0,0]에서 [20,10,40] 방향으로 lerp가 진행되어야 함
    expect(mockCamera.position.x).toBeGreaterThan(0);
    expect(mockCamera.position.y).toBeGreaterThan(0);
    expect(mockCamera.position.z).toBeGreaterThan(0);
  });
});
