import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { Product } from './entities/product.entity';

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
      throw new NotFoundException(`The Product with id: ${id} not found`);
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
      throw new NotFoundException(`The Product with name: ${name} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: product,
    };
  }

  async create(dto: CreateProductDto) {
    const newProduct = this.repo.create(dto);
    const product = await this.repo.save(newProduct);
    return {
      statusCode: HttpStatus.CREATED,
      data: product,
      message: 'The Product was created',
    };
  }

  async update(id: number, changes: UpdateProductDto) {
    const { data } = await this.findOne(id);
    this.repo.merge(data as Product, changes);
    const rta = await this.repo.save(data as Product);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Product with id: ${id} has been modified`,
    };
  }

  async remove(id: Product['id']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.repo.merge(data as Product, changes);
    await this.repo.save(data as Product);
    return {
      statusCode: HttpStatus.OK,
      message: `The Product with id: ${id} has been deleted`,
    };
  }
}
