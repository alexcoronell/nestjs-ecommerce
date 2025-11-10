import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

/* Entities */
import { Supplier } from '@supplier/entities/supplier.entity';

/* DTO's */
import { CreateSupplierDto } from '@supplier/dto/create-supplier.dto';
import { UpdateSupplierDto } from '@supplier/dto/update-supplier.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
/**
 * Service class for managing Supplier entities.
 * Provides methods for CRUD operations, soft deletion, and querying suppliers.
 *
 * @implements {IBaseService<Supplier, CreateSupplierDto, UpdateSupplierDto>}
 */
export class SupplierService
  implements IBaseService<Supplier, CreateSupplierDto, UpdateSupplierDto>
{
  /**
   * Constructs a new SupplierService.
   *
   * @param repo - The TypeORM repository for Supplier entities.
   */
  constructor(
    @InjectRepository(Supplier)
    private readonly repo: Repository<Supplier>,
  ) {}

  /**
   * Counts all Supplier entities in the database, including deleted ones.
   *
   * @returns An object containing the HTTP status code and the total count of suppliers.
   */
  async countAll() {
    const total = await this.repo.count();
    return { statusCode: HttpStatus.OK, total };
  }

  /**
   * Counts all Supplier entities that are not marked as deleted.
   *
   * @returns An object containing the HTTP status code and the total count of non-deleted suppliers.
   */
  async count() {
    const total = await this.repo.count({
      where: {
        isDeleted: false,
      },
    });
    return { statusCode: HttpStatus.OK, total };
  }

  /**
   * Retrieves all Supplier entities that are not marked as deleted, ordered by name.
   *
   * @returns An object containing the HTTP status code, the list of suppliers, and the total count.
   */
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

  /**
   * Finds a Supplier by its ID, including related createdBy and updatedBy entities.
   *
   * @param id - The ID of the Supplier to find.
   * @returns A Result object containing the HTTP status code and the found Supplier.
   * @throws NotFoundException if the Supplier is not found.
   */
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

  /**
   * Finds a Supplier by its name, including related createdBy and updatedBy entities.
   *
   * @param name - The name of the Supplier to find.
   * @returns A Result object containing the HTTP status code and the found Supplier.
   * @throws NotFoundException if the Supplier is not found.
   */
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

  /**
   * Creates a new Supplier entity.
   *
   * @param dto - The data transfer object containing the Supplier data to create.
   * @returns An object containing the HTTP status code, the created Supplier, and a success message.
   */
  async create(dto: CreateSupplierDto, userId: AuthRequest['user']) {
    const newSupplier = this.repo.create({
      ...dto,
      createdBy: { id: userId },
      updatedBy: { id: userId },
    });
    const supplier = await this.repo.save(newSupplier);
    return {
      statusCode: HttpStatus.CREATED,
      data: supplier,
      message: 'The Supplier was created',
    };
  }
  /**
   * Updates an existing Supplier entity by its ID.
   *
   * @param id - The ID of the Supplier to update.
   * @param changes - The data transfer object containing the changes to apply.
   * @returns An object containing the HTTP status code, the updated Supplier, and a success message.
   * @throws NotFoundException if the Supplier is not found.
   */
  async update(
    id: number,
    userId: AuthRequest['user'],
    changes: UpdateSupplierDto,
  ) {
    const { data } = await this.findOne(id);
    this.repo.merge(data as Supplier, {
      ...changes,
      updatedBy: { id: userId },
    });
    const rta = await this.repo.save(data as Supplier);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Supplier with id: ${id} has been modified`,
    };
  }

  /**
   * Soft deletes a Supplier entity by its ID by setting its isDeleted flag to true.
   *
   * @param id - The ID of the Supplier to delete.
   * @returns An object containing the HTTP status code and a success message.
   * @throws NotFoundException if the Supplier is not found.
   */
  async remove(id: Supplier['id'], userId: AuthRequest['user']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.repo.merge(data as Supplier, {
      ...changes,
      deletedBy: { id: userId },
    });
    await this.repo.save(data as Supplier);
    return {
      statusCode: HttpStatus.OK,
      message: `The Supplier with id: ${id} has been deleted`,
    };
  }
}
