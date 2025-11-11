/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { ProductTagController } from './product-tag.controller';

/* Services */
import { ProductTagService } from './product-tag.service';

/* Interfaces */
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

/* Entities */
import { ProductTag } from './entities/product-tag.entity';

/* DTO's */
import { CreateProductTagDto } from './dto/create-product-tag.dto';

/* Faker */
import {
  createProductTag,
  generateProductTag,
  generateManyProductTags,
} from '../../faker/productTag.faker';

describe('ProductTagController', () => {
  let controller: ProductTagController;
  let service: ProductTagService;

  const mockProductTag: ProductTag = generateProductTag();
  const mockProductTags: ProductTag[] = generateManyProductTags(10);
  const mockNewProductTag: CreateProductTagDto = createProductTag();

  const mockService = {
    countAll: jest.fn().mockResolvedValue(mockProductTags.length),
    findAll: jest.fn().mockResolvedValue(mockProductTags),
    findAllByProduct: jest.fn().mockResolvedValue(mockProductTags),
    findAllByTag: jest.fn().mockResolvedValue(mockProductTags),
    findOne: jest.fn().mockResolvedValue(mockProductTag),
    create: jest.fn().mockResolvedValue(mockNewProductTag),
    delete: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductTagController],
      providers: [
        {
          provide: ProductTagService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductTagController>(ProductTagController);
    service = module.get<ProductTagService>(ProductTagService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count product tag controllers', () => {
    it('should call countAll product tag service', async () => {
      expect(await controller.countAll()).toBe(mockProductTags.length);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find product tag controllers', () => {
    it('should call findAll product service', async () => {
      expect(await controller.findAll()).toBe(mockProductTags);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findAllByProduct product service', async () => {
      expect(await controller.findAllByProduct(1)).toBe(mockProductTags);
      expect(service.findAllByProduct).toHaveBeenCalledTimes(1);
    });

    it('should call findAllByTag product service', async () => {
      expect(await controller.findAllByTag(1)).toBe(mockProductTags);
      expect(service.findAllByTag).toHaveBeenCalledTimes(1);
    });

    it('should call findOne product service', async () => {
      expect(await controller.findOne({ productId: 1, tagId: 1 })).toBe(
        mockProductTag,
      );
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create product tag controller', () => {
    it('should call create product tag service', async () => {
      const request = { user: 1 };
      await controller.create(mockNewProductTag, request as AuthRequest);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove product tag controller', () => {
    it('should call remove product tag service', async () => {
      await controller.delete({ productId: 1, tagId: 1 });
      expect(service.delete).toHaveBeenCalledTimes(1);
    });
  });
});
