// Planet REST API 컨트롤러

import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlanetService } from '../../../application/services/planet.service';
import { PlanetListResponseDto } from '../../../application/dto/planet.dto';
import { PaginationQueryDto } from '../../../application/dto/common.dto';

@Controller('api/galaxies')
export class PlanetController {
  constructor(private readonly planetService: PlanetService) {}

  /** Galaxy별 Planet 목록 커서 기반 페이지네이션 조회 */
  @Get(':galaxyId/planets')
  async findByGalaxy(
    @Param('galaxyId') galaxyId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PlanetListResponseDto> {
    return this.planetService.findByGalaxy(
      galaxyId,
      query.cursor ?? null,
      query.limit,
    );
  }
}
