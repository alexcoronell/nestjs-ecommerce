import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { Brand } from '@brand/entities/brand.entity';

/* DTO's */
import { CreateBrandDto } from '@brand/dto/create-brand.dto';
import { UpdateBrandDto } from '@brand/dto/update-brand.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class BrandService
  implements IBaseService<Brand, CreateBrandDto, UpdateBrandDto>
{
  constructor(
    @InjectRepository(Brand)
    private readonly repo: Repository<Brand>,
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
    const [brands, total] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
      },
      order: {
        name: 'ASC',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data: brands,
      total,
    };
  }

  async findOne(id: Brand['id']): Promise<Result<Brand>> {
    const brand = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { id, isDeleted: false },
    });
    if (!brand) {
      throw new NotFoundException(`The Brand with id: ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: brand,
    };
  }

  async findOneByName(name: string): Promise<Result<Brand>> {
    const brand = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { name, isDeleted: false },
    });
    if (!brand) {
      throw new NotFoundException(`The Brand with name: ${name} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: brand,
    };
  }

  async create(dto: CreateBrandDto) {
    const newBrand = this.repo.create(dto);
    const brand = await this.repo.save(newBrand);
    return {
      statusCode: HttpStatus.CREATED,
      data: brand,
      message: 'The Brand was created',
    };
  }

  async update(id: number, changes: UpdateBrandDto) {
    const { data } = await this.findOne(id);
    this.repo.merge(data as Brand, changes);
    const rta = await this.repo.save(data as Brand);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Brand with id: ${id} has been modified`,
    };
  }

  async remove(id: Brand['id']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.repo.merge(data as Brand, changes);
    await this.repo.save(data as Brand);
    return {
      statusCode: HttpStatus.OK,
      message: `The Brand with id: ${id} has been deleted`,
    };
  }
}
