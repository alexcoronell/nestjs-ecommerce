import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

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

  async findAllWithRelations() {
    const [brands, total] = await this.repo.findAndCount({
      relations: ['createdBy', 'updatedBy'],
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
      throw new NotFoundException(`The Brand with ID: ${id} not found`);
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
      throw new NotFoundException(`The Brand with NAME: ${name} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: brand,
    };
  }

  async findOneBySlug(slug: string): Promise<Result<Brand>> {
    const brand = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { slug, isDeleted: false },
    });
    if (!brand) {
      throw new NotFoundException(`The Brand with SLUG: ${slug} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: brand,
    };
  }

  async create(dto: CreateBrandDto, userId: AuthRequest['user']) {
    const newBrand = this.repo.create({
      ...dto,
      createdBy: { id: userId },
    });
    const brand = await this.repo.save(newBrand);
    return {
      statusCode: HttpStatus.CREATED,
      data: brand,
      message: 'The Brand was created',
    };
  }

  async update(
    id: number,
    userId: AuthRequest['user'],
    changes: UpdateBrandDto,
  ) {
    const { data } = await this.findOne(id);
    this.repo.merge(data as Brand, { ...changes, updatedBy: { id: userId } });
    const rta = await this.repo.save(data as Brand);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Brand with ID: ${id} has been modified`,
    };
  }

  async remove(id: Brand['id'], userId: AuthRequest['user']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true, deletedBy: { id: userId } };
    this.repo.merge(data as Brand, changes);
    await this.repo.save(data as Brand);
    return {
      statusCode: HttpStatus.OK,
      message: `The Brand with ID: ${id} has been deleted`,
    };
  }
}
