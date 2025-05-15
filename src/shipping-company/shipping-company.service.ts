import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { ShippingCompany } from './entities/shipping-company.entity';

/* DTO's */
import { CreateShippingCompanyDto } from './dto/create-shipping-company.dto';
import { UpdateShippingCompanyDto } from './dto/update-shipping-company.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class ShippingCompanyService
  implements
    IBaseService<
      ShippingCompany,
      CreateShippingCompanyDto,
      UpdateShippingCompanyDto
    >
{
  constructor(
    @InjectRepository(ShippingCompany)
    private readonly repo: Repository<ShippingCompany>,
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

  async findOne(id: ShippingCompany['id']): Promise<Result<ShippingCompany>> {
    const data = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { id, isDeleted: false },
    });
    if (!data) {
      throw new NotFoundException(
        `The Shipping Company with id: ${id} not found`,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      data: data,
    };
  }

  async findOneByName(name: string): Promise<Result<ShippingCompany>> {
    const data = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { name, isDeleted: false },
    });
    if (!data) {
      throw new NotFoundException(
        `The Shipping Company with name: ${name} not found`,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      data: data,
    };
  }

  async create(dto: CreateShippingCompanyDto) {
    const newItem = this.repo.create(dto);
    const data = await this.repo.save(newItem);
    return {
      statusCode: HttpStatus.CREATED,
      data,
      message: 'The Shipping Company was created',
    };
  }

  async update(id: number, changes: UpdateShippingCompanyDto) {
    const { data } = await this.findOne(id);
    this.repo.merge(data as ShippingCompany, changes);
    const rta = await this.repo.save(data as ShippingCompany);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Shipping Company with id: ${id} has been modified`,
    };
  }

  async remove(id: ShippingCompany['id']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.repo.merge(data as ShippingCompany, changes);
    await this.repo.save(data as ShippingCompany);
    return {
      statusCode: HttpStatus.OK,
      message: `The Shipping Company with id: ${id} has been deleted`,
    };
  }
}
