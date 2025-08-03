/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Entities */
import { ProductTag } from '@product_tag/entities/product-tag.entity';
import { Product } from '@product/entities/product.entity';
import { Tag } from '@tag/entities/tag.entity';

/* DTO's */
import { CreateProductTagDto } from '@product_tag/dto/create-product-tag.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class ProductTagService {
  constructor(
    @InjectRepository(ProductTag)
    private readonly repo: Repository<ProductTag>,
  ) {}

  async countAll() {
    const total = await this.repo.count();
    return { statusCode: HttpStatus.OK, total };
  }

  async findAll(): Promise<Result<ProductTag[]>> {
    const [productTags, total] = await this.repo.findAndCount();
    return {
      statusCode: HttpStatus.OK,
      data: productTags,
      total,
    };
  }

  async findOne(
    criteria: Partial<Pick<ProductTag, 'productId' | 'tagId'>>,
  ): Promise<Result<ProductTag>> {
    const productTag = await this.repo.findOne({
      where: criteria,
    });
    if (!productTag) {
      throw new NotFoundException(
        `The Product Tag with productId: ${criteria.productId} and tagId: ${criteria.tagId} not found`,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      data: productTag,
    };
  }

  async findAllByProduct(id: Product['id']): Promise<Result<ProductTag[]>> {
    const [productTags, total] = await this.repo.findAndCount({
      relations: ['product', 'tag'],
      where: { products: id },
    });
    return {
      statusCode: HttpStatus.OK,
      data: productTags,
      total,
    };
  }

  async findAllByTag(id: Tag['id']): Promise<Result<ProductTag[]>> {
    const [productTags, total] = await this.repo.findAndCount({
      relations: ['product', 'tag'],
      where: { tags: id },
    });
    return {
      statusCode: HttpStatus.OK,
      data: productTags,
      total,
    };
  }

  async create(
    createProductTagDto: CreateProductTagDto,
  ): Promise<Result<ProductTag>> {
    const productTag = this.repo.create(createProductTagDto);
    await this.repo.save(productTag);
    return {
      statusCode: HttpStatus.CREATED,
      data: productTag,
      message: 'The Product Tags were created',
    };
  }

  async createMany(
    dtos: CreateProductTagDto | CreateProductTagDto[],
  ): Promise<Result<ProductTag[]>> {
    const dtosArray = Array.isArray(dtos) ? dtos : [dtos];
    const newProductTags = this.repo.create(dtosArray);
    const productTags = await this.repo.save(newProductTags);
    return {
      statusCode: HttpStatus.CREATED,
      data: productTags,
      message: 'The Product Tags were created',
    };
  }

  async delete(
    criteria: Partial<Pick<ProductTag, 'productId' | 'tagId'>>,
  ): Promise<Result<void>> {
    await this.findOne(criteria);
    await this.repo.delete(criteria);
    return {
      statusCode: HttpStatus.OK,
      message: `The Product Tag with productId: ${criteria.productId} and tagId: ${criteria.tagId} deleted`,
    };
  }
}
