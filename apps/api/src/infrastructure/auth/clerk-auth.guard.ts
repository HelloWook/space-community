// Clerk JWT 인증 가드

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('인증 토큰이 필요합니다');
    }

    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      request.auth = payload;
      return true;
    } catch {
      throw new UnauthorizedException('유효하지 않은 인증 토큰입니다');
    }
  }

  private extractToken(request: { headers: Record<string, string> }): string | null {
    const authorization = request.headers['authorization'];
    if (!authorization) return null;

    const [type, token] = authorization.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
