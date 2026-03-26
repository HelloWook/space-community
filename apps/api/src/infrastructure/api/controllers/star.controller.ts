// Star REST API 컨트롤러

import {
  Controller,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { StarService } from '../../../application/services/star.service';
import { StarResponseDto } from '../../../application/dto/star.dto';
import { ClerkAuthGuard } from '../../auth/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

/** Planet 하위 Star 라우트 컨트롤러 */
@Controller('api/planets')
export class StarController {
  constructor(private readonly starService: StarService) {}

  /** Planet에 Star(별/좋아요) 부여 — 인증 필수, 1클릭으로 별 부여 */
  @Post(':planetId/stars')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ClerkAuthGuard)
  async create(
    @Param('planetId') planetId: string,
    @CurrentUser() clerkId: string,
  ): Promise<StarResponseDto> {
    return this.starService.create(planetId, clerkId);
  }
}
