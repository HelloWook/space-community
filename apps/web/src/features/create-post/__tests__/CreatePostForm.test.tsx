import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { CreatePostForm } from '../ui/CreatePostForm';

// useCreatePlanet 뮤테이션 모킹
const mockMutate = jest.fn();
jest.mock('@/entities/planet', () => ({
  useCreatePlanet: () => ({
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

describe('CreatePostForm', () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it('제목, 내용, 닉네임 필드가 렌더링된다', () => {
    render(<CreatePostForm galaxyId="g1" />, { wrapper: createWrapper() });

    expect(screen.getByLabelText('제목')).toBeInTheDocument();
    expect(screen.getByLabelText('내용')).toBeInTheDocument();
    expect(screen.getByLabelText('닉네임')).toBeInTheDocument();
  });

  it('제출 버튼이 존재한다', () => {
    render(<CreatePostForm galaxyId="g1" />, { wrapper: createWrapper() });

    expect(screen.getByRole('button', { name: '게시글 작성' })).toBeInTheDocument();
  });

  it('빈 필드 제출 시 유효성 검증 에러가 표시된다', async () => {
    render(<CreatePostForm galaxyId="g1" />, { wrapper: createWrapper() });

    // 빈 상태로 폼 제출
    fireEvent.click(screen.getByRole('button', { name: '게시글 작성' }));

    // 에러 메시지 확인
    await waitFor(() => {
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThanOrEqual(3);
    });

    // 뮤테이션이 호출되지 않아야 함
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('유효한 데이터 제출 시 뮤테이션이 호출된다', async () => {
    render(<CreatePostForm galaxyId="g1" />, { wrapper: createWrapper() });

    // 폼 필드 입력
    fireEvent.change(screen.getByLabelText('제목'), { target: { value: '테스트 제목' } });
    fireEvent.change(screen.getByLabelText('내용'), { target: { value: '테스트 내용입니다' } });
    fireEvent.change(screen.getByLabelText('닉네임'), { target: { value: '테스터' } });

    // 폼 제출
    fireEvent.click(screen.getByRole('button', { name: '게시글 작성' }));

    // 뮤테이션 호출 확인
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          galaxyId: 'g1',
          data: {
            title: '테스트 제목',
            content: '테스트 내용입니다',
            authorNickname: '테스터',
          },
        },
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      );
    });
  });
});
