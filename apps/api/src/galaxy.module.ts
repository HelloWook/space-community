// Galaxy 모듈 - Galaxy 관련 서비스 및 컨트롤러 등록

import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { GalaxyService } from './application/services/galaxy.service';
import { GalaxyController } from './infrastructure/api/controllers/galaxy.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [GalaxyController],
  providers: [GalaxyService],
})
export class GalaxyModule {}
