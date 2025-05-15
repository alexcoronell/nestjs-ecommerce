/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Services */
import { ShippingCompanyService } from './shipping-company.service';

/* Entity */
import { ShippingCompany } from './entities/shipping-company.entity';

/* DTO's */
import { UpdateShippingCompanyDto } from './dto/update-shipping-company.dto';

/* Faker */
import {
  generateShippingCompany,
  generateManyShippingCompanies,
} from '@faker/shippingCompany.faker';

describe('ShippingCompanyService', () => {
  let service: ShippingCompanyService;
  let repository: Repository<ShippingCompany>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShippingCompanyService,
        {
          provide: getRepositoryToken(ShippingCompany),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<ShippingCompanyService>(ShippingCompanyService);
    repository = module.get<Repository<ShippingCompany>>(
      getRepositoryToken(ShippingCompany),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count shipping companies services', () => {
    it('should return total all shipping companies', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(100);

      const { statusCode, total } = await service.countAll();
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(total).toEqual(100);
    });

    it('should return total shipping companies not removed', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(100);
      const { statusCode, total } = await service.count();
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(repository.count).toHaveBeenCalledWith({
        where: { isDeleted: false },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(100);
    });
  });

  describe('find shipping companies services', () => {
    it('findAll should return all shipping companies', async () => {
      const mocks = generateManyShippingCompanies(50);

      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mocks, mocks.length]);

      const { statusCode, data, total } = await service.findAll();
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false },
        order: { name: 'ASC' },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(mocks.length);
      expect(data).toEqual(mocks);
    });

    it('findOne should return a shipping companies', async () => {
      const paymentMethod = generateShippingCompany();
      const id = paymentMethod.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(paymentMethod);

      const { statusCode, data } = await service.findOne(id);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        relations: ['createdBy', 'updatedBy'],
        where: { id, isDeleted: false },
      });
      expect(statusCode).toBe(200);
      expect(data).toEqual(paymentMethod);
    });

    it('findOne should throw NotFoundException if shipping companies does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `The Shipping Company with id: ${id} not found`,
        );
      }
    });

    it('findOne should throw NotFoundException if shipping companies does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrowError(
        new NotFoundException(`The Shipping Company with id: ${id} not found`),
      );
    });

    it('findOneByName should return a shipping companies', async () => {
      const paymentMethod = generateShippingCompany();
      const name = paymentMethod.name;

      jest.spyOn(repository, 'findOne').mockResolvedValue(paymentMethod);

      const { statusCode, data } = await service.findOneByName(name);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(data).toEqual(paymentMethod);
    });

    it('findOneByName should throw NotFoundException if Shipping Company does not exist', async () => {
      const name = 'nameTest';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOneByName(name);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `The Shipping Company with name: ${name} not found`,
        );
      }
    });
  });

  describe('create shipping companies services', () => {
    it('create should return a Shipping Company', async () => {
      const paymentMethod = generateShippingCompany();

      jest.spyOn(repository, 'create').mockReturnValue(paymentMethod);
      jest.spyOn(repository, 'save').mockResolvedValue(paymentMethod);

      const { statusCode, data } = await service.create(paymentMethod);
      expect(statusCode).toBe(201);
      expect(data).toEqual(paymentMethod);
    });

    it('create should return Conflict Exception when name Shipping Company exists', async () => {
      const mock = generateShippingCompany();

      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      try {
        await service.create(mock);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `Shipping Company ${mock.name} already exists`,
        );
      }
    });
  });

  describe('update shipping companies services', () => {
    it('update should return message: have been modified', async () => {
      const mock = generateShippingCompany();
      const id = mock.id;
      const changes: UpdateShippingCompanyDto = { name: 'newName' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mock);
      jest.spyOn(repository, 'merge').mockReturnValue({ ...mock, ...changes });
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      const { statusCode, message } = await service.update(id, changes);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.merge).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(message).toEqual(
        `The Shipping Company with id: ${id} has been modified`,
      );
    });

    it('update should throw NotFoundException if Shipping Company does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.update(id, { name: 'newName' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `The Shipping Company with id: ${id} not found`,
        );
      }
    });
  });

  describe('remove shipping companies services', () => {
    it('remove should return status and message', async () => {
      const mock = generateShippingCompany();
      const id = mock.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(mock);
      jest
        .spyOn(repository, 'merge')
        .mockReturnValue({ ...mock, isDeleted: true });
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      const { statusCode, message } = await service.remove(id);
      expect(statusCode).toBe(200);
      expect(message).toEqual(
        `The Shipping Company with id: ${id} has been deleted`,
      );
    });

    it('remove should throw NotFoundException if Shipping Company does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrowError(
        new NotFoundException(`The Shipping Company with id: ${id} not found`),
      );
    });
  });
});
