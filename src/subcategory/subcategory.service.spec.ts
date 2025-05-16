/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Services */
import { SubcategoryService } from './subcategory.service';

/* Entity */
import { Subcategory } from './entities/subcategory.entity';

/* DTO's */
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

/* Faker */
import {
  generateSubcategory,
  generateManySubcategories,
} from '@faker/subcategory.faker';

describe('SubcategoryService', () => {
  let service: SubcategoryService;
  let repository: Repository<Subcategory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubcategoryService,
        {
          provide: getRepositoryToken(Subcategory),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<SubcategoryService>(SubcategoryService);
    repository = module.get<Repository<Subcategory>>(
      getRepositoryToken(Subcategory),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count subcategories services', () => {
    it('should return total all subcategories', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(100);

      const { statusCode, total } = await service.countAll();
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(total).toEqual(100);
    });

    it('should return total subcategories not removed', async () => {
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

  describe('find subcategories services', () => {
    it('findAll should return all subcategories', async () => {
      const mock = generateManySubcategories(50);
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mock, mock.length]);

      const { statusCode, data, total } = await service.findAll();
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false },
        order: { name: 'ASC' },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(mock.length);
      expect(data).toEqual(mock);
    });

    it('findAll by category should returns all subcategories by category', async () => {
      const categoryId = 3;
      const mock = generateManySubcategories(3, categoryId);
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mock, mock.length]);
      const { statusCode, data, total } =
        await service.findAllByCategory(categoryId);
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { category: categoryId, isDeleted: false },
        order: { name: 'ASC' },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(mock.length);
      expect(data).toEqual(mock);
    });

    it('findAllByCategoryAndName should returns all subcategories by category and name', async () => {
      const categoryId = 3;
      const tagNameTest = 'tagNameTest';
      const mock = generateManySubcategories(1, categoryId, tagNameTest);
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mock, mock.length]);
      const { statusCode, data, total } =
        await service.findAllByCategoryAndName(categoryId, tagNameTest);

      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { category: categoryId, name: tagNameTest },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(mock.length);
      expect(data).toEqual(mock);
    });

    it('findOne should return a subcategory', async () => {
      const mock = generateSubcategory();
      const id = mock.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(mock);

      const { statusCode, data } = await service.findOne(id);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        relations: ['createdBy', 'updatedBy'],
        where: { id, isDeleted: false },
      });
      expect(statusCode).toBe(200);
      expect(data).toEqual(mock);
    });

    it('findOne should throw NotFoundException if subcategory does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The Subcategory with id: ${id} not found`);
      }
    });

    it('findOne should throw NotFoundException if subcategory does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrowError(
        new NotFoundException(`The Subcategory with id: ${id} not found`),
      );
    });

    it('findOneByName should return a subcategory', async () => {
      const mock = generateSubcategory();
      const name = mock.name;

      jest.spyOn(repository, 'findOne').mockResolvedValue(mock);

      const { statusCode, data } = await service.findOneByName(name);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(data).toEqual(mock);
    });

    it('findOneByName should throw NotFoundException if subcategory does not exist', async () => {
      const name = 'nameTest';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOneByName(name);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `The Subcategory with name: ${name} not found`,
        );
      }
    });
  });

  describe('create subcategory services', () => {
    it('create should return a subcategory', async () => {
      const mock = generateSubcategory();
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([[], 0]);
      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      const { statusCode, data } = await service.create(mock);
      expect(statusCode).toBe(201);
      expect(data).toEqual(mock);
    });

    it('create should return Conflict Exception when name subcategory exists with the same category', async () => {
      const mock = generateSubcategory();
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([[mock], 1]);
      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      try {
        await service.create(mock);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `The Subcategory already exists in this category`,
        );
      }
    });
  });

  describe('update subcategory services', () => {
    it('update should return message: have been modified', async () => {
      const mock = generateSubcategory();
      const id = mock.id;
      const changes: UpdateSubcategoryDto = { name: 'newName' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mock);
      jest.spyOn(repository, 'merge').mockReturnValue({ ...mock, ...changes });
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      const { statusCode, message } = await service.update(id, changes);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.merge).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(message).toEqual(
        `The Subcategory with id: ${id} has been modified`,
      );
    });

    it('update should return Conflict Exception when name subcategory exists with the same category', async () => {
      const mock = generateSubcategory();
      const id = mock.id;
      const changes: UpdateSubcategoryDto = { name: 'newName' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mock);
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([[{ ...mock, ...changes }], 1]);
      jest.spyOn(repository, 'merge').mockReturnValue({ ...mock, ...changes });
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      try {
        console.log('try');
        await service.update(id, changes);
      } catch (error) {
        console.log('catch');
        console.log(error);
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `The Subcategory already exists in other category`,
        );
      }
    });

    it('update should throw NotFoundException if Subcategory does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.update(id, { name: 'newName' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The Subcategory with id: ${id} not found`);
      }
    });
  });

  describe('remove subcategory services', () => {
    it('remove should return status and message', async () => {
      const data = generateSubcategory();
      const id = data.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(data);
      jest
        .spyOn(repository, 'merge')
        .mockReturnValue({ ...data, isDeleted: true });
      jest.spyOn(repository, 'save').mockResolvedValue(data);

      const { statusCode, message } = await service.remove(id);
      expect(statusCode).toBe(200);
      expect(message).toEqual(
        `The Subcategory with id: ${id} has been deleted`,
      );
    });

    it('remove should throw NotFoundException if subcategory does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrowError(
        new NotFoundException(`The Subcategory with id: ${id} not found`),
      );
    });
  });
});
