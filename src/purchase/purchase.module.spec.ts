import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PurchaseModule } from './purchase.module';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { Purchase } from './entities/purchase.entity';

describe('Category module', () => {
  let module: TestingModule;
  let service: PurchaseService;
  let controller: PurchaseController;
  let repository: Repository<Purchase>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PurchaseModule],
    })
      .overrideProvider(getRepositoryToken(Purchase))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<PurchaseService>(PurchaseService);
    controller = module.get<PurchaseController>(PurchaseController);
    repository = module.get<Repository<Purchase>>(getRepositoryToken(Purchase));
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have PurchaseService and PurchaseController', () => {
    expect(module.get(PurchaseService)).toBeInstanceOf(PurchaseService);
    expect(module.get(PurchaseController)).toBeInstanceOf(PurchaseController);
  });

  it('should inject TypeORM repository for Purchase', () => {
    expect(module.get(getRepositoryToken(Purchase))).toBeDefined();
  });
});
