/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { SaleController } from './sale.controller';

/* Services */
import { SaleService } from './sale.service';

/* Interfaces */
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

/* DTO's */
import { CreateSaleDto } from './dto/create-sale.dto';

/* Faker */
import { createSale, generateSale, generateManySales } from '@faker/sale.faker';

describe('SaleController', () => {
  let controller: SaleController;
  let service: SaleService;

  const mockSale = generateSale();
  const mockSales = generateManySales(10);
  const mockNewSale: CreateSaleDto = createSale();

  const mockService = {
    countAll: jest.fn().mockResolvedValue(mockSales.length),
    count: jest.fn().mockResolvedValue(mockSales.length),
    findAll: jest.fn().mockResolvedValue(mockSales),
    findAllByUser: jest.fn().mockResolvedValue(mockSales),
    findAllByPaymentMethod: jest.fn().mockResolvedValue(mockSales),
    findOne: jest.fn().mockResolvedValue(mockSale),
    create: jest.fn().mockResolvedValue(mockNewSale),
    cancel: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleController],
      providers: [
        {
          provide: SaleService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SaleController>(SaleController);
    service = module.get<SaleService>(SaleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count products controllers', () => {
    it('should call countAll product service', async () => {
      expect(await controller.countAll()).toBe(mockSales.length);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });

    it('should call count product service', async () => {
      expect(await controller.count()).toBe(mockSales.length);
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find all sales controllers', () => {
    it('should call findAll sale service', async () => {
      expect(await controller.findAll()).toBe(mockSales);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findAllByCustomerId sale service', async () => {
      const userId = 1;
      expect(await controller.findAllByUser(userId)).toBe(mockSales);
      expect(service.findAllByUser).toHaveBeenCalledWith(userId);
      expect(service.findAllByUser).toHaveBeenCalledTimes(1);
    });

    it('should call findAllByPaymentMethod sale service', async () => {
      const paymentMethodId = 1;
      expect(await controller.findAllByPaymentMethod(paymentMethodId)).toBe(
        mockSales,
      );
      expect(service.findAllByPaymentMethod).toHaveBeenCalledWith(
        paymentMethodId,
      );
      expect(service.findAllByPaymentMethod).toHaveBeenCalledTimes(1);
    });

    it('should call findOne sale service', async () => {
      const id = 1;
      expect(await controller.findOne(id)).toBe(mockSale);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('Create sale controller', () => {
    it('should call create sale service', async () => {
      const request = { user: 1 };
      await controller.create(mockNewSale, request as AuthRequest);
      expect(service.create).toHaveBeenCalledWith(mockNewSale, request.user);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cancel sale controller', () => {
    it('should call cancel sale service', async () => {
      const id = 1;
      const request = { user: 1 };
      await controller.cancel(id, request as AuthRequest);
      expect(service.cancel).toHaveBeenCalledWith(id, request.user);
      expect(service.cancel).toHaveBeenCalledTimes(1);
    });
  });
});
