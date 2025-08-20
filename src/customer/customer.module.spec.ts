import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerModule } from './customer.module';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';

describe('UserModule', () => {
  let module: TestingModule;
  let service: CustomerService;
  let controller: CustomerController;
  let repository: Repository<Customer>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CustomerModule],
    })
      .overrideProvider(getRepositoryToken(Customer)) // Simulamos el repositorio de TypeORM
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<CustomerService>(CustomerService);
    controller = module.get<CustomerController>(CustomerController);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have CustomerService and CustomerController', () => {
    expect(module.get(CustomerService)).toBeInstanceOf(CustomerService);
    expect(module.get(CustomerController)).toBeInstanceOf(CustomerController);
  });

  it('should inject TypeORM repository for Customer', () => {
    expect(module.get(getRepositoryToken(Customer))).toBeDefined();
  });
});
