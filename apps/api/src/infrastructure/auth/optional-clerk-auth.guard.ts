// Optional Clerk JWT 인증 가드 — 토큰이 있으면 검증, 없으면 통과

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verifyToken } from '@clerk/backend';

@Injectable()
export class OptionalClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization) return true;

    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer' || !token) return true;

    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      request.auth = payload;
    } catch {
      // 토큰 검증 실패 시에도 요청 허용 (optional)
    }

    return true;
  }
}
