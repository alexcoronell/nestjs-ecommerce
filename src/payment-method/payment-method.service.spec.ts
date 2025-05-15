/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Services */
import { PaymentMethodService } from '@payment_method/payment-method.service';

/* Entity */
import { PaymentMethod } from '@payment_method/entities/payment-method.entity';

/* DTO's */
import { UpdatePaymentMethodDto } from '@payment_method/dto/update-payment-method.dto';

/* Faker */
import {
  createPaymentMethod,
  generatePaymentMethod,
  generateManyPaymentMethods,
} from '@faker/paymentMethod.faker';

describe('PaymentMethodService', () => {
  let service: PaymentMethodService;
  let repository: Repository<PaymentMethod>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentMethodService,
        {
          provide: getRepositoryToken(PaymentMethod),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<PaymentMethodService>(PaymentMethodService);
    repository = module.get<Repository<PaymentMethod>>(
      getRepositoryToken(PaymentMethod),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
