/* eslint-disable @typescript-eslint/await-thenable */
import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Entities */
import { Product } from '@product/entities/product.entity';
import { Purchase } from '@purchase/entities/purchase.entity';
import { PurchaseDetail } from './entities/purchase-detail.entity';

/* DTO's */
import { CreatePurchaseDetailDto } from './dto/create-purchase-detail.dto';
import { UpdatePurchaseDetailDto } from './dto/update-purchase-detail.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class PurchaseDetailService {
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
      where: { purchase: { id }, isDeleted: false },
    });
    return {
      statusCode: HttpStatus.OK,
      data: purchaseDetails,
    };
  }

  async create(
    dtos: CreatePurchaseDetailDto[],
  ): Promise<Result<PurchaseDetail[]>> {
    const createPurchaseDetails = dtos.map((item) => ({
      ...item,
      product: { id: item.product },
      purchase: { id: item.purchase },
    }));
    const purchaseDetails = await this.repo.create(createPurchaseDetails);
    await this.repo.save(purchaseDetails);
    return {
      statusCode: HttpStatus.CREATED,
      data: purchaseDetails,
    };
  }

  async update(id: PurchaseDetail['id'], changes: UpdatePurchaseDetailDto) {
    const { data } = await this.findOne(id);
    const productId = changes.product;
    const purchaseId = changes.purchase;
    this.repo.merge(data, {
      ...changes,
      product: { id: productId } as Product,
      purchase: { id: purchaseId } as Purchase,
    });
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
