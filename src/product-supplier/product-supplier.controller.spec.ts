/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { ProductSupplierController } from './product-supplier.controller';

/* Services */
import { ProductSupplierService } from './product-supplier.service';

/* Interfaces */
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

/* Entities */
import { ProductSupplier } from './entities/product-supplier.entity';

/* DTO's */
import { CreateProductSupplierDto } from './dto/create-product-supplier.dto';

/* Faker */
import {
  createProductSupplier,
  generateProductSupplier,
  generateManyProductSuppliers,
} from '../../faker/productSupplier.faker';

describe('ProductSupplierController', () => {
  let controller: ProductSupplierController;
  let service: ProductSupplierService;

  const mockProductSupplier: ProductSupplier = generateProductSupplier();
  const mockProductSuppliers: ProductSupplier[] =
    generateManyProductSuppliers(10);
  const mockNewProductSupplier: CreateProductSupplierDto =
    createProductSupplier();

  const mockService = {
    countAll: jest.fn().mockResolvedValue(mockProductSuppliers.length),
    count: jest.fn().mockResolvedValue(mockProductSuppliers.length),
    findAll: jest.fn().mockResolvedValue(mockProductSuppliers),
    findAllByProduct: jest.fn().mockResolvedValue(mockProductSuppliers),
    findAllBySupplier: jest.fn().mockResolvedValue(mockProductSuppliers),
    findOne: jest.fn().mockResolvedValue(mockProductSupplier),
    create: jest.fn().mockResolvedValue(mockNewProductSupplier),
    update: jest.fn().mockResolvedValue(1),
    remove: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductSupplierController],
      providers: [
        {
          provide: ProductSupplierService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductSupplierController>(
      ProductSupplierController,
    );
    service = module.get<ProductSupplierService>(ProductSupplierService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count products suppliers controllers', () => {
    it('should call countAll product supplier service', async () => {
      expect(await controller.countAll()).toBe(mockProductSuppliers.length);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });

    it('should call count product supplier service', async () => {
      expect(await controller.count()).toBe(mockProductSuppliers.length);
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find product supplier controllers', () => {
    it('should call findAll product supplier service', async () => {
      expect(await controller.findAll()).toBe(mockProductSuppliers);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findAllByProduct product supplier service', async () => {
      expect(await controller.findAllByProduct(1)).toBe(mockProductSuppliers);
      expect(service.findAllByProduct).toHaveBeenCalledTimes(1);
    });

    it('should call findAllBySupplier product supplier service', async () => {
      expect(await controller.findAllBySupplier(1)).toBe(mockProductSuppliers);
      expect(service.findAllBySupplier).toHaveBeenCalledTimes(1);
    });

    it('should call findOne product supplier service', async () => {
      expect(await controller.findOne(1)).toBe(mockProductSupplier);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create products controller', () => {
    it('should call create product supplier service', async () => {
      const request = { user: 1 };
      await controller.create(mockNewProductSupplier, request as AuthRequest);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update products supplier controller', () => {
    it('should call update product supplier service', async () => {
      const request = { user: 1 };
      const changes = { costPrice: 100 };
      await controller.update(1, request as AuthRequest, changes);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove products supplier controller', () => {
    it('should call remove product supplier service', async () => {
      const request = { user: 1 };
      await controller.remove(1, request as AuthRequest);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
