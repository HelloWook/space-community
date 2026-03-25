import { Module } from '@nestjs/common';
import { HealthModule } from './infrastructure/health/health.module';

@Module({
  imports: [HealthModule],
})
export class AppModule {}
