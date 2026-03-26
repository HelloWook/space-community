// @CurrentUser 데코레이터 - request.auth에서 Clerk userId 추출

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** 현재 인증된 사용자의 Clerk userId를 추출하는 데코레이터 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.auth?.sub;
  },
);
