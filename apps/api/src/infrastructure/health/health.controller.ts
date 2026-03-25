import { Controller, Get } from '@nestjs/common';

// 서버 상태 확인 엔드포인트
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
      },
    };
  }
}
