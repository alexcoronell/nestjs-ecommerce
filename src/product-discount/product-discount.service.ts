import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Entities */
import { ProductDiscount } from './entities/product-discount.entity';
import { Product } from '@product/entities/product.entity';
import { Discount } from '@discount/entities/discount.entity';

/* DTO's */
import { CreateProductDiscountDto } from './dto/create-product-discount.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class ProductDiscountService {
  constructor(
    @InjectRepository(ProductDiscount)
    private readonly repo: Repository<ProductDiscount>,
  ) {}

  async countAll() {
    const total = await this.repo.count();
    return { statusCode: HttpStatus.OK, total };
  }

  async findAll(): Promise<Result<ProductDiscount[]>> {
    const [productDiscounts, total] = await this.repo.findAndCount();

    return {
      statusCode: HttpStatus.OK,
      data: productDiscounts,
      total,
    };
  }

  async findOne(
    criteria: Partial<Pick<ProductDiscount, 'productId' | 'discountId'>>,
  ): Promise<Result<ProductDiscount>> {
    const productDiscount = await this.repo.findOne({
      where: criteria,
    });
    if (!productDiscount) {
      throw new NotFoundException(
        `The Product Discount with criteria: ${JSON.stringify(criteria)} not found`,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      data: productDiscount,
    };
  }

  async findAllByProduct(
    id: Product['id'],
  ): Promise<Result<ProductDiscount[]>> {
    const [productDiscounts, total] = await this.repo.findAndCount({
      relations: ['product', 'discount'],
      where: { product: id },
    });
    return {
      statusCode: HttpStatus.OK,
      data: productDiscounts,
      total,
    };
  }

  async findAllByDiscount(
    id: Discount['id'],
  ): Promise<Result<ProductDiscount[]>> {
    const [productDiscounts, total] = await this.repo.findAndCount({
      relations: ['product', 'discount'],
      where: { discount: id },
    });
    return {
      statusCode: HttpStatus.OK,
      data: productDiscounts,
      total,
    };
  }

  async create(
    createProductDiscountDto: CreateProductDiscountDto,
  ): Promise<Result<ProductDiscount>> {
    const productDiscount = this.repo.create(createProductDiscountDto);
    await this.repo.save(productDiscount);
    return {
      statusCode: HttpStatus.CREATED,
      data: productDiscount,
    };
  }

  async createMany(
    dtos: CreateProductDiscountDto | CreateProductDiscountDto[],
  ): Promise<Result<ProductDiscount[]>> {
    const dtosArray = Array.isArray(dtos) ? dtos : [dtos];
    const newProductDiscounts = this.repo.create(dtosArray);
    const productDiscounts = await this.repo.save(newProductDiscounts);
    return {
      statusCode: HttpStatus.CREATED,
      data: productDiscounts,
    };
  }

  async delete(
    criteria: Partial<Pick<ProductDiscount, 'productId' | 'discountId'>>,
  ): Promise<Result<void>> {
    const result = await this.repo.delete(criteria);
    if (result.affected === 0) {
      throw new NotFoundException(
        `The Product Discount with criteria: ${JSON.stringify(criteria)} not found`,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      message: `The Product Discount with criteria: ${JSON.stringify(criteria)} deleted successfully`,
    };
  }
}
