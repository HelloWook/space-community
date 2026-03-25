import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { PostOverlay } from '../ui/PostOverlay';

// usePlanet 훅 모킹
const mockUsePlanet = jest.fn();
jest.mock('@/entities/planet', () => ({
  usePlanet: (...args: unknown[]) => mockUsePlanet(...args),
}));

// 테스트용 QueryClient 래퍼 생성
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

// 테스트용 행성 상세 데이터
const mockPlanet = {
  id: 'p1',
  title: '테스트 행성',
  content: '이것은 테스트 내용입니다.\n두 번째 줄입니다.',
  authorNickname: '테스터',
  starCount: 5,
  position: { x: 0, y: 0, z: 0 },
  galaxyId: 'g1',
  createdAt: '2026-03-20T00:00:00.000Z',
};

describe('PostOverlay', () => {
  beforeEach(() => {
    mockUsePlanet.mockReset();
  });

  it('행성 제목과 내용을 렌더링한다', () => {
    mockUsePlanet.mockReturnValue({
      data: mockPlanet,
      isLoading: false,
      isError: false,
    });

    render(<PostOverlay planetId="p1" onClose={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('테스트 행성')).toBeInTheDocument();
    expect(screen.getByTestId('post-content')).toHaveTextContent(
      '이것은 테스트 내용입니다.',
    );
  });

  it('닫기 버튼 클릭 시 onClose가 호출된다', () => {
    const onClose = jest.fn();

    mockUsePlanet.mockReturnValue({
      data: mockPlanet,
      isLoading: false,
      isError: false,
    });

    render(<PostOverlay planetId="p1" onClose={onClose} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('로딩 중일 때 로딩 메시지를 표시한다', () => {
    mockUsePlanet.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<PostOverlay planetId="p1" onClose={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('내용이 프리포맷 텍스트로 렌더링된다', () => {
    mockUsePlanet.mockReturnValue({
      data: mockPlanet,
      isLoading: false,
      isError: false,
    });

    render(<PostOverlay planetId="p1" onClose={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    const content = screen.getByTestId('post-content');
    expect(content.tagName).toBe('PRE');
  });
});
