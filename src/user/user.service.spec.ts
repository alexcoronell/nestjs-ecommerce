/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

/* Services */
import { UserService } from './user.service';

/* Entity */
import { User } from '@user/entities/user.entity';

/* DTO's */
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { UpdatePasswordDto } from '@user/dto/update-password-user';

/* Faker */
import { generateUser, generateManyUsers } from '@faker/user.faker';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count user services', () => {
    it('should return total all users', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(100);

      const { statusCode, total } = await service.countAll();
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(total).toEqual(100);
    });

    it('should return total users not removed', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(100);
      const { statusCode, total } = await service.count();
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(repository.count).toHaveBeenCalledWith({
        where: { isDeleted: false },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(100);
    });
  });

  describe('find users services', () => {
    it('findAll should return all users', async () => {
      const users = generateManyUsers(50);
      const usersPasswordsUndefined = users.map((user) => {
        user.password = undefined;
        return user;
      });
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([users, users.length]);

      const { statusCode, data, total } = await service.findAll();
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false },
        order: { email: 'ASC' },
      });
      expect(statusCode).toBe(200);
      expect(data).toEqual(usersPasswordsUndefined);
      expect(total).toEqual(users.length);
      expect(data[0].password).toBe(undefined);
    });

    it('getActives should return all active users', async () => {
      const mockUsers = generateManyUsers(10);
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mockUsers, mockUsers.length]);

      const { statusCode, data, total } = await service.getActives();
      const users: User[] = data as User[];
      const user = users[0];

      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false, isActive: true },
        order: { email: 'ASC' },
      });

      expect(statusCode).toBe(200);
      expect(total).toEqual(users.length);
      expect(user.password).toBe(undefined);
    });

    it('findOne should return a user', async () => {
      const user = generateUser();
      const id = user.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const { statusCode, data } = await service.findOne(id);
      const dataUser: User = data as User;
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        relations: ['createdBy', 'updatedBy'],
        where: { id, isDeleted: false },
      });
      expect(statusCode).toBe(200);
      expect(dataUser).toEqual(user);
      expect(dataUser.password).toBe(undefined);
    });

    it('findOne should throw NotFoundException if user does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The User with ${id} not found`);
      }
    });

    it('findOne should throw NotFoundException if user does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrowError(
        new NotFoundException(`The User with ${id} not found`),
      );
    });

    it('findByEmail should return a user', async () => {
      const user = generateUser();
      const email = user.email;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

      const { statusCode, data } = await service.findByEmail(email);
      const dataUser: User = data as User;
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(dataUser).toEqual(user);
    });

    it('findByEMail should throw NotFoundException if user does not exist', async () => {
      const email = 'email';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      try {
        await service.findByEmail(email);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The User with email ${email} not found`);
      }
    });
  });
});
