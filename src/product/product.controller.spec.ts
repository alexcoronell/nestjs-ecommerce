/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { ProductController } from './product.controller';

/* Services */
import { ProductService } from './product.service';

/* Entities */
import { Product } from './entities/product.entity';

/* DTO's */
import { CreateProductDto } from './dto/create-product.dto';

/* Faker */
import {
  createProduct,
  generateProduct,
  generateManyProducts,
} from '@faker/product.faker';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProduct: Product = generateProduct();
  const mockProducts: Product[] = generateManyProducts(10);
  const mockNewProduct: CreateProductDto = createProduct();

  const mockService = {
    countAll: jest.fn().mockResolvedValue(mockProducts.length),
    count: jest.fn().mockResolvedValue(mockProducts.length),
    findAll: jest.fn().mockResolvedValue(mockProducts),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    findOneByName: jest.fn().mockResolvedValue(mockProduct),
    findByBrand: jest.fn().mockResolvedValue(mockProducts),
    create: jest.fn().mockResolvedValue(mockNewProduct),
    update: jest.fn().mockResolvedValue(1),
    remove: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count products controllers', () => {
    it('should call countAll product service', async () => {
      expect(await controller.countAll()).toBe(mockProducts.length);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });

    it('should call count product service', async () => {
      expect(await controller.count()).toBe(mockProducts.length);
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find products controllers', () => {
    it('should call findAll product service', async () => {
      expect(await controller.findAll()).toBe(mockProducts);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findOne product service', async () => {
      expect(await controller.findOne(1)).toBe(mockProduct);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return an product by name', async () => {
      expect(await controller.findOneByname(mockProduct.name));
      expect(service.findOneByName).toHaveBeenCalledTimes(1);
    });

    it('should call findByBrand product service', async () => {
      expect(await controller.findByBrand(1)).toBe(mockProducts);
      expect(service.findByBrand).toHaveBeenCalledTimes(1);
    });
  });

  describe('create products controller', () => {
    it('should call create shipping company service', async () => {
      const userId = 1;
      await controller.create(mockNewProduct, userId);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update products controller', () => {
    it('should call update products service', async () => {
      const userId = 1;
      const changes = { name: 'newName' };
      await controller.update(1, userId, changes);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove products controller', () => {
    it('shoudl call remove products service', async () => {
      const userId = 1;
      await controller.remove(1, userId);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
