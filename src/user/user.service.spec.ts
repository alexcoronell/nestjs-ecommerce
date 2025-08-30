/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { generateUser, generateManyUsers, createUser } from '@faker/user.faker';

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

    it('findAllActives should return all active users', async () => {
      const mockUsers = generateManyUsers(10);
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mockUsers, mockUsers.length]);

      const { statusCode, data, total } = await service.findAllActives();
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
        expect(error.message).toBe(`The User with id: ${id} not found`);
      }
    });

    it('findOne should throw NotFoundException if user does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrowError(
        new NotFoundException(`The User with id: ${id} not found`),
      );
    });

    it('findByEmail should return a user', async () => {
      const user = generateUser();
      const email = user.email;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

      const { statusCode, data } = await service.findOneByEmail(email);
      const dataUser: User = data as User;
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(dataUser).toEqual(user);
    });

    it('findOneByEMail should throw NotFoundException if user does not exist', async () => {
      const email = 'email';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      try {
        await service.findOneByEmail(email);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The User with email ${email} not found`);
      }
    });

    it('findAndValidateEmail should return a user', async () => {
      const user = generateUser();
      const email = user.email;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

      const { statusCode, data } = await service.findAndValidateEmail(email);
      const dataUser: User = data as User;
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(dataUser).toEqual(user);
    });

    it('findAndValidateEmail should throw NotFoundException if user does not exist', async () => {
      const email = 'email';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      try {
        await service.findAndValidateEmail(email);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe(`Not Allow`);
      }
    });
  });

  describe('create user services', () => {
    it('create should return a user', async () => {
      const user = generateUser();
      const newUser: CreateUserDto = { ...createUser(), password: 'password' };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const { statusCode, data } = await service.create(newUser);
      expect(statusCode).toBe(201);
      expect(data).toEqual(user);
    });

    it('create should return Conflict Exception when email exists', async () => {
      const user = generateUser();
      const newUser: CreateUserDto = { ...createUser(), email: user.email };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(repository, 'create').mockReturnValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      try {
        await service.create(newUser);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(`The Email ${user.email} is already in use`);
      }
    });
  });

  describe('update user service', () => {
    it('update should return a message: have been modified', async () => {
      const user = generateUser();
      const id = user.id;
      const changes: UpdateUserDto = { email: 'updatedEmail@email.com' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(repository, 'merge').mockReturnValue({ ...user, ...changes });
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const { statusCode, message } = await service.update(id, changes);
      expect(statusCode).toBe(200);
      expect(message).toEqual(`The User with id: ${id} has been modified`);
    });

    it('updatePassword should return an user', async () => {
      const user = generateUser();
      const id = user.id;
      const hashedPassword: string = 'hashedPassword';
      const changes: UpdatePasswordDto = { password: hashedPassword };

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(repository, 'merge').mockReturnValue({ ...user, ...changes });
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const { statusCode, message } = await service.updatePassword(id, changes);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(repository.merge).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(message).toEqual('Password updated successfully');
    });

    it('update should throw NotFoundException if user does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.update(id, { email: 'newEmail' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The User with id: ${id} not found`);
      }
    });

    it('update should throw NotFoundException if user does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update(id, { firstname: 'newFirstName' }),
      ).rejects.toThrowError(
        new NotFoundException(`The User with id: ${id} not found`),
      );
    });
  });

  describe('remove users services', () => {
    it('remove should return status and message', async () => {
      const user = generateUser();
      const id = user.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(repository, 'merge')
        .mockReturnValue({ ...user, isDeleted: true });
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const { statusCode, message } = await service.remove(id);
      expect(statusCode).toBe(204);
      expect(message).toEqual(`The User with id: ${id} has been deleted`);
    });

    it('remove should throw NotFoundException if user does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrowError(
        new NotFoundException(`The User with id: ${id} not found`),
      );
    });
  });
});
