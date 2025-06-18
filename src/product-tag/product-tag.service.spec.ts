/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Services */
import { ProductTagService } from '@product_tag/product-tag.service';

/* Entity */
import { ProductTag } from '@product_tag/entities/product-tag.entity';

/* Faker */
import {
  createProductTag,
  generateProductTag,
  generateManyProductTags,
} from '@faker/productTag.faker';

describe('ProductTagService', () => {
  let service: ProductTagService;
  let repository: Repository<ProductTag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductTagService,
        {
          provide: getRepositoryToken(ProductTag),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<ProductTagService>(ProductTagService);
    repository = module.get<Repository<ProductTag>>(
      getRepositoryToken(ProductTag),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count products tags services', () => {
    it('should return total all products tags', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(100);

      const { statusCode, total } = await service.countAll();
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(total).toEqual(100);
    });
  });

  describe('find products tags services', () => {
    it('findAll should return all product tags', async () => {
      const mocks = generateManyProductTags(50);

      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mocks, mocks.length]);

      const { statusCode, data, total } = await service.findAll();
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith();
      expect(statusCode).toBe(200);
      expect(total).toEqual(mocks.length);
      expect(data).toEqual(mocks);
    });

    it('findOne should return a product tag', async () => {
      const mock = generateProductTag();
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

    it('findOne should throw NotFoundException if  tags does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The Product Tag with id: ${id} not found`);
      }
    });

    it('findOne should throw NotFoundException if product tag does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrowError(
        new NotFoundException(`The Product Tag with id: ${id} not found`),
      );
    });

    it('findAllByProduct should return products tags', async () => {
      const mocks = generateManyProductTags(10);

      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mocks, mocks.length]);

      const { statusCode, data } = await service.findAllByProduct(1);
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(data).toEqual(mocks);
    });

    it('findAllByTag should return products tags', async () => {
      const mocks = generateManyProductTags(10);

      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mocks, mocks.length]);

      const { statusCode, data } = await service.findAllByTag(1);
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(data).toEqual(mocks);
    });
  });

  describe('create product tags service', () => {
    it('should create a single product tag', async () => {
      const dto = createProductTag();
      const createdMock = { id: 1, ...dto };
      // repo.create returns entity/entities, repo.save returns saved entity/entities
      jest
        .spyOn(repository, 'create')
        .mockReturnValue([createdMock] as unknown as ProductTag);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue([createdMock] as unknown as ProductTag);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith([dto]);
      expect(repository.save).toHaveBeenCalledWith([createdMock]);
      expect(result.statusCode).toBe(201);
      expect(result.data).toEqual([createdMock]);
      expect(result.message).toBe('The Product Tags were created');
    });

    it('should create multiple product tags', async () => {
      const dtos = [createProductTag(), createProductTag()];
      const createdMocks = [
        { id: 1, ...dtos[0] },
        { id: 2, ...dtos[1] },
      ];
      jest
        .spyOn(repository, 'create')
        .mockReturnValue(createdMocks as unknown as ProductTag);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(createdMocks as unknown as ProductTag);

      const result = await service.create(dtos as any);

      expect(repository.create).toHaveBeenCalledWith(dtos);
      expect(repository.save).toHaveBeenCalledWith(createdMocks);
      expect(result.statusCode).toBe(201);
      expect(result.data).toEqual(createdMocks);
      expect(result.message).toBe('The Product Tags were created');
    });
  });

  describe('remove product tag service', () => {
    it('should remove a product tag successfully', async () => {
      const mock = generateProductTag();
      const id = mock.id;

      jest.spyOn(service, 'findOne').mockResolvedValue({
        statusCode: 200,
        data: mock,
      } as any);
      jest.spyOn(repository, 'delete').mockResolvedValue({} as any);

      const result = await service.remove(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(repository.delete).toHaveBeenCalledWith(id);
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe(
        `The Product Tag with id: ${id} has been deleted`,
      );
    });

    it('should throw NotFoundException if product tag does not exist', async () => {
      const id = 999;
      jest.spyOn(service, 'findOne').mockImplementation(async () => {
        throw new NotFoundException(`The Product Tag with id: ${id} not found`);
      });

      await expect(service.remove(id)).rejects.toThrowError(
        new NotFoundException(`The Product Tag with id: ${id} not found`),
      );
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });
});
