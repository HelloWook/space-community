// Star REST API 컨트롤러

import {
  Controller,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { StarService } from '../../../application/services/star.service';
import { CreateStarDto, StarResponseDto } from '../../../application/dto/star.dto';
import { OptionalClerkAuthGuard } from '../../auth/optional-clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

/** Planet 하위 Star 라우트 컨트롤러 */
@Controller('api/planets')
export class StarController {
  constructor(private readonly starService: StarService) {}

  /** Planet에 Star(별/좋아요) 부여 — 인증 시 giverId 자동 설정 */
  @Post(':planetId/stars')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(OptionalClerkAuthGuard)
  async create(
    @Param('planetId') planetId: string,
    @Body() dto: CreateStarDto,
    @CurrentUser() _clerkId?: string,
  ): Promise<StarResponseDto> {
    return this.starService.create(planetId, dto);
  }
}
