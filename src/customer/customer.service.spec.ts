/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

/* Services */
import { CustomerService } from './customer.service';

/* Entity */
import { Customer } from './entities/customer.entity';

/* DTO's */
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateCustomerPasswordDto } from './dto/update-customer-password';

/* Faker */
import { generateCustomer, generateManyCustomers } from '@faker/customer.faker';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: Repository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count customer services', () => {
    it('should return total all customers', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(100);

      const { statusCode, total } = await service.countAll();
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(total).toEqual(100);
    });

    it('should return total customers not removed', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(100);
      const { statusCode, total } = await service.count();
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(repository.count).toHaveBeenCalledWith({
        where: { isDeleted: false },
      });
      expect(statusCode).toBe(200);
      expect(total).toEqual(100);
    });
  });

  describe('find customers services', () => {
    it('findAll should return all customers', async () => {
      const customer = generateManyCustomers(50);
      const customerPasswordsUndefined = customer.map((user) => {
        user.password = undefined;
        return user;
      });
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([customer, customer.length]);

      const { statusCode, data, total } = await service.findAll();
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false },
        order: { email: 'ASC' },
      });
      expect(statusCode).toBe(200);
      expect(data).toEqual(customerPasswordsUndefined);
      expect(total).toEqual(customer.length);
      expect(data[0].password).toBe(undefined);
    });

    it('findAllActives should return all active customers', async () => {
      const mockCustomers = generateManyCustomers(10);
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([mockCustomers, mockCustomers.length]);

      const { statusCode, data, total } = await service.findAllActives();
      const customers: Customer[] = data as Customer[];
      const customer = customers[0];

      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { isDeleted: false, isActive: true },
        order: { email: 'ASC' },
      });

      expect(statusCode).toBe(200);
      expect(total).toEqual(customers.length);
      expect(customer.password).toBe(undefined);
    });

    it('findOne should return a customer', async () => {
      const customer = generateCustomer();
      const id = customer.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(customer);

      const { statusCode, data } = await service.findOne(id);
      const dataCustomer: Customer = data as Customer;
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id, isDeleted: false },
      });
      expect(statusCode).toBe(200);
      expect(dataCustomer).toEqual(customer);
      expect(dataCustomer.password).toBe(undefined);
    });

    it('findOne should throw NotFoundException if customer does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The Customer with ID: ${id} not found`);
      }
    });

    it('findOne should throw NotFoundException if customer does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrowError(
        new NotFoundException(`The Customer with ID: ${id} not found`),
      );
    });

    it('findByEmail should return a customer', async () => {
      const customer = generateCustomer();
      const email = customer.email;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(customer);

      const { statusCode, data } = await service.findOneByEmail(email);
      const dataCustomer: Customer = data as Customer;
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(dataCustomer).toEqual(customer);
    });

    it('findOneByEmail should throw NotFoundException if customer does not exist', async () => {
      const email = 'email';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      try {
        await service.findOneByEmail(email);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `The Customer with email ${email} not found`,
        );
      }
    });

    it('findAndValidateEmail should return a customer', async () => {
      const customer = generateCustomer();
      const email = customer.email;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(customer);

      const { statusCode, data } = await service.findAndValidateEmail(email);
      const dataCustomer: Customer = data as Customer;
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(dataCustomer).toEqual(customer);
      expect(dataCustomer.id).toEqual(customer.id);
    });

    it('findAndValidateEmail should throw NotFoundException if customer does not exist', async () => {
      const email = 'badEmail@email.com';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      try {
        await service.findAndValidateEmail(email);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe(`Not Allow`);
      }
    });
  });

  describe('create customers services', () => {
    it('create should return a customer', async () => {
      const customer = generateCustomer();
      const newCustomer = { ...customer, password: 'password' };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(customer);
      jest.spyOn(repository, 'save').mockResolvedValue(customer);

      const { statusCode, data } = await service.create(newCustomer);
      expect(statusCode).toBe(201);
      expect(data).toEqual(customer);
    });

    it('create should return Conflict Exception when email exists', async () => {
      const customer = generateCustomer();
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(customer);
      jest.spyOn(repository, 'create').mockReturnValue(customer);
      jest.spyOn(repository, 'save').mockResolvedValue(customer);

      try {
        await service.create(customer as CreateCustomerDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(`Email ${customer.email} already exists`);
      }
    });
  });

  describe('update customer service', () => {
    it('update should return a message: have been modified', async () => {
      const customer = generateCustomer();
      const id = customer.id;
      const changes: UpdateCustomerDto = { email: 'updatedEmail@email.com' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(customer);
      jest
        .spyOn(repository, 'merge')
        .mockReturnValue({ ...customer, ...changes });
      jest.spyOn(repository, 'save').mockResolvedValue(customer);

      const { statusCode, message } = await service.update(id, changes);
      expect(statusCode).toBe(200);
      expect(message).toEqual(`The Customer with ID: ${id} has been modified`);
    });

    it('updatePassword should return an customer', async () => {
      const customer = generateCustomer();
      const id = customer.id;
      const hashedPassword: string = 'hashedPassword';
      const changes: UpdateCustomerPasswordDto = { password: hashedPassword };

      jest.spyOn(repository, 'findOne').mockResolvedValue(customer);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest
        .spyOn(repository, 'merge')
        .mockReturnValue({ ...customer, ...changes });
      jest.spyOn(repository, 'save').mockResolvedValue(customer);

      const { statusCode, message } = await service.updatePassword(id, changes);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(repository.merge).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(message).toEqual('The password was updated');
    });

    it('update should throw NotFoundException if customer does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.update(id, { email: 'newEmail' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`The Customer with ID: ${id} not found`);
      }
    });

    it('update should throw NotFoundException if customer does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.update(id, { firstname: 'newFirstName' }),
      ).rejects.toThrowError(
        new NotFoundException(`The Customer with ID: ${id} not found`),
      );
    });
  });

  describe('remove customers services', () => {
    it('remove should return status and message', async () => {
      const customer = generateCustomer();
      const id = customer.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(customer);
      jest
        .spyOn(repository, 'merge')
        .mockReturnValue({ ...customer, isDeleted: true });
      jest.spyOn(repository, 'save').mockResolvedValue(customer);

      const { statusCode, message } = await service.remove(id);
      expect(statusCode).toBe(204);
      expect(message).toEqual(`The Customer with ID: ${id} has been deleted`);
    });

    it('remove should throw NotFoundException if customer does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrowError(
        new NotFoundException(`The Customer with ID: ${id} not found`),
      );
    });
  });
});
