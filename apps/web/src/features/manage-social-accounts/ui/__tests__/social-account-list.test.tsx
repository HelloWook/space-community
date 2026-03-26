import { render, screen } from '@testing-library/react';
import { SocialAccountList } from '../social-account-list';

// Clerk useUser 훅 모킹
const mockUser = {
  externalAccounts: [
    {
      id: 'ext_1',
      provider: 'oauth_google',
      emailAddress: 'test@gmail.com',
      destroy: jest.fn(),
    },
  ],
  createExternalAccount: jest.fn(),
};

jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: mockUser,
    isLoaded: true,
  }),
}));

describe('SocialAccountList', () => {
  beforeEach(() => {
    mockUser.externalAccounts = [
      {
        id: 'ext_1',
        provider: 'oauth_google',
        emailAddress: 'test@gmail.com',
        destroy: jest.fn(),
      },
    ];
  });

  it('연동된 소셜 계정 목록이 렌더링된다', () => {
    render(<SocialAccountList />);

    expect(screen.getByText(/google/i)).toBeInTheDocument();
  });

  it('미연동 제공자에 대해 연동 버튼이 표시된다', () => {
    render(<SocialAccountList />);

    // GitHub이 미연동이므로 연동 버튼이 있어야 한다
    expect(screen.getByRole('button', { name: /github.*연동/i })).toBeInTheDocument();
  });

  it('연동된 계정에 대해 해제 버튼이 표시된다', () => {
    // 2개 이상 연동 시 해제 버튼 표시
    mockUser.externalAccounts = [
      { id: 'ext_1', provider: 'oauth_google', emailAddress: 'test@gmail.com', destroy: jest.fn() },
      { id: 'ext_2', provider: 'oauth_github', emailAddress: 'test@github.com', destroy: jest.fn() },
    ];

    render(<SocialAccountList />);

    const disconnectButtons = screen.getAllByRole('button', { name: /해제/i });
    expect(disconnectButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('마지막 남은 계정의 해제 버튼은 비활성화된다', () => {
    // 1개만 연동된 상태
    mockUser.externalAccounts = [
      { id: 'ext_1', provider: 'oauth_google', emailAddress: 'test@gmail.com', destroy: jest.fn() },
    ];

    render(<SocialAccountList />);

    // 해제 버튼이 없거나 비활성화되어야 한다
    const disconnectButtons = screen.queryAllByRole('button', { name: /해제/i });
    disconnectButtons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });
});
