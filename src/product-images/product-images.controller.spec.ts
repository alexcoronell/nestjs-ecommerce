/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { ProductImagesController } from '@product_images/product-images.controller';

/* Services */
import { ProductImagesService } from '@product_images/product-images.service';

/* Interfaces */
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

/* Entities */
import { ProductImage } from './entities/product-image.entity';

/* DTO's */
import { CreateProductImageDto } from './dto/create-product-image.dto';

/* Faker */
import {
  createProductImage,
  generateProductImage,
  generateManyProductImages,
} from '@faker/productImage.faker';

describe('ProductImagesController', () => {
  let controller: ProductImagesController;
  let service: ProductImagesService;

  const mockProductImage: ProductImage = generateProductImage();
  const mockProductImages: ProductImage[] = generateManyProductImages(10);
  const mockNewProductImage: CreateProductImageDto = createProductImage();

  const mockService = {
    countAll: jest.fn().mockResolvedValue(mockProductImages.length),
    count: jest.fn().mockResolvedValue(mockProductImages.length),
    findAll: jest.fn().mockResolvedValue(mockProductImages),
    findOne: jest.fn().mockResolvedValue(mockProductImage),
    create: jest.fn().mockResolvedValue(mockNewProductImage),
    update: jest.fn().mockResolvedValue(1),
    remove: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductImagesController],
      providers: [
        {
          provide: ProductImagesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductImagesController>(ProductImagesController);
    service = module.get<ProductImagesService>(ProductImagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count product images controllers', () => {
    it('should call countAll product service', async () => {
      expect(await controller.countAll()).toBe(mockProductImages.length);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });

    it('should call count product service', async () => {
      expect(await controller.count()).toBe(mockProductImages.length);
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find product images controllers', () => {
    it('should call findAll product service', async () => {
      expect(await controller.findAll()).toBe(mockProductImages);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findOne product service', async () => {
      expect(await controller.findOne(1)).toBe(mockProductImage);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create product images controller', () => {
    it('should call create shipping company service', async () => {
      const request = { user: 1 };
      await controller.create(mockNewProductImage, request as AuthRequest);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update products images supplier controller', () => {
    it('should call update product image service', async () => {
      const request = { user: 1 };
      const changes = { title: 'new title' };
      await controller.update(1, request as AuthRequest, changes);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove product images controller', () => {
    it('shoudl call remove product images service', async () => {
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
