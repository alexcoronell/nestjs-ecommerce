import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BrandModule } from './brand.module';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand } from './entities/brand.entity';

describe('Category module', () => {
  let module: TestingModule;
  let service: BrandService;
  let controller: BrandController;
  let repository: Repository<Brand>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [BrandModule],
    })
      .overrideProvider(getRepositoryToken(Brand))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<BrandService>(BrandService);
    controller = module.get<BrandController>(BrandController);
    repository = module.get<Repository<Brand>>(getRepositoryToken(Brand));
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have BrandService and BrandController', () => {
    expect(module.get(BrandService)).toBeInstanceOf(BrandService);
    expect(module.get(BrandController)).toBeInstanceOf(BrandController);
  });

  it('should inject TypeORM repository for Brand', () => {
    expect(module.get(getRepositoryToken(Brand))).toBeDefined();
  });
});
