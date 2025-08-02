/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/await-thenable */
import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { PurchaseDetail } from './entities/purchase-detail.entity';

/* DTO's */
import { CreatePurchaseDetailDto } from './dto/create-purchase-detail.dto';
import { UpdatePurchaseDetailDto } from './dto/update-purchase-detail.dto';

/* Types */
import { Result } from '@commons/types/result.type';
import { Purchase } from '@purchase/entities/purchase.entity';

@Injectable()
export class PurchaseDetailService
  implements
    IBaseService<
      PurchaseDetail,
      CreatePurchaseDetailDto,
      UpdatePurchaseDetailDto
    >
{
  constructor(
    @InjectRepository(PurchaseDetail)
    private readonly repo: Repository<PurchaseDetail>,
  ) {}

  async countAll(): Promise<Result<number>> {
    const total = await this.repo.count();
    return {
      statusCode: HttpStatus.OK,
      total,
    };
  }

  async count(): Promise<Result<number>> {
    const total = await this.repo.count({
      where: { isDeleted: false },
    });
    return {
      statusCode: HttpStatus.OK,
      total,
    };
  }

  async findAll() {
    const [puschaseDetails, total] = await this.repo.findAndCount({
      where: { isDeleted: false },
    });
    return {
      statusCode: HttpStatus.OK,
      data: puschaseDetails,
      total,
    };
  }

  async findOne(id: PurchaseDetail['id']) {
    const purchaseDetail = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!purchaseDetail) {
      throw new NotFoundException(
        `The Purchase Detail with ID ${id} not found`,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      data: purchaseDetail,
    };
  }

  async findByPurchaseId(id: Purchase['id']) {
    const purchaseDetails = await this.repo.find({
      where: { purchase: id, isDeleted: false },
    });
    return {
      statusCode: HttpStatus.OK,
      data: purchaseDetails,
    };
  }

  async create(
    dtos: CreatePurchaseDetailDto[],
  ): Promise<Result<PurchaseDetail[]>> {
    const purchaseDetails = await this.repo.create(dtos);
    await this.repo.save(purchaseDetails);
    return {
      statusCode: HttpStatus.CREATED,
      data: purchaseDetails,
    };
  }

  async update(id: PurchaseDetail['id'], changes: UpdatePurchaseDetailDto) {
    const { data } = await this.findOne(id);
    this.repo.merge(data, changes);
    const rta = await this.repo.save(data);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Purchase Detail with id: ${id} has been modified`,
    };
  }

  async remove(id: PurchaseDetail['id']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.repo.merge(data, changes);
    await this.repo.save(data);
    return {
      statusCode: HttpStatus.OK,
      message: `The Purchase Detail with ID: ${id} has been deleted`,
    };
  }
}
