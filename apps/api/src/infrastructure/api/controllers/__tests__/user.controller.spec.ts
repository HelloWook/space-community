// /api/users/me 엔드포인트 단위 테스트

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../../../../application/services/user.service';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findByClerkId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(UserController);
    userService = module.get(UserService) as jest.Mocked<UserService>;
  });

  describe('GET /api/users/me', () => {
    it('인증된 사용자의 정보를 반환한다', async () => {
      userService.findByClerkId.mockResolvedValue(mockUser);

      const result = await controller.getMe('user_abc123');

      expect(result).toEqual({
        id: mockUser.id,
        clerkId: mockUser.clerkId,
        email: mockUser.email,
        name: mockUser.name,
        imageUrl: mockUser.imageUrl,
        providers: mockUser.providers,
      });
    });

    it('존재하지 않는 사용자이면 NotFoundException을 던진다', async () => {
      userService.findByClerkId.mockRejectedValue(
        new NotFoundException('사용자를 찾을 수 없습니다'),
      );

      await expect(controller.getMe('user_nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
