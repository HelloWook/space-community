// User Prisma 리포지토리 구현체

import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/ports/user-repository.port';
import { UserEntity } from '../../../domain/entities/user.entity';
import { PrismaService } from '../prisma.service';

/** Prisma User → 도메인 UserEntity 변환 */
function toDomain(record: {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  providers: string[];
  createdAt: Date;
  updatedAt: Date;
}): UserEntity {
  return UserEntity.create({
    id: record.id,
    clerkId: record.clerkId,
    email: record.email,
    name: record.name,
    imageUrl: record.imageUrl,
    providers: record.providers,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByClerkId(clerkId: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { clerkId } });
    return user ? toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? toDomain(user) : null;
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    const created = await this.prisma.user.create({
      data: {
        clerkId: entity.clerkId,
        email: entity.email,
        name: entity.name,
        imageUrl: entity.imageUrl,
        providers: entity.providers,
      },
    });
    return toDomain(created);
  }

  async update(
    clerkId: string,
    data: Partial<Pick<UserEntity, 'email' | 'name' | 'imageUrl' | 'providers'>>,
  ): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { clerkId },
      data,
    });
    return toDomain(updated);
  }

  async delete(clerkId: string): Promise<void> {
    await this.prisma.user.delete({ where: { clerkId } });
  }
}
