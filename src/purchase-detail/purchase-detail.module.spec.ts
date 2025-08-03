import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PurchaseDetailModule } from './purchase-detail.module';
import { PurchaseDetailService } from './purchase-detail.service';
import { PurchaseDetailController } from './purchase-detail.controller';
import { PurchaseDetail } from './entities/purchase-detail.entity';

describe('Category module', () => {
  let module: TestingModule;
  let service: PurchaseDetailService;
  let controller: PurchaseDetailController;
  let repository: Repository<PurchaseDetail>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PurchaseDetailModule],
    })
      .overrideProvider(getRepositoryToken(PurchaseDetail))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<PurchaseDetailService>(PurchaseDetailService);
    controller = module.get<PurchaseDetailController>(PurchaseDetailController);
    repository = module.get<Repository<PurchaseDetail>>(
      getRepositoryToken(PurchaseDetail),
    );
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have PurchaseDetailService and PurchaseDetailController', () => {
    expect(module.get(PurchaseDetailService)).toBeInstanceOf(
      PurchaseDetailService,
    );
    expect(module.get(PurchaseDetailController)).toBeInstanceOf(
      PurchaseDetailController,
    );
  });

  it('should inject TypeORM repository for PurchaseDetail', () => {
    expect(module.get(getRepositoryToken(PurchaseDetail))).toBeDefined();
  });
});
