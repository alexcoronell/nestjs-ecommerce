import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

/* Entities */
import { Purchase } from './entities/purchase.entity';
import { Supplier } from '@supplier/entities/supplier.entity';

/* DTO's */
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class PurchaseService
  implements IBaseService<Purchase, CreatePurchaseDto, UpdatePurchaseDto>
{
  constructor(
    @InjectRepository(Purchase)
    private readonly repo: Repository<Purchase>,
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
    const [purchases, total] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
      },
      order: {
        purchaseDate: 'DESC',
      },
    });
    return {
      statusCode: HttpStatus.OK,
      data: purchases,
      total,
    };
  }

  async findOne(id: number) {
    const purchase = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: ['createdBy'],
    });

    if (!purchase) {
      throw new NotFoundException(`The Purchase with ID ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: purchase,
    };
  }

  async findBySupplierId(supplierId: number): Promise<Result<Purchase[]>> {
    const [purchases, total] = await this.repo.findAndCount({
      where: { supplier: { id: supplierId }, isDeleted: false },
      relations: ['createdBy'],
    });

    return {
      statusCode: HttpStatus.OK,
      data: purchases,
      total,
    };
  }

  async create(dto: CreatePurchaseDto, userId: AuthRequest['user']) {
    const suppliedId = dto.supplier;
    const newPurchase = this.repo.create({
      ...dto,
      supplier: { id: suppliedId } as Supplier,
      createdBy: { id: userId },
      updatedBy: { id: userId },
    });
    const purchase = await this.repo.save(newPurchase);
    return {
      statusCode: HttpStatus.CREATED,
      data: purchase,
      message: 'The Purchase was created',
    };
  }

  async update(
    id: number,
    userId: AuthRequest['user'],
    changes: UpdatePurchaseDto,
  ) {
    const { data } = await this.findOne(id);
    const supplierId = changes.supplier;
    this.repo.merge(data, {
      ...changes,
      supplier: { id: supplierId },
      updatedBy: { id: userId },
    });
    const rta = await this.repo.save(data);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Purchase with id: ${id} has been modified`,
    };
  }

  async remove(id: Purchase['id'], userId: AuthRequest['user']) {
    const { data } = await this.findOne(id);

    const changes = {
      isDeleted: true,
      deletedBy: { id: userId },
      deletedAt: new Date(),
    };
    this.repo.merge(data, changes);
    await this.repo.save(data);
    return {
      statusCode: HttpStatus.OK,
      message: `The Purchase with id: ${id} has been deleted`,
    };
  }
}
