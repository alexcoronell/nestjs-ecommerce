/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { PaymentMethodController } from '@payment_method/payment-method.controller';

/* Services */
import { PaymentMethodService } from '@payment_method/payment-method.service';

/* Entities */
import { PaymentMethod } from '@payment_method/entities/payment-method.entity';

/* DTO's */
import { CreatePaymentMethodDto } from '@payment_method/dto/create-payment-method.dto';

/* Faker */
import {
  createPaymentMethod,
  generatePaymentMethod,
  generateManyPaymentMethods,
} from '@faker/paymentMethod.faker';

describe('PaymentMethodController', () => {
  let controller: PaymentMethodController;
  let service: PaymentMethodService;

  const mockPaymentMethod: PaymentMethod = generatePaymentMethod();
  const mockPaymentMethods: PaymentMethod[] = generateManyPaymentMethods(10);
  const mockNewPaymentMethod: CreatePaymentMethodDto = createPaymentMethod();

  const mockService = {
    countAll: jest.fn().mockResolvedValue(mockPaymentMethods.length),
    count: jest.fn().mockResolvedValue(mockPaymentMethods.length),
    findAll: jest.fn().mockResolvedValue(mockPaymentMethods),
    findOne: jest.fn().mockResolvedValue(mockPaymentMethod),
    create: jest.fn().mockResolvedValue(mockNewPaymentMethod),
    update: jest.fn().mockResolvedValue(1),
    remove: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentMethodController],
      providers: [
        {
          provide: PaymentMethodService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PaymentMethodController>(PaymentMethodController);
    service = module.get<PaymentMethodService>(PaymentMethodService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count payment methods controllers', () => {
    it('should call countAll payment method service', async () => {
      expect(await controller.countAll()).toBe(mockPaymentMethods.length);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });

    it('should call count payment method service', async () => {
      expect(await controller.count()).toBe(mockPaymentMethods.length);
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find payment methods controllers', () => {
    it('should call findAll payment method service', async () => {
      expect(await controller.findAll()).toBe(mockPaymentMethods);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findOne payment method service', async () => {
      expect(await controller.findOne(1)).toBe(mockPaymentMethod);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create payment methods controller', () => {
    it('should call create payment method service', async () => {
      await controller.create(mockNewPaymentMethod);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update payment methods controller', () => {
    it('should call update payment methods service', async () => {
      const changes = { name: 'newName' };
      await controller.update(1, changes);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove payment methods controller', () => {
    it('shoudl call remove payment methods service', async () => {
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
