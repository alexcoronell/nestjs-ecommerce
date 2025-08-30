/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { UserController } from './user.controller';

/* Services */
import { UserService } from './user.service';

/* DTO's */
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password-user';

/* Faker */
import { createUser, generateUser, generateManyUsers } from '@faker/user.faker';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser = generateUser();
  const mockUsers = generateManyUsers(10).map((user) => {
    user.password = undefined;
    return user;
  });
  const mockNewUser: CreateUserDto = createUser();
  const mockUserService = {
    countAll: jest.fn().mockResolvedValue(mockUsers.length),
    count: jest.fn().mockResolvedValue(mockUsers.length),
    findAll: jest.fn().mockResolvedValue(mockUsers),
    findAllActives: jest.fn().mockResolvedValue(mockUsers),
    findOne: jest.fn().mockResolvedValue(mockUser),
    findOneByEmail: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockNewUser),
    update: jest.fn().mockResolvedValue(1),
    updatePassword: jest.fn().mockResolvedValue(1),
    remove: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count users controllers', () => {
    it('should call countAll user service', async () => {
      expect(await controller.countAll()).toBe(mockUsers.length);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });

    it('should call count user service', async () => {
      expect(await controller.count()).toBe(mockUsers.length);
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find users controllers', () => {
    it('should call findAll user service', async () => {
      expect(await controller.findAll()).toBe(mockUsers);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call finfAllActive users service', async () => {
      expect(await controller.findAllActives()).toBe(mockUsers);
      expect(service.findAllActives).toHaveBeenCalledTimes(1);
    });

    it('should call findOne user service', async () => {
      expect(await controller.findOne(1)).toBe(mockUser);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return an user by email', async () => {
      expect(await controller.findOneByEmail(mockUser.email));
      expect(service.findOneByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('create user controller', () => {
    it('should call create user service', async () => {
      await controller.create(mockNewUser);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update user controller', () => {
    it('should call update user service', async () => {
      const changes: UpdateUserDto = { firstname: 'newFirstname' };
      await controller.update(1, changes);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should call update password user service', async () => {
      const newPassword: UpdatePasswordDto = { password: 'newPassword' };
      await controller.updatePassword(1, newPassword);
      expect(service.updatePassword).toHaveBeenCalledTimes(1);
    });

    describe('remove user controller', () => {
      it('shoudl call remove user service', async () => {
        const mockRequest = {
          user: {
            user: 123,
          },
        } as any;
        await controller.remove(1, mockRequest);
        expect(service.remove).toHaveBeenCalledTimes(1);
      });
    });
  });
});
