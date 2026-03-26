import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { GiveStarButton } from '../ui/GiveStarButton';

// useGiveStar 뮤테이션 모킹
const mockMutate = jest.fn();
jest.mock('@/entities/star', () => ({
  useGiveStar: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
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

describe('GiveStarButton', () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it('별 아이콘과 텍스트가 포함된 버튼이 렌더링된다', () => {
    render(
      <GiveStarButton planetId="p1" starCount={5} />,
      { wrapper: createWrapper() },
    );

    // 별 주기 버튼 확인
    expect(screen.getByRole('button', { name: '별 주기' })).toBeInTheDocument();
    // 현재 별 개수 표시 확인
    expect(screen.getByText('⭐ 5개')).toBeInTheDocument();
  });

  it('버튼 클릭 시 즉시 뮤테이션이 호출된다', async () => {
    render(
      <GiveStarButton planetId="p1" starCount={5} />,
      { wrapper: createWrapper() },
    );

    // 별 주기 버튼 클릭 → 즉시 뮤테이션 호출
    fireEvent.click(screen.getByRole('button', { name: '별 주기' }));

    // 뮤테이션 호출 확인
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { planetId: 'p1' },
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      );
    });
  });

  it('starCount가 100 이상이면 버튼이 비활성화되고 상한 메시지가 표시된다', () => {
    render(
      <GiveStarButton planetId="p1" starCount={100} />,
      { wrapper: createWrapper() },
    );

    // 버튼 비활성화 확인
    const button = screen.getByRole('button', { name: '별 주기' });
    expect(button).toBeDisabled();

    // 상한 도달 메시지 확인
    expect(screen.getByTestId('star-limit-message')).toHaveTextContent(
      '별 상한에 도달했습니다',
    );
  });
});
