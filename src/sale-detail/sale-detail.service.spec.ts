/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Services */
import { SaleDetailService } from './sale-detail.service';

/* Entity */
import { SaleDetail } from './entities/sale-detail.entity';

/* Faker */
import {
  generateSaleDetail,
  generateManySaleDetails,
} from '@faker/saleDetail.faker';

describe('SaleDetailService', () => {
  let service: SaleDetailService;
  let repository: Repository<SaleDetail>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleDetailService,
        {
          provide: getRepositoryToken(SaleDetail),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<SaleDetailService>(SaleDetailService);
    repository = module.get<Repository<SaleDetail>>(
      getRepositoryToken(SaleDetail),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count products services', () => {
    it('should return total all products', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(100);

      const { statusCode, total } = await service.count();
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(total).toEqual(100);
    });
  });

  describe('find sale details services', () => {
    it('should return all sale details', async () => {
      const saleDetails = generateManySaleDetails(5);
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([saleDetails, 5]);

      const result = await service.findAll();
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual(saleDetails);
      expect(result.total).toBe(5);
    });

    it('findOne should return a sale detail', async () => {
      const mock = generateSaleDetail();
      const id = mock.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(mock);

      const { statusCode, data } = await service.findOne(id);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(statusCode).toBe(200);
      expect(data).toEqual(mock);
    });

    it('findOneByName should throw NotFoundException if sale detail does not exist', async () => {
      const id = 999;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The Sale Detail with ID ${id} not found`);
      }
    });

    it('findBySaleId should return a sale details array', async () => {
      const mocks = generateManySaleDetails(5);
      const saleId = 1;

      jest.spyOn(repository, 'findAndCount').mockResolvedValue([mocks, 5]);

      const { statusCode, data } = await service.findBySaleId(saleId);

      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { sale: { id: saleId } },
        order: {
          createdAt: 'DESC',
        },
      });
      expect(statusCode).toBe(200);
      expect(data).toEqual(mocks);
    });
  });

  describe('create sale detail services', () => {
    it('create should return a Product', async () => {
      const mocks = generateManySaleDetails(5);

      const mockNewSaleDetails = mocks.map((mock) => ({
        ...mock,
        sale: mock.sale.id,
        product: mock.product.id,
      }));

      jest.spyOn(repository, 'create').mockReturnValue(mocks as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mocks as any);

      const { statusCode, data } = await service.create(mockNewSaleDetails);
      expect(statusCode).toBe(201);
      expect(data).toEqual(mocks);
    });
  });
});
