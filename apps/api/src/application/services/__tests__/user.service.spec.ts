// UserService 단위 테스트

import { UserService } from '../user.service';
import { IUserRepository } from '../../../domain/ports/user-repository.port';
import { UserEntity } from '../../../domain/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<IUserRepository>;

  const mockUser = UserEntity.create({
    id: 'test-id',
    clerkId: 'user_abc123',
    email: 'test@example.com',
    name: '테스트 사용자',
    imageUrl: 'https://example.com/photo.jpg',
    providers: ['oauth_google'],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    mockRepository = {
      findByClerkId: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new UserService(mockRepository);
  });

  describe('findByClerkId', () => {
    it('존재하는 사용자를 반환한다', async () => {
      mockRepository.findByClerkId.mockResolvedValue(mockUser);

      const result = await service.findByClerkId('user_abc123');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findByClerkId).toHaveBeenCalledWith('user_abc123');
    });

    it('존재하지 않는 사용자이면 NotFoundException을 던진다', async () => {
      mockRepository.findByClerkId.mockResolvedValue(null);

      await expect(service.findByClerkId('user_nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createFromWebhook', () => {
    it('Webhook 데이터로 사용자를 생성한다', async () => {
      mockRepository.create.mockResolvedValue(mockUser);

      const result = await service.createFromWebhook({
        clerkId: 'user_abc123',
        email: 'test@example.com',
        name: '테스트 사용자',
        imageUrl: 'https://example.com/photo.jpg',
        providers: ['oauth_google'],
      });

      expect(result).toEqual(mockUser);
      expect(mockRepository.create).toHaveBeenCalled();
    });
  });

  describe('updateFromWebhook', () => {
    it('Webhook 데이터로 사용자를 갱신한다', async () => {
      mockRepository.update.mockResolvedValue(mockUser);

      const result = await service.updateFromWebhook('user_abc123', {
        email: 'new@example.com',
        name: '새 이름',
        imageUrl: null,
        providers: ['oauth_google', 'oauth_github'],
      });

      expect(result).toEqual(mockUser);
      expect(mockRepository.update).toHaveBeenCalledWith('user_abc123', expect.any(Object));
    });
  });

  describe('deleteByClerkId', () => {
    it('clerkId로 사용자를 삭제한다', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await service.deleteByClerkId('user_abc123');

      expect(mockRepository.delete).toHaveBeenCalledWith('user_abc123');
    });
  });
});
