import { Module } from '@nestjs/common';
import { HealthModule } from './infrastructure/health/health.module';
import { GalaxyModule } from './galaxy.module';
import { PlanetModule } from './planet.module';
import { StarModule } from './star.module';
import { CommentModule } from './comment.module';
import { UserModule } from './user.module';

@Module({
  imports: [HealthModule, GalaxyModule, PlanetModule, StarModule, CommentModule, UserModule],
})
export class AppModule {}
