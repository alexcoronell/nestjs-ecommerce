/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Services */
import { ProductDiscountService } from './product-discount.service';

/* Entity */
import { ProductDiscount } from './entities/product-discount.entity';

/* Faker */
import {
  createProductDiscount,
  generateProductDiscount,
  generateManyProductDiscounts,
} from '@faker/productDiscount.faker';

describe('ProductDiscountService', () => {
  let service: ProductDiscountService;
  let repository: Repository<ProductDiscount>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductDiscountService,
        {
          provide: getRepositoryToken(ProductDiscount),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<ProductDiscountService>(ProductDiscountService);
    repository = module.get<Repository<ProductDiscount>>(
      getRepositoryToken(ProductDiscount),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count product discounts services', () => {
    it('should return total all product discounts', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(100);

      const { statusCode, total } = await service.countAll();
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(total).toEqual(100);
    });
  });

  describe('find product discounts services', () => {
    it('findAll should return all product discoutns', async () => {
      const mocks = generateManyProductDiscounts(50);

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

    it('findOne should return a product discount by criteria', async () => {
      const mockProductDiscount = generateProductDiscount();
      const criteria = {
        productId: mockProductDiscount.productId,
        discountId: mockProductDiscount.discountId,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProductDiscount);

      const result = await service.findOne(criteria);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: criteria });
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual(mockProductDiscount);
    });

    it('findOne should throw NotFoundException if product discount does not exist', async () => {
      const criteria = { productId: 999, discountId: 888 };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(criteria)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({ where: criteria });
    });

    it('findOne should return a product discount by only productId', async () => {
      const mockProductDiscount = generateProductDiscount();
      const criteria = { productId: mockProductDiscount.productId };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProductDiscount);

      const result = await service.findOne(criteria);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: criteria });
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual(mockProductDiscount);
    });

    it('findOne should return a product discount by only discountId', async () => {
      const mockProductDiscount = generateProductDiscount();
      const criteria = { discountId: mockProductDiscount.discountId };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProductDiscount);

      const result = await service.findOne(criteria);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: criteria });
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual(mockProductDiscount);
    });

    it('findOne should throw NotFoundException if only discountId does not exist', async () => {
      const criteria = { discountId: 54321 };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(criteria)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({ where: criteria });
    });

    it('findAllByProduct should return product discounts by product id', async () => {
      const mocks = generateManyProductDiscounts(10);
      const productId = mocks[0].productId;

      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mocks, mocks.length]);

      const { statusCode, data, total } =
        await service.findAllByProduct(productId);
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        relations: ['product', 'discount'],
        where: { product: productId },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(mocks.length);
      expect(data).toEqual(mocks);
    });

    it('findAllByDiscount should return product discounts by discount id', async () => {
      const mocks = generateManyProductDiscounts(10);
      const discountId = mocks[0].discountId;

      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mocks, mocks.length]);

      const { statusCode, data, total } =
        await service.findAllByDiscount(discountId);
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        relations: ['product', 'discount'],
        where: { discount: discountId },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(mocks.length);
      expect(data).toEqual(mocks);
    });

    it('findOne should throw NotFoundException if only productId does not exist', async () => {
      const criteria = { productId: 12345 };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(criteria)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({ where: criteria });
    });
  });

  describe('create product discount services', () => {
    it('should create a new product discount', async () => {
      const dto = createProductDiscount();
      const createdEntity = { ...dto, id: 1 };

      jest
        .spyOn(repository, 'create')
        .mockReturnValue(createdEntity as unknown as ProductDiscount);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(createdEntity as unknown as ProductDiscount);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(createdEntity);
      expect(result.statusCode).toBe(201);
      expect(result.data).toEqual(createdEntity);
    });

    it('should create multiple product discounts when array is provided', async () => {
      const dtos = generateManyProductDiscounts(3);
      const createdEntities = dtos.map((dto, idx) => ({ ...dto, id: idx + 1 }));

      jest.spyOn(repository, 'create').mockReturnValue(createdEntities as any);
      jest.spyOn(repository, 'save').mockResolvedValue(createdEntities as any);

      const result = await service.createMany(dtos);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(dtos);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(createdEntities);
      expect(result.statusCode).toBe(201);
      expect(result.data).toEqual(createdEntities);
    });

    it('should create a single product discount when object is provided to createMany', async () => {
      const dto = createProductDiscount();
      const createdEntity = { ...dto, id: 1 };

      jest.spyOn(repository, 'create').mockReturnValue([createdEntity] as any);
      jest.spyOn(repository, 'save').mockResolvedValue([createdEntity] as any);

      const result = await service.createMany(dto);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith([dto]);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith([createdEntity]);
      expect(result.statusCode).toBe(201);
      expect(result.data).toEqual([createdEntity]);
    });

    xit('create should return ConflictException when product discount already exists', async () => {
      const dto = createProductDiscount();
      const existingEntity = { ...dto, id: 1 };

      jest
        .spyOn(repository, 'create')
        .mockReturnValue(existingEntity as unknown as ProductDiscount);
      // Simulate TypeORM throwing a duplicate error (e.g., unique constraint violation)
      jest.spyOn(repository, 'save').mockRejectedValue({
        code: '23505', // Postgres unique violation
        detail:
          'The Product Discount with (product_id, discount_id) already exists.',
      });

      try {
        await service.create(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toContain('The Product Discount already exists');
      }
    });

    it('should throw an error when trying to create a product discount that already exists', async () => {
      const dto = createProductDiscount();
      const existingEntity = { ...dto, id: 1 };

      // Simulate that the product discount already exists in the DB
      jest
        .spyOn(repository, 'create')
        .mockReturnValue(existingEntity as unknown as ProductDiscount);
      // Simulate TypeORM throwing a duplicate error (e.g., unique constraint violation)
      jest.spyOn(repository, 'save').mockRejectedValue({
        code: '23505', // Postgres unique violation
        detail:
          'The Product Discount with (product_id, discount_id) already exists.',
      });

      await expect(service.create(dto)).rejects.toMatchObject({
        code: '23505',
      });

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(existingEntity);
    });
  });

  describe('delete product discount services', () => {
    it('should delete a product discount by criteria', async () => {
      const criteria = { productId: 1, discountId: 2 };
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.delete(criteria);

      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(criteria);
      expect(result.statusCode).toBe(200);
      expect(result.message).toContain('deleted successfully');
    });

    it('should throw NotFoundException if no product discount matches criteria', async () => {
      const criteria = { productId: 999, discountId: 888 };
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.delete(criteria)).rejects.toThrow(NotFoundException);
      expect(repository.delete).toHaveBeenCalledWith(criteria);
    });

    it('should delete a product discount by only productId', async () => {
      const criteria = { productId: 5 };
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.delete(criteria);

      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(criteria);
      expect(result.statusCode).toBe(200);
      expect(result.message).toContain('deleted successfully');
    });

    it('should delete a product discount by only discountId', async () => {
      const criteria = { discountId: 10 };
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.delete(criteria);

      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(repository.delete).toHaveBeenCalledWith(criteria);
      expect(result.statusCode).toBe(200);
      expect(result.message).toContain('deleted successfully');
    });

    it('should throw NotFoundException if only productId does not exist', async () => {
      const criteria = { productId: 12345 };
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.delete(criteria)).rejects.toThrow(NotFoundException);
      expect(repository.delete).toHaveBeenCalledWith(criteria);
    });

    it('should throw NotFoundException if only discountId does not exist', async () => {
      const criteria = { discountId: 54321 };
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.delete(criteria)).rejects.toThrow(NotFoundException);
      expect(repository.delete).toHaveBeenCalledWith(criteria);
    });
  });
});
