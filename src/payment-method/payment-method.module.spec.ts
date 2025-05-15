import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaymentMethodModule } from './payment-method.module';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethod } from './entities/payment-method.entity';

describe('Category module', () => {
  let module: TestingModule;
  let service: PaymentMethodService;
  let controller: PaymentMethodController;
  let repository: Repository<PaymentMethod>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PaymentMethodModule],
    })
      .overrideProvider(getRepositoryToken(PaymentMethod))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<PaymentMethodService>(PaymentMethodService);
    controller = module.get<PaymentMethodController>(PaymentMethodController);
    repository = module.get<Repository<PaymentMethod>>(
      getRepositoryToken(PaymentMethod),
    );
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have PaymentMethodService and PaymentMethodController', () => {
    expect(module.get(PaymentMethodService)).toBeInstanceOf(
      PaymentMethodService,
    );
    expect(module.get(PaymentMethodController)).toBeInstanceOf(
      PaymentMethodController,
    );
  });

  it('should inject TypeORM repository for PaymentMethod', () => {
    expect(module.get(getRepositoryToken(PaymentMethod))).toBeDefined();
  });
});
