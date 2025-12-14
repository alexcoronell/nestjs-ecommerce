import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { Brand } from '@brand/entities/brand.entity';
import { Category } from '@category/entities/category.entity';
import { Product } from './entities/product.entity';
import { Subcategory } from '@subcategory/entities/subcategory.entity';

/* DTO's */
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class ProductService
  implements IBaseService<Product, CreateProductDto, UpdateProductDto>
{
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
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
    const [products, total] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
      },
      order: {
        name: 'ASC',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data: products,
      total,
    };
  }

  async findOne(id: Product['id']): Promise<Result<Product>> {
    const product = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { id, isDeleted: false },
    });
    if (!product) {
      throw new NotFoundException(`The Product with ID: ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: product,
    };
  }

  async findOneByName(name: string): Promise<Result<Product>> {
    const product = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { name, isDeleted: false },
    });
    if (!product) {
      throw new NotFoundException(`The Product with NAME: ${name} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: product,
    };
  }

  async findByBrand(brandId: Brand['id']) {
    const [products, total] = await this.repo.findAndCount({
      where: { brand: { id: brandId }, isDeleted: false },
      order: { name: 'ASC' },
    });
    return {
      statusCode: HttpStatus.OK,
      data: products,
      total,
    };
  }

  async findByCategory(categoryId: Category['id']) {
    const [products, total] = await this.repo.findAndCount({
      where: { category: { id: categoryId }, isDeleted: false },
      order: { name: 'ASC' },
    });
    return {
      statusCode: HttpStatus.OK,
      data: products,
      total,
    };
  }

  async create(dto: CreateProductDto, userId: number) {
    const brandId = dto.brand;
    const categoryId = dto.category;
    const subcategoryId = dto.subcategory;
    const createProduct = {
      ...dto,
      brand: { id: brandId } as Brand,
      category: { id: categoryId },
      subcategory: { id: subcategoryId },
      createdBy: { id: userId },
      updatedBy: { id: userId },
    };
    const newProduct = this.repo.create(createProduct);
    const product = await this.repo.save(newProduct);
    return {
      statusCode: HttpStatus.CREATED,
      data: product,
      message: 'The Product was created',
    };
  }

  async update(id: number, userId: number, changes: UpdateProductDto) {
    const { data } = await this.findOne(id);
    const brandId = changes.brand;
    const categoryId = changes.category;
    const subcategoryId = changes.subcategory;
    const updateProduct = {
      ...changes,
      brand: { id: brandId } as Brand,
      category: { id: categoryId } as Category,
      subcategory: { id: subcategoryId } as Subcategory,
      updatedBy: { id: userId },
    };
    this.repo.merge(data as Product, updateProduct);
    const rta = await this.repo.save(data as Product);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Product with ID: ${id} has been modified`,
    };
  }

  async remove(id: Product['id'], userId: number) {
    const { data } = await this.findOne(id);

    const changes = {
      isDeleted: true,
      deletedBy: { id: userId },
      deletedAt: new Date(),
    };
    this.repo.merge(data as Product, changes);
    await this.repo.save(data as Product);
    return {
      statusCode: HttpStatus.OK,
      message: `The Product with ID: ${id} has been deleted`,
    };
  }
}
