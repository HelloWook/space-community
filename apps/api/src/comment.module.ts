// Comment 모듈 - Comment 관련 서비스 및 컨트롤러 등록

import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CommentService } from './application/services/comment.service';
import { CommentController } from './infrastructure/api/controllers/comment.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
