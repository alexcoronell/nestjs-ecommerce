import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Entities */
import { Sale } from './entities/sale.entity';

/* DTOS's */
import { CreateSaleDto } from './dto/create-sale.dto';

/* Types */
import { Result } from '@commons/types/result.type';
import { AuthRequest } from '@auth/interfaces/auth-request.interface';
import { PaymentMethod } from '@payment_method/entities/payment-method.entity';
import { User } from '@user/entities/user.entity';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private readonly repo: Repository<Sale>,
  ) {}

  async countAll() {
    const total = await this.repo.count();
    return { statusCode: HttpStatus.OK, total };
  }

  async count() {
    const total = await this.repo.count({
      where: {
        isCancelled: false,
      },
    });
    return { statusCode: HttpStatus.OK, total };
  }

  async findAll(): Promise<Result<Sale[]>> {
    const [sales, total] = await this.repo.findAndCount({
      where: {
        isCancelled: false,
      },
      order: {
        saleDate: 'DESC',
      },
    });
    return {
      statusCode: HttpStatus.OK,
      data: sales,
      total,
    };
  }

  async findAllByUser(userId: number): Promise<Result<Sale[]>> {
    const [sales, total] = await this.repo.findAndCount({
      where: {
        user: { id: userId },
        isCancelled: false,
      },
      order: {
        saleDate: 'DESC',
      },
    });
    return {
      statusCode: HttpStatus.OK,
      data: sales,
      total,
    };
  }

  async findAllByPaymentMethod(
    paymentMethodId: number,
  ): Promise<Result<Sale[]>> {
    const [sales, total] = await this.repo.findAndCount({
      where: {
        paymentMethod: { id: paymentMethodId },
        isCancelled: false,
      },
      order: {
        saleDate: 'DESC',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data: sales,
      total,
    };
  }

  async findOne(id: Sale['id']): Promise<Result<Sale>> {
    const sale = await this.repo.findOne({
      where: { id, isCancelled: false },
      relations: ['user', 'paymentMethod'],
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return { statusCode: HttpStatus.OK, data: sale };
  }

  async create(
    dto: CreateSaleDto,
    userId: AuthRequest['user'],
  ): Promise<Result<Sale>> {
    const paymentMethodId = dto.paymentMethod;
    const newSale = {
      ...dto,
      paymentMethod: { id: paymentMethodId } as PaymentMethod,
      user: { id: userId } as User,
    };
    const sale = this.repo.create(newSale);
    const savedSale = await this.repo.save(sale);
    return { statusCode: HttpStatus.CREATED, data: savedSale };
  }

  async cancel(id: number, userId: AuthRequest['user']) {
    const { data } = await this.findOne(id);
    const changes = { isCancelled: true, cancelledBy: { id: userId } };
    this.repo.merge(data as Sale, changes);
    return this.repo.save(data as Sale).then((sale) => ({
      statusCode: HttpStatus.OK,
      data: sale,
      message: `The Sale with ID: ${id} cancelled successfully`,
    }));
  }
}
