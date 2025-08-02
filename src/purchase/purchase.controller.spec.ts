/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { PurchaseController } from './purchase.controller';

/* Services */
import { PurchaseService } from './purchase.service';

/* Entities */
import { Purchase } from './entities/purchase.entity';

/* DTO's */
import { CreatePurchaseDto } from './dto/create-purchase.dto';

/* Faker */
import {
  createPurchase,
  generatePurchase,
  generateManyPurchases,
} from '@faker/purchase.faker';

describe('PurchaseController', () => {
  let controller: PurchaseController;
  let service: PurchaseService;

  const mockPurchase: Purchase = generatePurchase();
  const mockPurchases: Purchase[] = generateManyPurchases(10);
  const mockNewPurchase: CreatePurchaseDto = createPurchase();

  const mockService = {
    countAll: jest.fn().mockResolvedValue(mockPurchases.length),
    count: jest.fn().mockResolvedValue(mockPurchases.length),
    findAll: jest.fn().mockResolvedValue(mockPurchases),
    findOne: jest.fn().mockResolvedValue(mockPurchase),
    findBySupplierId: jest.fn().mockResolvedValue(mockPurchase),
    create: jest.fn().mockResolvedValue(mockNewPurchase),
    update: jest.fn().mockResolvedValue(1),
    remove: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [
        {
          provide: PurchaseService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PurchaseController>(PurchaseController);
    service = module.get<PurchaseService>(PurchaseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count purchases controllers', () => {
    it('should call countAll purchase service', async () => {
      expect(await controller.countAll()).toBe(mockPurchases.length);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });

    it('should call count purchase service', async () => {
      expect(await controller.count()).toBe(mockPurchases.length);
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find purchases controllers', () => {
    it('should call findAll purchase service', async () => {
      expect(await controller.findAll()).toBe(mockPurchases);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findOne purchase service', async () => {
      expect(await controller.findOne(1)).toBe(mockPurchase);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return a purchase by supplier id', async () => {
      expect(await controller.findOneBySupplierId(mockPurchase.supplier));
      expect(service.findBySupplierId).toHaveBeenCalledTimes(1);
    });
  });

  describe('create purchases controller', () => {
    it('should call create purchase service', async () => {
      await controller.create(mockNewPurchase);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update purchases controller', () => {
    it('should call update purchases service', async () => {
      const changes = { totalAmount: 100 };
      await controller.update(1, changes);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove purchases controller', () => {
    it('should call remove purchases service', async () => {
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
