import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DiscountModule } from './discount.module';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { Discount } from './entities/discount.entity';

describe('Category module', () => {
  let module: TestingModule;
  let service: DiscountService;
  let controller: DiscountController;
  let repository: Repository<Discount>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DiscountModule],
    })
      .overrideProvider(getRepositoryToken(Discount))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<DiscountService>(DiscountService);
    controller = module.get<DiscountController>(DiscountController);
    repository = module.get<Repository<Discount>>(getRepositoryToken(Discount));
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have DiscountService and DiscountController', () => {
    expect(module.get(DiscountService)).toBeInstanceOf(DiscountService);
    expect(module.get(DiscountController)).toBeInstanceOf(DiscountController);
  });

  it('should inject TypeORM repository for Discount', () => {
    expect(module.get(getRepositoryToken(Discount))).toBeDefined();
  });
});
