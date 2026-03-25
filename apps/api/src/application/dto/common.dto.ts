// 공통 DTO 정의

import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/** 커서 기반 페이지네이션 쿼리 DTO */
export class PaginationQueryDto {
  /** 페이지네이션 커서 (이전 응답의 nextCursor) */
  @IsOptional()
  @IsString()
  cursor?: string;

  /** 페이지 당 항목 수 (기본값: 50, 최소: 1, 최대: 50) */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 50;
}
