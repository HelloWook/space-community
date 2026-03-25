import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { useGalaxies, useGalaxy } from '../hooks';
import { apiFetch } from '@/shared/api/client';

// apiFetch 모킹
jest.mock('@/shared/api/client', () => ({
  apiFetch: jest.fn(),
}));

const mockedApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

// 테스트용 QueryClient 래퍼 생성
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useGalaxies', () => {
  it('GET /galaxies 엔드포인트를 호출한다', async () => {
    const mockGalaxies = [
      { id: '1', name: '은하1', description: '설명', position: { x: 0, y: 0, z: 0 }, planetCount: 3, createdAt: '2026-01-01' },
    ];
    mockedApiFetch.mockResolvedValueOnce({ data: mockGalaxies });

    const { result } = renderHook(() => useGalaxies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApiFetch).toHaveBeenCalledWith('/galaxies');
    expect(result.current.data).toEqual(mockGalaxies);
  });
});

describe('useGalaxy', () => {
  it('GET /galaxies/:id 엔드포인트를 호출한다', async () => {
    const mockGalaxy = {
      id: 'g1',
      name: '은하1',
      description: '설명',
      position: { x: 0, y: 0, z: 0 },
      planetCount: 5,
      createdAt: '2026-01-01',
    };
    mockedApiFetch.mockResolvedValueOnce(mockGalaxy);

    const { result } = renderHook(() => useGalaxy('g1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApiFetch).toHaveBeenCalledWith('/galaxies/g1');
    expect(result.current.data).toEqual(mockGalaxy);
  });

  it('id가 null이면 쿼리가 비활성화된다', () => {
    const { result } = renderHook(() => useGalaxy(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(mockedApiFetch).not.toHaveBeenCalled();
  });
});
