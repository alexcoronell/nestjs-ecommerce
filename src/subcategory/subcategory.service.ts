import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { Subcategory } from './entities/subcategory.entity';

/* DTO's */
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class SubcategoryService
  implements
    IBaseService<Subcategory, CreateSubcategoryDto, UpdateSubcategoryDto>
{
  constructor(
    @InjectRepository(Subcategory)
    private readonly repo: Repository<Subcategory>,
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
    const [data, total] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
      },
      order: {
        name: 'ASC',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data,
      total,
    };
  }

  async findAllByCategory(category: number): Promise<Result<Subcategory[]>> {
    const [data, total] = await this.repo.findAndCount({
      where: { category, isDeleted: false },
      order: { name: 'ASC' },
    });
    return {
      statusCode: HttpStatus.OK,
      data,
      total,
    };
  }

  async findOne(id: Subcategory['id']) {
    const data = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { id, isDeleted: false },
    });
    if (!data) {
      throw new NotFoundException(`The Subcategory with id: ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  async findOneByName(name: string): Promise<Result<Subcategory>> {
    const data = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { name, isDeleted: false },
    });
    if (!data) {
      throw new NotFoundException(
        `The Subcategory with name: ${name} not found`,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  async create(dto: CreateSubcategoryDto) {
    const newSubcategory = this.repo.create(dto);
    const data = await this.repo.save(newSubcategory);
    return {
      statusCode: HttpStatus.CREATED,
      data,
      message: 'The Subcategory was created',
    };
  }

  async update(id: number, changes: UpdateSubcategoryDto) {
    const { data } = await this.findOne(id);
    this.repo.merge(data, changes);
    const rta = await this.repo.save(data);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Subcategory with id: ${id} has been modified`,
    };
  }

  async remove(id: Subcategory['id']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.repo.merge(data, changes);
    await this.repo.save(data);
    return {
      statusCode: HttpStatus.OK,
      message: `The Subcategory with id: ${id} has been deleted`,
    };
  }
}
