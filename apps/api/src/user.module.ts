// User 모듈 - 사용자 관련 서비스 및 컨트롤러 등록

import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UserService } from './application/services/user.service';
import { UserController } from './infrastructure/api/controllers/user.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
