import { render, screen, fireEvent } from '@testing-library/react';
import { SocialLoginButtons } from '../social-login-buttons';

// Clerk useClerk 훅 모킹
const mockAuthenticateWithRedirect = jest.fn();
jest.mock('@clerk/nextjs', () => ({
  useClerk: () => ({
    loaded: true,
    client: {
      signIn: {
        authenticateWithRedirect: mockAuthenticateWithRedirect,
      },
    },
  }),
}));

describe('SocialLoginButtons', () => {
  beforeEach(() => {
    mockAuthenticateWithRedirect.mockClear();
  });

  it('Google, GitHub 로그인 버튼이 렌더링된다', () => {
    render(<SocialLoginButtons />);

    expect(screen.getByText('Google로 로그인')).toBeInTheDocument();
    expect(screen.getByText('GitHub로 로그인')).toBeInTheDocument();
  });

  it('Google 버튼 클릭 시 oauth_google 전략으로 authenticateWithRedirect를 호출한다', () => {
    render(<SocialLoginButtons />);

    fireEvent.click(screen.getByText('Google로 로그인'));

    expect(mockAuthenticateWithRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      }),
    );
  });

  it('GitHub 버튼 클릭 시 oauth_github 전략으로 authenticateWithRedirect를 호출한다', () => {
    render(<SocialLoginButtons />);

    fireEvent.click(screen.getByText('GitHub로 로그인'));

    expect(mockAuthenticateWithRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        strategy: 'oauth_github',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      }),
    );
  });
});
