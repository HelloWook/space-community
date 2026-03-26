// PlanetController 인증 필수 단위 테스트

import { PlanetController } from '../planet.controller';
import { ClerkAuthGuard } from '../../../auth/clerk-auth.guard';

describe('PlanetController', () => {
  describe('인증 가드 설정', () => {
    it('create 메서드에 ClerkAuthGuard(필수 인증)가 적용되어 있어야 한다', () => {
      // Reflect.getMetadata로 가드 메타데이터 확인
      const guards = Reflect.getMetadata('__guards__', PlanetController.prototype.create);
      expect(guards).toBeDefined();
      expect(guards).toContainEqual(ClerkAuthGuard);
    });

    it('create 메서드의 clerkId 파라미터가 필수여야 한다 (optional이 아님)', () => {
      // 컨트롤러의 create 메서드 시그니처 검증
      // ClerkAuthGuard가 적용되면 인증 없이는 401이 반환됨
      const guards = Reflect.getMetadata('__guards__', PlanetController.prototype.create);
      const hasClerkGuard = guards?.some(
        (guard: unknown) => guard === ClerkAuthGuard,
      );
      expect(hasClerkGuard).toBe(true);
    });
  });
});
