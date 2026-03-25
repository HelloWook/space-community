// Galaxy REST API 컨트롤러

import { Controller, Get, Param } from '@nestjs/common';
import { GalaxyService } from '../../../application/services/galaxy.service';
import {
  GalaxyListResponseDto,
  GalaxyResponseDto,
} from '../../../application/dto/galaxy.dto';

@Controller('api/galaxies')
export class GalaxyController {
  constructor(private readonly galaxyService: GalaxyService) {}

  /** 전체 Galaxy 목록 조회 */
  @Get()
  async findAll(): Promise<GalaxyListResponseDto> {
    return this.galaxyService.findAll();
  }

  /** ID로 Galaxy 상세 조회 */
  @Get(':id')
  async findById(@Param('id') id: string): Promise<GalaxyResponseDto> {
    return this.galaxyService.findById(id);
  }
}
