import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SaleDetailModule } from './sale-detail.module';
import { SaleDetailService } from './sale-detail.service';
import { SaleDetailController } from './sale-detail.controller';
import { SaleDetail } from './entities/sale-detail.entity';

describe('Category module', () => {
  let module: TestingModule;
  let service: SaleDetailService;
  let controller: SaleDetailController;
  let repository: Repository<SaleDetail>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [SaleDetailModule],
    })
      .overrideProvider(getRepositoryToken(SaleDetail))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
      })
      .compile();

    service = module.get<SaleDetailService>(SaleDetailService);
    controller = module.get<SaleDetailController>(SaleDetailController);
    repository = module.get<Repository<SaleDetail>>(
      getRepositoryToken(SaleDetail),
    );
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have SaleDetailService and SaleDetailController', () => {
    expect(module.get(SaleDetailService)).toBeInstanceOf(SaleDetailService);
    expect(module.get(SaleDetailController)).toBeInstanceOf(
      SaleDetailController,
    );
  });

  it('should inject TypeORM repository for SaleDetail', () => {
    expect(module.get(getRepositoryToken(SaleDetail))).toBeDefined();
  });
});
