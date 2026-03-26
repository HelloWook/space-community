// ClerkAuthGuard 단위 테스트

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ClerkAuthGuard } from '../clerk-auth.guard';

// @clerk/backend 모킹
jest.mock('@clerk/backend', () => ({
  verifyToken: jest.fn(),
}));

import { verifyToken } from '@clerk/backend';

const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;

describe('ClerkAuthGuard', () => {
  let guard: ClerkAuthGuard;
  let mockContext: ExecutionContext;
  let mockRequest: { headers: Record<string, string>; auth?: unknown };

  beforeEach(() => {
    process.env.CLERK_SECRET_KEY = 'sk_test_mock';
    guard = new ClerkAuthGuard();
    mockRequest = { headers: {} };
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;
    mockVerifyToken.mockReset();
  });

  it('유효한 Bearer 토큰이면 통과하고 request.auth에 payload를 할당한다', async () => {
    const payload = { sub: 'user_abc123', iss: 'clerk' };
    mockRequest.headers['authorization'] = 'Bearer valid_token';
    mockVerifyToken.mockResolvedValue(payload as never);

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.auth).toEqual(payload);
    expect(mockVerifyToken).toHaveBeenCalledWith('valid_token', expect.objectContaining({
      secretKey: expect.any(String),
    }));
  });

  it('토큰이 없으면 UnauthorizedException을 던진다', async () => {
    await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
  });

  it('유효하지 않은 토큰이면 UnauthorizedException을 던진다', async () => {
    mockRequest.headers['authorization'] = 'Bearer invalid_token';
    mockVerifyToken.mockRejectedValue(new Error('Invalid token'));

    await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
  });
});
