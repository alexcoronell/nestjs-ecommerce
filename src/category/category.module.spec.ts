import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryModule } from './category.module';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './entities/category.entity';

describe('Category module', () => {
  let module: TestingModule;
  let service: CategoryService;
  let controller: CategoryController;
  let repository: Repository<Category>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CategoryModule],
    })
      .overrideProvider(getRepositoryToken(Category))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<CategoryService>(CategoryService);
    controller = module.get<CategoryController>(CategoryController);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have CategoryService and CategoryController', () => {
    expect(module.get(CategoryService)).toBeInstanceOf(CategoryService);
    expect(module.get(CategoryController)).toBeInstanceOf(CategoryController);
  });

  it('should inject TypeORM repository for Category', () => {
    expect(module.get(getRepositoryToken(Category))).toBeDefined();
  });
});
