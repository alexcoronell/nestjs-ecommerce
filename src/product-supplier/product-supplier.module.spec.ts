import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductSupplierModule } from './product-supplier.module';
import { ProductSupplierService } from './product-supplier.service';
import { ProductSupplierController } from './product-supplier.controller';
import { ProductSupplier } from './entities/product-supplier.entity';

describe('ProductSupplier module', () => {
  let module: TestingModule;
  let service: ProductSupplierService;
  let controller: ProductSupplierController;
  let repository: Repository<ProductSupplier>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ProductSupplierModule],
    })
      .overrideProvider(getRepositoryToken(ProductSupplier))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<ProductSupplierService>(ProductSupplierService);
    controller = module.get<ProductSupplierController>(
      ProductSupplierController,
    );
    repository = module.get<Repository<ProductSupplier>>(
      getRepositoryToken(ProductSupplier),
    );
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have ProductSupplierService and ProductSupplierController', () => {
    expect(module.get(ProductSupplierService)).toBeInstanceOf(
      ProductSupplierService,
    );
    expect(module.get(ProductSupplierController)).toBeInstanceOf(
      ProductSupplierController,
    );
  });

  it('should inject TypeORM repository for ProductSupplier', () => {
    expect(module.get(getRepositoryToken(ProductSupplier))).toBeDefined();
  });
});
