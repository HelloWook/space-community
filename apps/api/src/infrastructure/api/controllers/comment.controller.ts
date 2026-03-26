// Comment REST API 컨트롤러

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from '../../../application/services/comment.service';
import {
  CreateCommentDto,
  CommentResponseDto,
  CommentListResponseDto,
} from '../../../application/dto/comment.dto';
import { OptionalClerkAuthGuard } from '../../auth/optional-clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

/** Planet 하위 Comment 라우트 컨트롤러 */
@Controller('api/planets')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /** Planet의 댓글 목록 조회 */
  @Get(':planetId/comments')
  async findByPlanet(
    @Param('planetId') planetId: string,
  ): Promise<CommentListResponseDto> {
    return this.commentService.findByPlanet(planetId);
  }

  /** Planet에 댓글 작성 — 인증 시 authorId 자동 설정 */
  @Post(':planetId/comments')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(OptionalClerkAuthGuard)
  async create(
    @Param('planetId') planetId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() clerkId?: string,
  ): Promise<CommentResponseDto> {
    return this.commentService.create(planetId, dto, clerkId);
  }
}
