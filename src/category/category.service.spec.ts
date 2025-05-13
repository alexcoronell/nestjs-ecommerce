/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

/* Services */
import { CategoryService } from './category.service';

/* Entity */
import { Category } from './entities/category.entity';

/* DTO's */
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  createCategory,
  generateCategory,
  generateManyCategories,
} from '@faker/category.faker';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<CategoryService>(CategoryService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count categories services', () => {
    it('should return total all categories', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(100);

      const { statusCode, total } = await service.countAll();
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(total).toEqual(100);
    });

    it('should return total users not removed', async () => {
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

  describe('find categories services', () => {
    it('findAll should return all categories', async () => {
      const categories = generateManyCategories(50);

      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([categories, categories.length]);

      const { statusCode, data, total } = await service.findAll();
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false },
        order: { name: 'ASC' },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(categories.length);
      expect(data).toEqual(categories);
    });

    it('findOne should return a category', async () => {
      const category = generateCategory();
      const id = category.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(category);

      const { statusCode, data } = await service.findOne(id);
      const dataCategory: Category = data as Category;
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        relations: ['createdBy', 'updatedBy'],
        where: { id, isDeleted: false },
      });
      expect(statusCode).toBe(200);
      expect(dataCategory).toEqual(category);
    });

    it('findOne should throw NotFoundException if category does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The Category with id: ${id} not found`);
      }
    });

    it('findOne should throw NotFoundException if category does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrowError(
        new NotFoundException(`The Category with id: ${id} not found`),
      );
    });

    it('findOneByName should return a category', async () => {
      const category = generateCategory();
      const name = category.name;

      jest.spyOn(repository, 'findOne').mockResolvedValue(category);

      const { statusCode, data } = await service.findOneByName(name);
      const dataCategory: Category = data as Category;
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(dataCategory).toEqual(category);
    });

    it('findOneByName should throw NotFoundException if category does not exist', async () => {
      const name = 'nameTest';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOneByName(name);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The Category with name: ${name} not found`);
      }
    });
  });

  describe('create category services', () => {
    it('create should return a category', async () => {
      const category = generateCategory();

      jest.spyOn(repository, 'create').mockReturnValue(category);
      jest.spyOn(repository, 'save').mockResolvedValue(category);

      const { statusCode, data } = await service.create(category);
      expect(statusCode).toBe(201);
      expect(data).toEqual(category);
    });

    it('create should return Conflict Exception when name category exists', async () => {
      const category = generateCategory();

      jest.spyOn(repository, 'create').mockReturnValue(category);
      jest.spyOn(repository, 'save').mockResolvedValue(category);

      try {
        await service.create(category);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(`Category ${category.name} already exists`);
      }
    });
  });
});
