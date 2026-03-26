// StarController 인증 필수 단위 테스트

import { StarController } from '../star.controller';
import { ClerkAuthGuard } from '../../../auth/clerk-auth.guard';

describe('StarController', () => {
  describe('인증 가드 설정', () => {
    it('create 메서드에 ClerkAuthGuard(필수 인증)가 적용되어 있어야 한다', () => {
      const guards = Reflect.getMetadata('__guards__', StarController.prototype.create);
      expect(guards).toBeDefined();
      expect(guards).toContainEqual(ClerkAuthGuard);
    });
  });
});
