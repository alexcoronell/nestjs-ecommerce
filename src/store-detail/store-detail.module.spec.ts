import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StoreDetailModule } from './store-detail.module';
import { StoreDetailService } from './store-detail.service';
import { StoreDetailController } from './store-detail.controller';
import { StoreDetail } from './entities/store-detail.entity';

describe('Category module', () => {
  let module: TestingModule;
  let service: StoreDetailService;
  let controller: StoreDetailController;
  let repository: Repository<StoreDetail>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [StoreDetailModule],
    })
      .overrideProvider(getRepositoryToken(StoreDetail))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<StoreDetailService>(StoreDetailService);
    controller = module.get<StoreDetailController>(StoreDetailController);
    repository = module.get<Repository<StoreDetail>>(
      getRepositoryToken(StoreDetail),
    );
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have StoreDetailService and StoreDetailController', () => {
    expect(module.get(StoreDetailService)).toBeInstanceOf(StoreDetailService);
    expect(module.get(StoreDetailController)).toBeInstanceOf(
      StoreDetailController,
    );
  });

  it('should inject TypeORM repository for StoreDetail', () => {
    expect(module.get(getRepositoryToken(StoreDetail))).toBeDefined();
  });
});
