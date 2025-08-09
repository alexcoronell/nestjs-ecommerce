/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Services */
import { BrandService } from '@brand/brand.service';

/* Entity */
import { Brand } from '@brand/entities/brand.entity';

/* DTO's */
import { UpdateBrandDto } from '@brand/dto/update-brand.dto';

/* Faker */
import { generateBrand, generateManyBrands } from '@faker/brand.faker';

describe('BrandService', () => {
  let service: BrandService;
  let repository: Repository<Brand>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        {
          provide: getRepositoryToken(Brand),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<BrandService>(BrandService);
    repository = module.get<Repository<Brand>>(getRepositoryToken(Brand));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('count brands services', () => {
    it('should return total all brands', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(100);

      const { statusCode, total } = await service.countAll();
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(total).toEqual(100);
    });

    it('should return total brands not removed', async () => {
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

  describe('find brands services', () => {
    it('findAll should return all brands', async () => {
      const brands = generateManyBrands(50);

      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([brands, brands.length]);

      const { statusCode, data, total } = await service.findAll();
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false },
        order: { name: 'ASC' },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(brands.length);
      expect(data).toEqual(brands);
    });

    it('findOne should return a brand', async () => {
      const brand = generateBrand();
      const id = brand.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(brand);

      const { statusCode, data } = await service.findOne(id);
      const dataBrand: Brand = data as Brand;
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        relations: ['createdBy', 'updatedBy'],
        where: { id, isDeleted: false },
      });
      expect(statusCode).toBe(200);
      expect(dataBrand).toEqual(brand);
    });

    it('findOne should throw NotFoundException if Brand does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The Brand with id: ${id} not found`);
      }
    });

    it('findOne should throw NotFoundException if brand does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrowError(
        new NotFoundException(`The Brand with id: ${id} not found`),
      );
    });

    it('findOneByName should return a brand', async () => {
      const brand = generateBrand();
      const name = brand.name;

      jest.spyOn(repository, 'findOne').mockResolvedValue(brand);

      const { statusCode, data } = await service.findOneByName(name);
      const dataBrand: Brand = data as Brand;
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(dataBrand).toEqual(brand);
    });

    it('findOneByName should throw NotFoundException if brand does not exist', async () => {
      const name = 'nameTest';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOneByName(name);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The Brand with name: ${name} not found`);
      }
    });
  });

  describe('create brand services', () => {
    it('create should return a brand', async () => {
      const brand = generateBrand();

      jest.spyOn(repository, 'create').mockReturnValue(brand);
      jest.spyOn(repository, 'save').mockResolvedValue(brand);

      const { statusCode, data } = await service.create(brand);
      expect(statusCode).toBe(201);
      expect(data).toEqual(brand);
    });

    it('create should return Conflict Exception when name brand exists', async () => {
      const brand = generateBrand();

      jest.spyOn(repository, 'create').mockReturnValue(brand);
      jest.spyOn(repository, 'save').mockResolvedValue(brand);

      try {
        await service.create(brand);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(`Brand ${brand.name} already exists`);
      }
    });
  });

  describe('update brand services', () => {
    it('update should return message: have been modified', async () => {
      const brand = generateBrand();
      const id = brand.id;
      const changes: UpdateBrandDto = { name: 'newName' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(brand);
      jest.spyOn(repository, 'merge').mockReturnValue({ ...brand, ...changes });
      jest.spyOn(repository, 'save').mockResolvedValue(brand);

      const { statusCode, message } = await service.update(id, changes);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.merge).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(message).toEqual(`The Brand with id: ${id} has been modified`);
    });

    it('update should throw NotFoundException if Brand does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.update(id, { name: 'newName' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The Brand with id: ${id} not found`);
      }
    });
  });

  describe('remove brand services', () => {
    it('remove should return status and message', async () => {
      const brand = generateBrand();
      const id = brand.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(brand);
      jest
        .spyOn(repository, 'merge')
        .mockReturnValue({ ...brand, isDeleted: true });
      jest.spyOn(repository, 'save').mockResolvedValue(brand);

      const { statusCode, message } = await service.remove(id);
      expect(statusCode).toBe(204);
      expect(message).toEqual(`The Brand with id: ${id} has been deleted`);
    });

    it('remove should throw NotFoundException if Brand does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrowError(
        new NotFoundException(`The Brand with id: ${id} not found`),
      );
    });
  });
});
