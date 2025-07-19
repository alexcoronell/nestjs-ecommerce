import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductDiscountModule } from './product-discount.module';
import { ProductDiscountService } from './product-discount.service';
import { ProductDiscountController } from './product-discount.controller';
import { ProductDiscount } from './entities/product-discount.entity';

describe('ProductDiscount module', () => {
  let module: TestingModule;
  let service: ProductDiscountService;
  let controller: ProductDiscountController;
  let repository: Repository<ProductDiscount>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ProductDiscountModule],
    })
      .overrideProvider(getRepositoryToken(ProductDiscount))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        findAndCount: jest.fn(),
        create: jest.fn(),
      })
      .compile();

    service = module.get<ProductDiscountService>(ProductDiscountService);
    controller = module.get<ProductDiscountController>(
      ProductDiscountController,
    );
    repository = module.get<Repository<ProductDiscount>>(
      getRepositoryToken(ProductDiscount),
    );
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have ProductDiscountService and ProductDiscountController', () => {
    expect(module.get(ProductDiscountService)).toBeInstanceOf(
      ProductDiscountService,
    );
    expect(module.get(ProductDiscountController)).toBeInstanceOf(
      ProductDiscountController,
    );
  });

  it('should inject TypeORM repository for ProductDiscount', () => {
    expect(module.get(getRepositoryToken(ProductDiscount))).toBeDefined();
  });
});
