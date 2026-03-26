// Star 비즈니스 로직 서비스

import { randomUUID } from 'crypto';
import {
  Injectable,
  Inject,
  NotFoundException,
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common';
import {
  STAR_REPOSITORY,
  IStarRepository,
} from '../../domain/ports/star-repository.port';
import { StarEntity } from '../../domain/entities/star.entity';
import { StarResponseDto } from '../dto/star.dto';
import { UserService } from './user.service';

/** 별 최대 개수 상한 */
const MAX_STAR_COUNT = 100;

@Injectable()
export class StarService {
  constructor(
    @Inject(STAR_REPOSITORY)
    private readonly starRepository: IStarRepository,
    private readonly userService: UserService,
  ) {}

  /** Planet에 Star 부여 — 인증 필수, 중복 별주기 검증 */
  async create(
    planetId: string,
    clerkId: string,
  ): Promise<StarResponseDto> {
    // clerkId로 User 조회/생성
    const user = await this.userService.findOrCreateByClerkId(clerkId);
    const giverNickname = user.name || '익명 사용자';

    // 중복 별주기 검증
    const existingStar = await this.starRepository.findByGiverAndPlanet(
      user.id,
      planetId,
    );
    if (existingStar) {
      throw new ConflictException('이미 이 게시글에 별을 주셨습니다');
    }

    // Star 도메인 엔티티 생성
    const starEntity = StarEntity.create({
      id: randomUUID(),
      giverNickname,
      planetId,
      createdAt: new Date(),
    });

    try {
      // 리포지토리를 통해 Star 생성 (트랜잭션, 상한 검사 포함)
      const result = await this.starRepository.create(
        starEntity,
        MAX_STAR_COUNT,
        user.id,
      );

      // 응답 DTO 생성
      const responseDto = new StarResponseDto();
      responseDto.id = result.star.id;
      responseDto.giverNickname = result.star.giverNickname;
      responseDto.planetId = result.star.planetId;
      responseDto.newStarCount = result.newStarCount;
      responseDto.alreadyGiven = false;
      responseDto.createdAt = result.star.createdAt;

      return responseDto;
    } catch (error) {
      // Planet을 찾을 수 없는 경우
      if (error instanceof Error && error.message.includes('찾을 수 없')) {
        throw new NotFoundException(`Planet(${planetId})을 찾을 수 없습니다`);
      }
      // Prisma NotFoundError (findUniqueOrThrow)
      if (
        error instanceof Error &&
        (error.name === 'NotFoundError' ||
          error.message.includes('No Planet found'))
      ) {
        throw new NotFoundException(`Planet(${planetId})을 찾을 수 없습니다`);
      }
      // 별 상한 초과
      if (error instanceof Error && error.message.includes('최대치')) {
        throw new UnprocessableEntityException(
          '별 개수가 최대치(100)에 도달했습니다',
        );
      }
      // 중복 별주기 (DB unique 제약 위반)
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        throw new ConflictException('이미 이 게시글에 별을 주셨습니다');
      }
      throw error;
    }
  }
}
