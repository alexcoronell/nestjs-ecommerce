/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Services */
import { ProductImagesService } from '@product_images/product-images.service';

/* Entity */
import { ProductImage } from './entities/product-image.entity';

/* DTO's */
import { UpdateProductImageDto } from './dto/update-product-image.dto';

/* Faker */
import {
  generateProductImage,
  generateManyProductImages,
} from '@faker/productImage.faker';

describe('ProductImagesService', () => {
  let service: ProductImagesService;
  let repository: Repository<ProductImage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductImagesService,
        {
          provide: getRepositoryToken(ProductImage),
          useClass: Repository,
        },
      ],
    }).compile();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    service = module.get<ProductImagesService>(ProductImagesService);
    repository = module.get<Repository<ProductImage>>(
      getRepositoryToken(ProductImage),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find product images services', () => {
    it('findAll should return all product Images', async () => {
      const mocks = generateManyProductImages(50);

      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mocks, mocks.length]);

      const { statusCode, data, total } = await service.findAll();
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false },
        order: { title: 'ASC' },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(mocks.length);
      expect(data).toEqual(mocks);
    });

    it('findOne should return a product image', async () => {
      const mock = generateProductImage();
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

    it('findOne should throw NotFoundException if product image does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `The Product Image with id: ${id} not found`,
        );
      }
    });

    it('findOne should throw NotFoundException if product image does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrowError(
        new NotFoundException(`The Product Image with id: ${id} not found`),
      );
    });
  });

  describe('create product images services', () => {
    it('create should return a Product Image', async () => {
      const mock = generateProductImage();

      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      const { statusCode, data } = await service.create(mock);
      expect(statusCode).toBe(201);
      expect(data).toEqual(mock);
    });
  });

  describe('update product images services', () => {
    it('update should return message: have been modified', async () => {
      const mock = generateProductImage();
      const id = mock.id;
      const changes: UpdateProductImageDto = { title: 'newTitle' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mock);
      jest.spyOn(repository, 'merge').mockReturnValue({ ...mock, ...changes });
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      const { statusCode, message } = await service.update(id, changes);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.merge).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(message).toEqual(
        `The Product Image with id: ${id} has been modified`,
      );
    });

    it('update should throw NotFoundException if Product Image does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.update(id, { title: 'newTitle' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `The Product Image with id: ${id} not found`,
        );
      }
    });
  });

  describe('remove product image services', () => {
    it('remove should return status and message', async () => {
      const mock = generateProductImage();
      const id = mock.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(mock);
      jest
        .spyOn(repository, 'merge')
        .mockReturnValue({ ...mock, isDeleted: true });
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      const { statusCode, message } = await service.remove(id);
      expect(statusCode).toBe(200);
      expect(message).toEqual(
        `The Product Image with id: ${id} has been deleted`,
      );
    });

    it('remove should throw NotFoundException if Product Image does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrowError(
        new NotFoundException(`The Product Image with id: ${id} not found`),
      );
    });
  });
});
