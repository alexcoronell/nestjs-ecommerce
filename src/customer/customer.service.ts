/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { Customer } from './entities/customer.entity';

/* DTO's */
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateCustomerPasswordDto } from './dto/update-customer-password';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class CustomerService
  implements IBaseService<Customer, CreateCustomerDto, UpdateCustomerDto>
{
  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
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

  /* Find All */
  async findAll() {
    const [customers, total] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
      },
      order: {
        email: 'ASC',
      },
    });
    const rta = customers.map((user) => {
      user.password = undefined;
      return user;
    });

    return {
      statusCode: HttpStatus.OK,
      data: rta,
      total,
    };
  }

  /* Find All  Active Customers*/
  async findAllActives(): Promise<Result<Customer[]>> {
    const [customers, total] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
        isActive: true,
      },
      order: {
        email: 'ASC',
      },
    });
    const rta = customers.map((user) => {
      user.password = undefined;
      return user;
    });
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      total,
    };
  }

  /* Find One - Correct Type Id */
  async findOne(id: Customer['id']): Promise<Result<Customer>> {
    const customer = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!customer) {
      throw new NotFoundException(`The Customer with ID: ${id} not found`);
    }
    customer.password = undefined;
    return {
      statusCode: HttpStatus.OK,
      data: customer,
    };
  }

  /* Find One By Email */
  async findOneByEmail(email: string): Promise<Result<Customer>> {
    const customer = await this.repo.findOneBy({ email });
    if (!customer) {
      throw new NotFoundException(`The Customer with email ${email} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: customer,
    };
  }

  /* Create */
  async create(dto: CreateCustomerDto) {
    const newCustomer = this.repo.create(dto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashPassword = await bcrypt.hash(newCustomer.password, 10);
    newCustomer.password = hashPassword;
    const customer = await this.repo.save(newCustomer);
    customer.password = '';
    return {
      statusCode: HttpStatus.CREATED,
      data: customer,
      message: 'The Customer was created',
    };
  }

  /* Update  */
  async update(id: number, changes: UpdateCustomerDto) {
    const { data } = await this.findOne(id);
    this.repo.merge(data as Customer, changes);
    const rta = await this.repo.save(data as Customer);
    rta.password = '';
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Customer with ID: ${id} has been modified`,
    };
  }

  /* Update Password */
  async updatePassword(id: number, changes: UpdateCustomerPasswordDto) {
    const { data } = await this.findOne(id);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashPassword = await bcrypt.hash(changes.password, 10);
    const newPasswordChanges = {
      password: hashPassword,
    };
    this.repo.merge(data as Customer, newPasswordChanges);
    const rta = await this.repo.save(data as Customer);
    rta.password = '';
    return {
      statusCode: HttpStatus.OK,
      message: 'The password was updated',
    };
  }

  /* Remove */
  async remove(id: Customer['id']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.repo.merge(data as Customer, changes);
    await this.repo.save(data as Customer);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `The Customer with ID: ${id} has been deleted`,
    };
  }
}
