import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ShippingCompanyModule } from './shipping-company.module';
import { ShippingCompanyService } from './shipping-company.service';
import { ShippingCompanyController } from './shipping-company.controller';
import { ShippingCompany } from './entities/shipping-company.entity';

describe('Category module', () => {
  let module: TestingModule;
  let service: ShippingCompanyService;
  let controller: ShippingCompanyController;
  let repository: Repository<ShippingCompany>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ShippingCompanyModule],
    })
      .overrideProvider(getRepositoryToken(ShippingCompany))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<ShippingCompanyService>(ShippingCompanyService);
    controller = module.get<ShippingCompanyController>(
      ShippingCompanyController,
    );
    repository = module.get<Repository<ShippingCompany>>(
      getRepositoryToken(ShippingCompany),
    );
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have ShippingCompanyService and ShippingCompanyController', () => {
    expect(module.get(ShippingCompanyService)).toBeInstanceOf(
      ShippingCompanyService,
    );
    expect(module.get(ShippingCompanyController)).toBeInstanceOf(
      ShippingCompanyController,
    );
  });

  it('should inject TypeORM repository for ShippingCompany', () => {
    expect(module.get(getRepositoryToken(ShippingCompany))).toBeDefined();
  });
});
