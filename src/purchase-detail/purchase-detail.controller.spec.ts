/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { PurchaseDetailController } from './purchase-detail.controller';

/* Services */
import { PurchaseDetailService } from './purchase-detail.service';

/* Entities */
import { PurchaseDetail } from './entities/purchase-detail.entity';

/* DTO's */
import { CreatePurchaseDetailDto } from './dto/create-purchase-detail.dto';

/* Faker */
import {
  createPurchaseDetail,
  generatePurchaseDetail,
  generateManyPurchaseDetails,
} from '@faker/purchaseDetail.faker';

describe('PurchaseDetailController', () => {
  let controller: PurchaseDetailController;
  let service: PurchaseDetailService;

  const mockPurchaseDetail: PurchaseDetail = generatePurchaseDetail();
  const mockPurchaseDetails: PurchaseDetail[] = generateManyPurchaseDetails(10);
  const mockNewPurchaseDetail: CreatePurchaseDetailDto[] = [
    createPurchaseDetail(),
  ];

  const mockService = {
    countAll: jest.fn().mockResolvedValue(mockPurchaseDetails.length),
    count: jest.fn().mockResolvedValue(mockPurchaseDetails.length),
    findAll: jest.fn().mockResolvedValue(mockPurchaseDetails),
    findOne: jest.fn().mockResolvedValue(mockPurchaseDetail),
    findByPurchaseId: jest.fn().mockResolvedValue(mockPurchaseDetails),
    create: jest.fn().mockResolvedValue(mockNewPurchaseDetail),
    update: jest.fn().mockResolvedValue(1),
    remove: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseDetailController],
      providers: [
        {
          provide: PurchaseDetailService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PurchaseDetailController>(PurchaseDetailController);
    service = module.get<PurchaseDetailService>(PurchaseDetailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count purchase details controllers', () => {
    it('should call countAll purchase detail service', async () => {
      expect(await controller.countAll()).toBe(mockPurchaseDetails.length);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });

    it('should call count purchase detail service', async () => {
      expect(await controller.count()).toBe(mockPurchaseDetails.length);
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find purchases details controllers', () => {
    it('should call findAll purchase detail service', async () => {
      expect(await controller.findAll()).toBe(mockPurchaseDetails);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findOne purchase detail service', async () => {
      expect(await controller.findOne(1)).toBe(mockPurchaseDetail);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return purchase details by purchase id', async () => {
      expect(await controller.findByPurchaseId(mockPurchaseDetail.purchase));
      expect(service.findByPurchaseId).toHaveBeenCalledTimes(1);
    });
  });

  describe('create purchase details controller', () => {
    it('should call create purchase detail service', async () => {
      await controller.create(mockNewPurchaseDetail);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update  details controller', () => {
    it('should call update  details service', async () => {
      const changes = { quantity: 2 };
      await controller.update(1, changes);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove purchase details controller', () => {
    it('should call remove purchase details service', async () => {
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
