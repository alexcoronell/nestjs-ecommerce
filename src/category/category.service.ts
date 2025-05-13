import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { Category } from './entities/category.entity';

/* DTO's */
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class CategoryService
  implements IBaseService<Category, CreateCategoryDto, UpdateCategoryDto>
{
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
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

  /* Find All */
  async findAll() {
    const [categories, total] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
      },
      order: {
        name: 'ASC',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data: categories,
      total,
    };
  }

  async findOne(id: Category['id']): Promise<Result<Category>> {
    const category = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { id, isDeleted: false },
    });
    if (!category) {
      throw new NotFoundException(`The category with ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: category,
    };
  }

  async create(dto: CreateCategoryDto) {
    const newCategory = this.repo.create(dto);
    const category = await this.repo.save(newCategory);
    return {
      statusCode: HttpStatus.CREATED,
      data: category,
      message: 'The category was created',
    };
  }

  async update(id: number, changes: UpdateCategoryDto) {
    const { data } = await this.findOne(id);
    this.repo.merge(data as Category, changes);
    const rta = await this.repo.save(data as Category);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The User with id: ${id} has been modified`,
    };
  }

  async remove(id: Category['id']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.repo.merge(data as Category, changes);
    await this.repo.save(data as Category);
    return {
      statusCode: HttpStatus.OK,
      message: `The Category with id: ${id} has been deleted`,
    };
  }
}
