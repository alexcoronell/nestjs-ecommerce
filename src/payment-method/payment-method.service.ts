/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { PaymentMethod } from '@payment_method/entities/payment-method.entity';

/* DTO's */
import { CreatePaymentMethodDto } from '@payment_method/dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from '@payment_method/dto/update-payment-method.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class PaymentMethodService
  implements
    IBaseService<PaymentMethod, CreatePaymentMethodDto, UpdatePaymentMethodDto>
{
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly repo: Repository<PaymentMethod>,
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
    const [paymentMethod, total] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
      },
      order: {
        name: 'ASC',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data: paymentMethod,
      total,
    };
  }

  async findOne(id: PaymentMethod['id']): Promise<Result<PaymentMethod>> {
    const paymentMethod = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { id, isDeleted: false },
    });
    if (!paymentMethod) {
      throw new NotFoundException(
        `The Payment Method with id: ${id} not found`,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      data: paymentMethod,
    };
  }

  async findOneByName(name: string): Promise<Result<PaymentMethod>> {
    const paymentMethod = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { name, isDeleted: false },
    });
    if (!paymentMethod) {
      throw new NotFoundException(
        `The Payment Method with name: ${name} not found`,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      data: paymentMethod,
    };
  }

  async create(dto: CreatePaymentMethodDto) {
    const newPaymentMethod = this.repo.create(dto);
    const paymentMethod = await this.repo.save(newPaymentMethod);
    return {
      statusCode: HttpStatus.CREATED,
      data: paymentMethod,
      message: 'The Payment Method was created',
    };
  }

  async update(id: number, changes: UpdatePaymentMethodDto) {
    const { data } = await this.findOne(id);
    this.repo.merge(data as PaymentMethod, changes);
    const rta = await this.repo.save(data as PaymentMethod);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Payment Method with id: ${id} has been modified`,
    };
  }

  async remove(id: PaymentMethod['id']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.repo.merge(data as PaymentMethod, changes);
    await this.repo.save(data as PaymentMethod);
    return {
      statusCode: HttpStatus.OK,
      message: `The Payment Method with id: ${id} has been deleted`,
    };
  }
}
