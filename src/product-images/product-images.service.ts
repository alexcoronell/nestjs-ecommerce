import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { Product } from '@product/entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { User } from '@user/entities/user.entity';

/* DTO's */
import { CreateProductImageDto } from '@product_images/dto/create-product-image.dto';
import { UpdateProductImageDto } from '@product_images/dto/update-product-image.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class ProductImagesService
  implements
    IBaseService<ProductImage, CreateProductImageDto, UpdateProductImageDto>
{
  constructor(
    @InjectRepository(ProductImage)
    private readonly repo: Repository<ProductImage>,
  ) {}

  async countAll() {
    const total = await this.repo.count();
    return { statusCode: HttpStatus.OK, total };
  }

  async count() {
    const total = await this.repo.count({
      where: {
        isDeleted: false,
      },
    });
    return { statusCode: HttpStatus.OK, total };
  }

  async findAll() {
    const [productImages, total] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
      },
      order: {
        title: 'ASC',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data: productImages,
      total,
    };
  }

  async findOne(id: ProductImage['id']): Promise<Result<ProductImage>> {
    const productImage = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { id, isDeleted: false },
    });
    if (!productImage) {
      throw new NotFoundException(`The Product Image with id: ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: productImage,
    };
  }

  async create(dto: CreateProductImageDto) {
    const productId = dto.product;
    const uploadById = dto.uploadedBy;
    const newProductImage = this.repo.create({
      ...dto,
      product: { id: productId } as Product,
      uploadedBy: { id: uploadById } as User,
    });
    const productImage = await this.repo.save(newProductImage);
    return {
      statusCode: HttpStatus.CREATED,
      data: productImage,
      message: 'The Product was created',
    };
  }

  async update(id: number, changes: UpdateProductImageDto) {
    const { data } = await this.findOne(id);
    const productId = changes.product;
    const uploadById = changes.uploadedBy;
    this.repo.merge(data as ProductImage, {
      ...changes,
      product: { id: productId } as Product,
      uploadedBy: { id: uploadById } as User,
    });
    const rta = await this.repo.save(data as ProductImage);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Product Image with id: ${id} has been modified`,
    };
  }

  async remove(id: ProductImage['id']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.repo.merge(data as ProductImage, changes);
    await this.repo.save(data as ProductImage);
    return {
      statusCode: HttpStatus.OK,
      message: `The Product Image with id: ${id} has been deleted`,
    };
  }
}
