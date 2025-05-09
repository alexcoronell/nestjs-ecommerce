import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserModule } from './user.module';
import { UserService } from '@user/user.service';
import { UserController } from '@user/user.controller';
import { User } from '@user/entities/user.entity';

describe('UserModule', () => {
  let module: TestingModule;
  let service: UserService;
  let controller: UserController;
  let repository: Repository<User>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule], // Importamos el módulo completo
    })
      .overrideProvider(getRepositoryToken(User)) // Simulamos el repositorio de TypeORM
      .useValue({
        findOne: jest.fn(), // Mock de métodos del repositorio
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<UserService>(UserService);
    controller = module.get<UserController>(UserController);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have UserService and UserController', () => {
    expect(module.get(UserService)).toBeInstanceOf(UserService);
    expect(module.get(UserController)).toBeInstanceOf(UserController);
  });

  it('should inject TypeORM repository for User', () => {
    expect(module.get(getRepositoryToken(User))).toBeDefined();
  });
});
