// Star 모듈 - Star 관련 서비스 및 컨트롤러 등록

import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UserModule } from './user.module';
import { StarService } from './application/services/star.service';
import { StarController } from './infrastructure/api/controllers/star.controller';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [StarController],
  providers: [StarService],
})
export class StarModule {}
