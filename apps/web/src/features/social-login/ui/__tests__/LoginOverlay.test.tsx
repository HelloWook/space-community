import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LoginOverlay } from '../LoginOverlay';

// Clerk 모킹
jest.mock('@clerk/nextjs', () => ({
  useClerk: () => ({
    loaded: true,
    client: {
      signIn: {
        authenticateWithRedirect: jest.fn(),
      },
    },
  }),
}));

describe('LoginOverlay', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('open=true일 때 로그인 폼을 렌더링한다', () => {
    render(<LoginOverlay {...defaultProps} />);
    expect(screen.getByText('로그인')).toBeInTheDocument();
  });

  it('open=false일 때 렌더링하지 않는다', () => {
    render(<LoginOverlay {...defaultProps} open={false} />);
    expect(screen.queryByText('로그인')).not.toBeInTheDocument();
  });

  it('Google OAuth 버튼이 표시된다', () => {
    render(<LoginOverlay {...defaultProps} />);
    expect(screen.getByText('Google로 로그인')).toBeInTheDocument();
  });

  it('GitHub OAuth 버튼이 표시된다', () => {
    render(<LoginOverlay {...defaultProps} />);
    expect(screen.getByText('GitHub로 로그인')).toBeInTheDocument();
  });

  it('description이 표시된다', () => {
    render(<LoginOverlay {...defaultProps} />);
    expect(screen.getByText('소셜 계정으로 간편하게 로그인하세요')).toBeInTheDocument();
  });

  it('닫기 버튼 클릭으로 onClose가 호출된다', async () => {
    const user = userEvent.setup();
    render(<LoginOverlay {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
