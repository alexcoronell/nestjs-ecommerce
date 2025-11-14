/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { ProductDiscountController } from './product-discount.controller';

/* Services */
import { ProductDiscountService } from './product-discount.service';

/* Interfaces */
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

/* Entities */
import { ProductDiscount } from './entities/product-discount.entity';

/* DTO's */
import { CreateProductDiscountDto } from './dto/create-product-discount.dto';

/* Faker */
import {
  createProductDiscount,
  generateProductDiscount,
  generateManyProductDiscounts,
} from '@faker/productDiscount.faker';

describe('ProductDiscountController', () => {
  let controller: ProductDiscountController;
  let service: ProductDiscountService;

  const mockProductDiscount: ProductDiscount = generateProductDiscount();
  const mockProductDiscounts: ProductDiscount[] =
    generateManyProductDiscounts(10);
  const mockNewProductDiscount: CreateProductDiscountDto =
    createProductDiscount();

  const mockResult = { statusCode: 200, data: mockProductDiscount };
  const mockResultArray = {
    statusCode: 200,
    data: mockProductDiscounts,
    total: mockProductDiscounts.length,
  };
  const mockCreateResult = {
    statusCode: 201,
    data: mockProductDiscount,
    message: 'Product Discount created successfully',
  };
  const mockCreateManyResult = {
    statusCode: 201,
    data: mockProductDiscounts,
    message: 'The Product Discounts were created',
  };
  const mockDeleteResult = { statusCode: 200, message: 'Deleted' };
  const mockCountResult = {
    statusCode: 200,
    total: mockProductDiscounts.length,
  };

  const mockService = {
    countAll: jest.fn().mockResolvedValue(mockCountResult),
    findAll: jest.fn().mockResolvedValue(mockResultArray),
    findAllByProduct: jest.fn().mockResolvedValue(mockResultArray),
    findAllByDiscount: jest.fn().mockResolvedValue(mockResultArray),
    findOne: jest.fn().mockResolvedValue(mockResult),
    create: jest.fn().mockResolvedValue(mockCreateResult),
    createMany: jest.fn().mockResolvedValue(mockCreateManyResult),
    delete: jest.fn().mockResolvedValue(mockDeleteResult),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductDiscountController],
      providers: [
        {
          provide: ProductDiscountService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductDiscountController>(
      ProductDiscountController,
    );
    service = module.get<ProductDiscountService>(ProductDiscountService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count product discounts controller', () => {
    it('should call countAll productDiscount service', async () => {
      expect(await controller.countAll()).toBe(mockCountResult);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find product discounts controllers', () => {
    it('should call findAll productDiscount service', async () => {
      expect(await controller.findAll()).toBe(mockResultArray);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findAllByProduct productDiscount service', async () => {
      expect(await controller.findAllByProduct(1)).toBe(mockResultArray);
      expect(service.findAllByProduct).toHaveBeenCalledTimes(1);
    });

    it('should call findAllByDiscount productDiscount service', async () => {
      expect(await controller.findAllByDiscount(1)).toBe(mockResultArray);
      expect(service.findAllByDiscount).toHaveBeenCalledTimes(1);
    });

    it('should call findOne productDiscount service', async () => {
      const criteria = { productId: 1, discountId: 2 };
      expect(await controller.findOne(criteria)).toBe(mockResult);
      expect(service.findOne).toHaveBeenCalledWith(criteria);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('Create product discounts controller', () => {
    it('should call create productDiscount service', async () => {
      const request = { user: 1 };
      expect(
        await controller.create(mockNewProductDiscount, request as AuthRequest),
      ).toBe(mockCreateResult);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should call createMany productDiscount service with array', async () => {
      const request = { user: 1 };
      expect(
        await controller.createMany(
          [mockNewProductDiscount],
          request as AuthRequest,
        ),
      ).toBe(mockCreateManyResult);
      expect(service.createMany).toHaveBeenCalledTimes(1);
    });

    it('should call createMany productDiscount service with single dto', async () => {
      const request = { user: 1 };
      expect(
        await controller.createMany(
          mockNewProductDiscount,
          request as AuthRequest,
        ),
      ).toBe(mockCreateManyResult);
      expect(service.createMany).toHaveBeenCalledTimes(2); // Called twice now
    });
  });

  describe('Delete product discounts controller', () => {
    it('should call delete productDiscount service', async () => {
      const criteria = { productId: 1, discountId: 2 };
      expect(await controller.delete(criteria)).toBe(mockDeleteResult);
      expect(service.delete).toHaveBeenCalledWith(criteria);
      expect(service.delete).toHaveBeenCalledTimes(1);
    });
  });
});
