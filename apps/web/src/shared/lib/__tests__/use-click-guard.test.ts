import { renderHook, act } from '@testing-library/react';
import { useClickGuard } from '@/shared/lib/use-click-guard';

describe('useClickGuard 훅', () => {
  it('모듈이 정상적으로 import되어야 한다', () => {
    expect(useClickGuard).toBeDefined();
    expect(typeof useClickGuard).toBe('function');
  });

  it('onPointerDown, onPointerUp, isClick을 반환해야 한다', () => {
    const { result } = renderHook(() => useClickGuard());
    expect(typeof result.current.onPointerDown).toBe('function');
    expect(typeof result.current.onPointerUp).toBe('function');
    expect(typeof result.current.isClick).toBe('function');
  });

  it('같은 위치에서 pointerDown/Up 시 클릭으로 판정해야 한다', () => {
    const { result } = renderHook(() => useClickGuard());

    act(() => {
      result.current.onPointerDown({ clientX: 100, clientY: 200 } as React.PointerEvent);
      result.current.onPointerUp({ clientX: 100, clientY: 200 } as React.PointerEvent);
    });

    expect(result.current.isClick()).toBe(true);
  });

  it('THRESHOLD(5px) 미만 이동 시 클릭으로 판정해야 한다', () => {
    const { result } = renderHook(() => useClickGuard());

    act(() => {
      result.current.onPointerDown({ clientX: 100, clientY: 200 } as React.PointerEvent);
      result.current.onPointerUp({ clientX: 103, clientY: 203 } as React.PointerEvent);
    });

    expect(result.current.isClick()).toBe(true);
  });

  it('THRESHOLD(5px) 이상 이동 시 드래그로 판정해야 한다', () => {
    const { result } = renderHook(() => useClickGuard());

    act(() => {
      result.current.onPointerDown({ clientX: 100, clientY: 200 } as React.PointerEvent);
      result.current.onPointerUp({ clientX: 110, clientY: 200 } as React.PointerEvent);
    });

    expect(result.current.isClick()).toBe(false);
  });

  it('pointerDown 없이 pointerUp만 호출하면 클릭이 아니어야 한다', () => {
    const { result } = renderHook(() => useClickGuard());

    act(() => {
      result.current.onPointerUp({ clientX: 100, clientY: 200 } as React.PointerEvent);
    });

    expect(result.current.isClick()).toBe(false);
  });
});
