// User 비즈니스 로직 서비스

import { randomUUID } from 'crypto';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  IUserRepository,
} from '../../domain/ports/user-repository.port';
import { UserEntity } from '../../domain/entities/user.entity';
import {
  CreateUserFromWebhookDto,
  UpdateUserFromWebhookDto,
} from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  /** clerkId로 사용자 조회 */
  async findByClerkId(clerkId: string): Promise<UserEntity> {
    const user = await this.userRepository.findByClerkId(clerkId);
    if (!user) {
      throw new NotFoundException(`사용자(${clerkId})를 찾을 수 없습니다`);
    }
    return user;
  }

  /** Webhook user.created 이벤트 처리 — 멱등성을 위해 upsert 패턴 */
  async createFromWebhook(dto: CreateUserFromWebhookDto): Promise<UserEntity> {
    const existing = await this.userRepository.findByClerkId(dto.clerkId);
    if (existing) {
      return this.userRepository.update(dto.clerkId, {
        email: dto.email,
        name: dto.name,
        imageUrl: dto.imageUrl,
        providers: dto.providers,
      });
    }

    const now = new Date();
    const entity = UserEntity.create({
      id: randomUUID(),
      clerkId: dto.clerkId,
      email: dto.email,
      name: dto.name,
      imageUrl: dto.imageUrl,
      providers: dto.providers,
      createdAt: now,
      updatedAt: now,
    });

    return this.userRepository.create(entity);
  }

  /** Webhook user.updated 이벤트 처리 */
  async updateFromWebhook(
    clerkId: string,
    dto: UpdateUserFromWebhookDto,
  ): Promise<UserEntity> {
    return this.userRepository.update(clerkId, {
      email: dto.email,
      name: dto.name,
      imageUrl: dto.imageUrl,
      providers: dto.providers,
    });
  }

  /** Webhook user.deleted 이벤트 처리 */
  async deleteByClerkId(clerkId: string): Promise<void> {
    await this.userRepository.delete(clerkId);
  }
}
