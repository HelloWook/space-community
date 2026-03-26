// User 비즈니스 로직 서비스

import { randomUUID } from 'crypto';
import { Injectable, Inject } from '@nestjs/common';
import { createClerkClient } from '@clerk/backend';
import {
  USER_REPOSITORY,
  IUserRepository,
} from '../../domain/ports/user-repository.port';
import { UserEntity } from '../../domain/entities/user.entity';

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  /** clerkId로 사용자 조회 — DB에 없으면 Clerk API에서 가져와서 자동 생성 */
  async findOrCreateByClerkId(clerkId: string): Promise<UserEntity> {
    const existing = await this.userRepository.findByClerkId(clerkId);
    if (existing) return existing;

    // Clerk API에서 사용자 정보 조회
    const clerkUser = await clerk.users.getUser(clerkId);

    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    );
    const name = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(' ') || null;
    const providers = clerkUser.externalAccounts.map((a) => a.provider);

    const now = new Date();
    const entity = UserEntity.create({
      id: randomUUID(),
      clerkId,
      email: primaryEmail?.emailAddress ?? '',
      name,
      imageUrl: clerkUser.imageUrl ?? null,
      providers,
      createdAt: now,
      updatedAt: now,
    });

    return this.userRepository.create(entity);
  }
}
