import { render, screen, fireEvent } from '@testing-library/react';
import { SocialLoginButtons } from '../social-login-buttons';

// Clerk useSignIn 훅 모킹
const mockAuthenticateWithRedirect = jest.fn();
jest.mock('@clerk/nextjs', () => ({
  useSignIn: () => ({
    signIn: {
      authenticateWithRedirect: mockAuthenticateWithRedirect,
    },
    isLoaded: true,
  }),
}));

describe('SocialLoginButtons', () => {
  beforeEach(() => {
    mockAuthenticateWithRedirect.mockClear();
  });

  it('Google, GitHub 로그인 버튼이 렌더링된다', () => {
    render(<SocialLoginButtons />);

    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument();
  });

  it('Google 버튼 클릭 시 oauth_google 전략으로 authenticateWithRedirect를 호출한다', () => {
    render(<SocialLoginButtons />);

    fireEvent.click(screen.getByRole('button', { name: /google/i }));

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

    fireEvent.click(screen.getByRole('button', { name: /github/i }));

    expect(mockAuthenticateWithRedirect).toHaveBeenCalledWith(
      expect.objectContaining({
        strategy: 'oauth_github',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      }),
    );
  });
});
