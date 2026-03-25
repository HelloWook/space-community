import { Module } from '@nestjs/common';
import { HealthModule } from './infrastructure/health/health.module';
import { GalaxyModule } from './galaxy.module';
import { PlanetModule } from './planet.module';
import { StarModule } from './star.module';

@Module({
  imports: [HealthModule, GalaxyModule, PlanetModule, StarModule],
})
export class AppModule {}
