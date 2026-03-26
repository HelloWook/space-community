// 데이터베이스 모듈 - PrismaService 및 리포지토리 제공

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { GalaxyRepository } from './repositories/galaxy.repository';
import { PlanetRepository } from './repositories/planet.repository';
import { StarRepository } from './repositories/star.repository';
import { CommentRepository } from './repositories/comment.repository';
import { UserRepository } from './repositories/user.repository';
import { GALAXY_REPOSITORY } from '../../domain/ports/galaxy-repository.port';
import { PLANET_REPOSITORY } from '../../domain/ports/planet-repository.port';
import { STAR_REPOSITORY } from '../../domain/ports/star-repository.port';
import { COMMENT_REPOSITORY } from '../../domain/ports/comment-repository.port';
import { USER_REPOSITORY } from '../../domain/ports/user-repository.port';

@Module({
  providers: [
    PrismaService,
    {
      provide: GALAXY_REPOSITORY,
      useClass: GalaxyRepository,
    },
    {
      provide: PLANET_REPOSITORY,
      useClass: PlanetRepository,
    },
    {
      provide: STAR_REPOSITORY,
      useClass: StarRepository,
    },
    {
      provide: COMMENT_REPOSITORY,
      useClass: CommentRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [
    PrismaService,
    GALAXY_REPOSITORY,
    PLANET_REPOSITORY,
    STAR_REPOSITORY,
    COMMENT_REPOSITORY,
    USER_REPOSITORY,
  ],
})
export class DatabaseModule {}
