/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { Supplier } from '@supplier/entities/supplier.entity';

/* DTO's */
import { CreateSupplierDto } from '@supplier/dto/create-supplier.dto';
import { UpdateSupplierDto } from '@supplier/dto/update-supplier.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class SupplierService
  implements IBaseService<Supplier, CreateSupplierDto, UpdateSupplierDto>
{
  constructor(
    @InjectRepository(Supplier)
    private readonly repo: Repository<Supplier>,
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
    const [suppliers, total] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
      },
      order: {
        name: 'ASC',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data: suppliers,
      total,
    };
  }

  async findOne(id: Supplier['id']): Promise<Result<Supplier>> {
    const supplier = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { id, isDeleted: false },
    });
    if (!supplier) {
      throw new NotFoundException(`The Supplier with id: ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: supplier,
    };
  }

  async findOneByName(name: string): Promise<Result<Supplier>> {
    const supplier = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { name, isDeleted: false },
    });
    if (!supplier) {
      throw new NotFoundException(`The Supplier with name: ${name} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: supplier,
    };
  }

  async create(dto: CreateSupplierDto) {
    const newSupplier = this.repo.create(dto);
    const supplier = await this.repo.save(newSupplier);
    return {
      statusCode: HttpStatus.CREATED,
      data: supplier,
      message: 'The Supplier was created',
    };
  }

  async update(id: number, changes: UpdateSupplierDto) {
    const { data } = await this.findOne(id);
    this.repo.merge(data as Supplier, changes);
    const rta = await this.repo.save(data as Supplier);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Supplier with id: ${id} has been modified`,
    };
  }

  async remove(id: Supplier['id']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.repo.merge(data as Supplier, changes);
    await this.repo.save(data as Supplier);
    return {
      statusCode: HttpStatus.OK,
      message: `The Supplier with id: ${id} has been deleted`,
    };
  }
}
