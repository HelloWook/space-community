import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { CreateGalaxyForm } from '../ui/CreateGalaxyForm';

// useCreateGalaxy 뮤테이션 모킹
const mockMutate = jest.fn();
jest.mock('@/entities/galaxy', () => ({
  useCreateGalaxy: () => ({
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

describe('CreateGalaxyForm', () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it('이름, 설명 필드가 렌더링된다', () => {
    render(<CreateGalaxyForm />, { wrapper: createWrapper() });

    expect(screen.getByLabelText('이름')).toBeInTheDocument();
    expect(screen.getByLabelText('설명')).toBeInTheDocument();
  });

  it('제출 버튼이 존재한다', () => {
    render(<CreateGalaxyForm />, { wrapper: createWrapper() });

    expect(
      screen.getByRole('button', { name: '은하계 만들기' }),
    ).toBeInTheDocument();
  });

  it('빈 필드 제출 시 유효성 검증 에러가 표시된다', async () => {
    render(<CreateGalaxyForm />, { wrapper: createWrapper() });

    // 빈 상태로 폼 제출
    fireEvent.click(screen.getByRole('button', { name: '은하계 만들기' }));

    // 에러 메시지 확인
    await waitFor(() => {
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThanOrEqual(2);
    });

    // 뮤테이션이 호출되지 않아야 함
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('유효한 데이터 제출 시 뮤테이션이 호출된다', async () => {
    render(<CreateGalaxyForm />, { wrapper: createWrapper() });

    // 폼 필드 입력
    fireEvent.change(screen.getByLabelText('이름'), {
      target: { value: '프론트엔드' },
    });
    fireEvent.change(screen.getByLabelText('설명'), {
      target: { value: '프론트엔드 관련 주제' },
    });

    // 폼 제출
    fireEvent.click(screen.getByRole('button', { name: '은하계 만들기' }));

    // 뮤테이션 호출 확인
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          name: '프론트엔드',
          description: '프론트엔드 관련 주제',
        },
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      );
    });
  });
});
