// Star REST API 컨트롤러

import {
  Controller,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StarService } from '../../../application/services/star.service';
import { CreateStarDto, StarResponseDto } from '../../../application/dto/star.dto';

/** Planet 하위 Star 라우트 컨트롤러 */
@Controller('api/planets')
export class StarController {
  constructor(private readonly starService: StarService) {}

  /** Planet에 Star(별/좋아요) 부여 */
  @Post(':planetId/stars')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('planetId') planetId: string,
    @Body() dto: CreateStarDto,
  ): Promise<StarResponseDto> {
    return this.starService.create(planetId, dto);
  }
}
