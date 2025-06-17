import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Entities */
import { ProductTag } from './entities/product-tag.entity';
import { Product } from '@product/entities/product.entity';
import { Tag } from '@tag/entities/tag.entity';

/* DTO's */
import { CreateProductTagDto } from './dto/create-product-tag.dto';

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
    const [productImages, total] = await this.repo.findAndCount();

    return {
      statusCode: HttpStatus.OK,
      data: productImages,
      total,
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

  async findOne(id: ProductTag['id']): Promise<Result<ProductTag>> {
    const productTag = await this.repo.findOne({
      where: { id },
    });
    if (!productTag) {
      throw new NotFoundException(`The Product Tag with id: ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: productTag,
    };
  }

  async create(
    dtos: CreateProductTagDto | CreateProductTagDto[],
  ): Promise<Result<ProductTag>> {
    const dtosArray = Array.isArray(dtos) ? dtos : [dtos];
    const newProductTags = this.repo.create(dtosArray);
    const productTags = await this.repo.save(newProductTags);
    return {
      statusCode: HttpStatus.CREATED,
      data: productTags,
      message: 'The Product Tags were created',
    };
  }

  async remove(id: ProductTag['id']) {
    const { data } = await this.findOne(id);
    if (!data) {
      throw new NotFoundException(`The Product Tag with id: ${id} not found`);
    }
    await this.repo.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: `The Product Tag with id: ${id} has been deleted`,
    };
  }
}
