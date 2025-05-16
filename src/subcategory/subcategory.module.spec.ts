import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubcategoryModule } from './subcategory.module';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { Subcategory } from './entities/subcategory.entity';

describe('Category module', () => {
  let module: TestingModule;
  let service: SubcategoryService;
  let controller: SubcategoryController;
  let repository: Repository<Subcategory>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [SubcategoryModule],
    })
      .overrideProvider(getRepositoryToken(Subcategory))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<SubcategoryService>(SubcategoryService);
    controller = module.get<SubcategoryController>(SubcategoryController);
    repository = module.get<Repository<Subcategory>>(
      getRepositoryToken(Subcategory),
    );
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have SubcategoryService and SubcategoryController', () => {
    expect(module.get(SubcategoryService)).toBeInstanceOf(SubcategoryService);
    expect(module.get(SubcategoryController)).toBeInstanceOf(
      SubcategoryController,
    );
  });

  it('should inject TypeORM repository for Subcategory', () => {
    expect(module.get(getRepositoryToken(Subcategory))).toBeDefined();
  });
});
