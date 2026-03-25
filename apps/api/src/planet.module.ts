// Planet 모듈 - Planet 관련 서비스 및 컨트롤러 등록

import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { PlanetService } from './application/services/planet.service';
import { PlanetController, PlanetDetailController } from './infrastructure/api/controllers/planet.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PlanetController, PlanetDetailController],
  providers: [PlanetService],
})
export class PlanetModule {}
