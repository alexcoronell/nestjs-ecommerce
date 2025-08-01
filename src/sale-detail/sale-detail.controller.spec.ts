/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { SaleDetailController } from './sale-detail.controller';

/* Services */
import { SaleDetailService } from './sale-detail.service';

/* Entities */
import { SaleDetail } from './entities/sale-detail.entity';

/* DTO's */
import { CreateSaleDetailDto } from './dto/create-sale-detail.dto';

/* Faker */
import {
  generateSaleDetail,
  generateManySaleDetails,
} from '@faker/saleDetail.faker';

describe('SaleDetailController', () => {
  let controller: SaleDetailController;
  let service: SaleDetailService;

  const mockSaleDetail: SaleDetail = generateSaleDetail();
  const mockSaleDetails: SaleDetail[] = generateManySaleDetails(10);
  const mockNewSaleDetails: CreateSaleDetailDto[] = generateManySaleDetails(5);

  const mockService = {
    count: jest.fn().mockResolvedValue(mockSaleDetails.length),
    findAll: jest.fn().mockResolvedValue(mockSaleDetails),
    findOne: jest.fn().mockResolvedValue(mockSaleDetail),
    findBySaleId: jest.fn().mockResolvedValue(mockSaleDetail),
    create: jest.fn().mockResolvedValue(mockNewSaleDetails),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleDetailController],
      providers: [
        {
          provide: SaleDetailService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SaleDetailController>(SaleDetailController);
    service = module.get<SaleDetailService>(SaleDetailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count sale details controllers', () => {
    it('should call count sale details service', async () => {
      expect(await controller.count()).toBe(mockSaleDetails.length);
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find sale details controllers', () => {
    it('should call findAll sale details service', async () => {
      expect(await controller.findAll()).toBe(mockSaleDetails);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findOne sale details service', async () => {
      expect(await controller.findOne(mockSaleDetail.id)).toBe(mockSaleDetail);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should call findBySaleId sale details service', async () => {
      expect(await controller.findBySaleId(mockSaleDetail.sale)).toBe(
        mockSaleDetail,
      );
      expect(service.findBySaleId).toHaveBeenCalledTimes(1);
    });
  });

  describe('create sale details controller', () => {
    it('should call create sale details service', async () => {
      await controller.create(mockNewSaleDetails);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });
});
