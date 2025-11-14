/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Services */
import { SaleService } from './sale.service';

/* Entity */
import { Sale } from './entities/sale.entity';

/* Faker */
import { generateSale, generateManySales } from '@faker/sale.faker';
import { User } from '@user/entities/user.entity';

describe('SaleService', () => {
  let service: SaleService;
  let repository: Repository<Sale>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        {
          provide: getRepositoryToken(Sale),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<SaleService>(SaleService);
    repository = module.get<Repository<Sale>>(getRepositoryToken(Sale));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count sales services', () => {
    it('should return total all sales', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(100);

      const { statusCode, total } = await service.countAll();
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(total).toEqual(100);
    });

    it('should return total sales not removed', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(100);
      const { statusCode, total } = await service.count();
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(repository.count).toHaveBeenCalledWith({
        where: { isCancelled: false },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(100);
    });
  });

  describe('find sales services', () => {
    it('should return all sales', async () => {
      const mocks = generateManySales(10);
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mocks, mocks.length]);

      const { statusCode, data, total } = await service.findAll();

      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(total).toEqual(mocks.length);
      expect(data).toEqual(mocks);
    });

    it('should return all sales by User id', async () => {
      const userId = 1;
      const mocks = generateManySales(10);
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mocks, mocks.length]);

      const { statusCode, data, total } = await service.findAllByUser(userId);

      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { user: { id: userId }, isCancelled: false },
        order: { saleDate: 'DESC' },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(mocks.length);
      expect(data).toEqual(mocks);
    });

    it('should return all sales by payment method id', async () => {
      const paymentMethodId = 1;
      const mocks = generateManySales(10);
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mocks, mocks.length]);

      const { statusCode, data, total } =
        await service.findAllByPaymentMethod(paymentMethodId);

      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { paymentMethod: { id: paymentMethodId }, isCancelled: false },
        order: { saleDate: 'DESC' },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(mocks.length);
      expect(data).toEqual(mocks);
    });

    it('should return a sale by id', async () => {
      const mock = generateSale();
      const id = mock.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(mock);

      const { statusCode, data } = await service.findOne(id);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id, isCancelled: false },
        relations: ['user', 'paymentMethod'],
      });
      expect(statusCode).toBe(200);
      expect(data).toEqual(mock);
    });

    it('should throw NotFoundException if sale does not exist', async () => {
      const id = 999;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException(`Sale with ID ${id} not found`),
      );
    });
  });

  describe('create sale service', () => {
    it('should create a new sale', async () => {
      const mock = generateSale();
      const createdBy: User['id'] = 1;
      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      const mockNewSale = {
        ...mock,
        paymentMethod: mock.paymentMethod.id,
      };

      const { statusCode, data } = await service.create(mockNewSale, createdBy);
      expect(statusCode).toBe(201);
      expect(data).toEqual(mock);
    });
  });

  describe('cancel sale service', () => {
    it('should cancel a sale by id', async () => {
      const mock = { ...generateSale(), canceledAt: new Date() };
      const id = mock.id;
      const userId: User['id'] = 1;
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ statusCode: 200, data: mock });
      jest
        .spyOn(repository, 'merge')
        .mockReturnValue({ ...mock, isCancelled: true });
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...mock, isCancelled: true });

      const { statusCode, data, message } = await service.cancel(id, userId);
      expect(service.findOne).toHaveBeenCalledWith(id);
      //expect(repository.merge).toHaveBeenCalledWith(mock, {
      //  isCancelled: true,
      //  cancelledAt: mock.cancelledAt,
      //  cancelledBy: { id: userId },
      //});
      expect(repository.save).toHaveBeenCalledWith(mock);
      expect(statusCode).toBe(200);
      expect(data.cancelledBy).toBeDefined();
      expect(data.cancelledAt).toBeDefined();
      expect(data.isCancelled).toBeTruthy();
      expect(message).toBe(`The Sale with ID: ${id} cancelled successfully`);
    });

    it('should throw NotFoundException if sale does not exist', async () => {
      const id = 999;
      const userId: User['id'] = 1;
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException(`Sale with ID ${id} not found`),
        );

      await expect(service.cancel(id, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
