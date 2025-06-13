/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { Discount } from '@discount/entities/discount.entity';

/* DTO's */
import { CreateDiscountDto } from '@discount/dto/create-discount.dto';
import { UpdateDiscountDto } from '@discount/dto/update-discount.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class DiscountService
  implements IBaseService<Discount, CreateDiscountDto, UpdateDiscountDto>
{
  constructor(
    @InjectRepository(Discount)
    private readonly repo: Repository<Discount>,
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
    const [discount, total] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
      },
      order: {
        code: 'ASC',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data: discount,
      total,
    };
  }

  async findOne(id: Discount['id']): Promise<Result<Discount>> {
    const discount = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { id, isDeleted: false },
    });
    if (!discount) {
      throw new NotFoundException(`The Discount with id: ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: discount,
    };
  }

  async findOneByCode(code: string): Promise<Result<Discount>> {
    const discount = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { code, isDeleted: false },
    });
    if (!discount) {
      throw new NotFoundException(`The Discount with code: ${code} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: discount,
    };
  }

  async create(dto: CreateDiscountDto) {
    const newDiscount = this.repo.create(dto);
    const discount = await this.repo.save(newDiscount);
    return {
      statusCode: HttpStatus.CREATED,
      data: discount,
      message: 'The Discount was created',
    };
  }

  async update(id: number, changes: UpdateDiscountDto) {
    const { data } = await this.findOne(id);
    this.repo.merge(data as Discount, changes);
    const rta = await this.repo.save(data as Discount);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Discount with id: ${id} has been modified`,
    };
  }

  async remove(id: Discount['id']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.repo.merge(data as Discount, changes);
    await this.repo.save(data as Discount);
    return {
      statusCode: HttpStatus.OK,
      message: `The Discount with id: ${id} has been deleted`,
    };
  }
}
