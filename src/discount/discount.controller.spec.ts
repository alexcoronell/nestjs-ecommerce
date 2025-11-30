/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { DiscountController } from './discount.controller';

/* Services */
import { DiscountService } from './discount.service';

/* Entities */
import { Discount } from './entities/discount.entity';

/* DTO's */
import { CreateDiscountDto } from './dto/create-discount.dto';

/* Faker */
import {
  createDiscount,
  generateDiscount,
  generateManyDiscounts,
} from '@faker/discount.faker';

describe('DiscountController', () => {
  let controller: DiscountController;
  let service: DiscountService;

  const mockDiscount: Discount = generateDiscount();
  const mockDiscounts: Discount[] = generateManyDiscounts(10);
  const mockNewDiscount: CreateDiscountDto = createDiscount();

  const mockService = {
    countAll: jest.fn().mockResolvedValue(mockDiscounts.length),
    count: jest.fn().mockResolvedValue(mockDiscounts.length),
    findAll: jest.fn().mockResolvedValue(mockDiscounts),
    findOne: jest.fn().mockResolvedValue(mockDiscount),
    findOneByCode: jest.fn().mockResolvedValue(mockDiscount),
    create: jest.fn().mockResolvedValue(mockNewDiscount),
    update: jest.fn().mockResolvedValue(1),
    remove: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountController],
      providers: [
        {
          provide: DiscountService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<DiscountController>(DiscountController);
    service = module.get<DiscountService>(DiscountService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count discounts controllers', () => {
    it('should call countAll discount service', async () => {
      expect(await controller.countAll()).toBe(mockDiscounts.length);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });

    it('should call count discount service', async () => {
      expect(await controller.count()).toBe(mockDiscounts.length);
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find discounts controllers', () => {
    it('should call findAll discount service', async () => {
      expect(await controller.findAll()).toBe(mockDiscounts);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findOne discount service', async () => {
      expect(await controller.findOne(1)).toBe(mockDiscount);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return an discount by code', async () => {
      expect(await controller.findOneByCode(mockDiscount.code));
      expect(service.findOneByCode).toHaveBeenCalledTimes(1);
    });
  });

  describe('create discounts controller', () => {
    it('should call create discount service', async () => {
      const userId = 1;
      await controller.create(mockNewDiscount, userId);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update discounts controller', () => {
    it('should call update discounts service', async () => {
      const userId = 1;
      const changes = { code: 'newCode' };
      await controller.update(1, userId, changes);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove discounts controller', () => {
    it('shoudl call remove discounts service', async () => {
      const userId = 1;
      await controller.remove(1, userId);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
