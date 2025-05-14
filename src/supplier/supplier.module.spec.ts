import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SupplierModule } from './supplier.module';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { Supplier } from './entities/supplier.entity';

describe('Category module', () => {
  let module: TestingModule;
  let service: SupplierService;
  let controller: SupplierController;
  let repository: Repository<Supplier>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [SupplierModule],
    })
      .overrideProvider(getRepositoryToken(Supplier))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<SupplierService>(SupplierService);
    controller = module.get<SupplierController>(SupplierController);
    repository = module.get<Repository<Supplier>>(getRepositoryToken(Supplier));
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have SupplierService and SupplierController', () => {
    expect(module.get(SupplierService)).toBeInstanceOf(SupplierService);
    expect(module.get(SupplierController)).toBeInstanceOf(SupplierController);
  });

  it('should inject TypeORM repository for Supplier', () => {
    expect(module.get(getRepositoryToken(Supplier))).toBeDefined();
  });
});
