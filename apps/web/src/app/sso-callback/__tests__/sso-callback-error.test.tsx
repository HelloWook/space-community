import { render, screen } from '@testing-library/react';

// next/navigation 모킹
const mockSearchParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}));

// Clerk 모킹
jest.mock('@clerk/nextjs', () => ({
  AuthenticateWithRedirectCallback: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="clerk-callback">{children}</div>
  ),
}));

// 에러 표시 컴포넌트를 테스트 (sign-in 페이지의 에러 메시지)
import { SignInErrorMessage } from '../../sign-in/[[...sign-in]]/sign-in-error-message';

describe('SignInErrorMessage', () => {
  it('error 파라미터가 없으면 아무것도 렌더링하지 않는다', () => {
    const { container } = render(<SignInErrorMessage error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('callback_failed 에러 시 에러 메시지를 표시한다', () => {
    render(<SignInErrorMessage error="callback_failed" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/로그인 처리 중 문제/i)).toBeInTheDocument();
  });

  it('에러 메시지에 다른 로그인 방법 안내가 포함된다', () => {
    render(<SignInErrorMessage error="callback_failed" />);

    expect(screen.getByText(/다른 소셜 계정/i)).toBeInTheDocument();
  });
});
