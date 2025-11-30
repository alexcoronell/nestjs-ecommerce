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
      where: { product: { id } },
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
      where: { tag: { id } },
    });
    return {
      statusCode: HttpStatus.OK,
      data: productTags,
      total,
    };
  }

  async create(
    dto: CreateProductTagDto,
    userId: number,
  ): Promise<Result<ProductTag>> {
    const productId = dto.product;
    const tagId = dto.tag;

    const productTag = this.repo.create({
      product: { id: productId },
      tag: { id: tagId },
      createdBy: { id: userId },
    });
    await this.repo.save(productTag);
    return {
      statusCode: HttpStatus.CREATED,
      data: productTag,
      message: 'The Product Tags were created',
    };
  }

  async createMany(
    dtos: CreateProductTagDto | CreateProductTagDto[],
    userId: number,
  ): Promise<Result<ProductTag[]>> {
    const dtosArray = Array.isArray(dtos) ? dtos : [dtos];
    const createProductTags = dtosArray.map((item) => ({
      product: { id: item.product },
      tag: { id: item.tag },
      createdBy: { id: userId },
    }));
    const newProductTags = this.repo.create(createProductTags);
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
