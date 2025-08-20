/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { CustomerController } from './customer.controller';

/* Services */
import { CustomerService } from './customer.service';

/* DTO's */
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateCustomerPasswordDto } from './dto/update-customer-password';

/* Faker */
import {
  createCustomer,
  generateCustomer,
  generateManyCustomers,
} from '@faker/customer.faker';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  const mockCustomer = generateCustomer();
  const mockCustomers = generateManyCustomers(10).map((user) => {
    user.password = undefined;
    return user;
  });
  const mockNewCustomer: CreateCustomerDto = createCustomer();
  const mockCustomerService = {
    countAll: jest.fn().mockResolvedValue(mockCustomers.length),
    count: jest.fn().mockResolvedValue(mockCustomers.length),
    findAll: jest.fn().mockResolvedValue(mockCustomers),
    findAllActives: jest.fn().mockResolvedValue(mockCustomers),
    findOne: jest.fn().mockResolvedValue(mockCustomer),
    findOneByEmail: jest.fn().mockResolvedValue(mockCustomer),
    create: jest.fn().mockResolvedValue(mockNewCustomer),
    update: jest.fn().mockResolvedValue(1),
    updatePassword: jest.fn().mockResolvedValue(1),
    remove: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count users controllers', () => {
    it('should call countAll customer service', async () => {
      expect(await controller.countAll()).toBe(mockCustomers.length);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });

    it('should call count customer service', async () => {
      expect(await controller.count()).toBe(mockCustomers.length);
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find customers controllers', () => {
    it('should call findAll customer service', async () => {
      expect(await controller.findAll()).toBe(mockCustomers);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call finfAllActive customers service', async () => {
      expect(await controller.findAllActives()).toBe(mockCustomers);
      expect(service.findAllActives).toHaveBeenCalledTimes(1);
    });

    it('should call findOne customer service', async () => {
      expect(await controller.findOne(1)).toBe(mockCustomer);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return an customer by email', async () => {
      expect(await controller.findOneByEmail(mockCustomer.email));
      expect(service.findOneByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('create customer controller', () => {
    it('should call create customer service', async () => {
      await controller.create(mockNewCustomer);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update customer controller', () => {
    it('should call update customer service', async () => {
      const changes: UpdateCustomerDto = { firstname: 'newFirstname' };
      await controller.update(1, changes);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should call update password customer service', async () => {
      const newPassword: UpdateCustomerPasswordDto = {
        password: 'newPassword',
      };
      await controller.updatePassword(1, newPassword);
      expect(service.updatePassword).toHaveBeenCalledTimes(1);
    });

    describe('remove customer controller', () => {
      it('shoudl call remove customer service', async () => {
        await controller.remove(1);
        expect(service.remove).toHaveBeenCalledTimes(1);
      });
    });
  });
});
