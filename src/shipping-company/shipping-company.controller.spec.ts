/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { ShippingCompanyController } from './shipping-company.controller';

/* Services */
import { ShippingCompanyService } from './shipping-company.service';

/* Entities */
import { ShippingCompany } from './entities/shipping-company.entity';

/* DTO's */
import { CreateShippingCompanyDto } from './dto/create-shipping-company.dto';

/* Faker */
import {
  createShippingCompany,
  generateShippingCompany,
  generateManyShippingCompanies,
} from '@faker/shippingCompany.faker';

describe('ShippingCompanyController', () => {
  let controller: ShippingCompanyController;
  let service: ShippingCompanyService;

  const mockShippingCompany: ShippingCompany = generateShippingCompany();
  const mockShippingCompanies: ShippingCompany[] =
    generateManyShippingCompanies(10);
  const mockNewShippingCompany: CreateShippingCompanyDto =
    createShippingCompany();

  const mockService = {
    countAll: jest.fn().mockResolvedValue(mockShippingCompanies.length),
    count: jest.fn().mockResolvedValue(mockShippingCompanies.length),
    findAll: jest.fn().mockResolvedValue(mockShippingCompanies),
    findOne: jest.fn().mockResolvedValue(mockShippingCompany),
    findOneByName: jest.fn().mockResolvedValue(mockShippingCompany),
    create: jest.fn().mockResolvedValue(mockNewShippingCompany),
    update: jest.fn().mockResolvedValue(1),
    remove: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingCompanyController],
      providers: [
        {
          provide: ShippingCompanyService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ShippingCompanyController>(
      ShippingCompanyController,
    );
    service = module.get<ShippingCompanyService>(ShippingCompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count shipping companies controllers', () => {
    it('should call countAll shipping company service', async () => {
      expect(await controller.countAll()).toBe(mockShippingCompanies.length);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });

    it('should call count shipping company service', async () => {
      expect(await controller.count()).toBe(mockShippingCompanies.length);
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find shipping companies controllers', () => {
    it('should call findAll shipping company service', async () => {
      expect(await controller.findAll()).toBe(mockShippingCompanies);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findOne shipping company service', async () => {
      expect(await controller.findOne(1)).toBe(mockShippingCompany);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return an shipping company by name', async () => {
      expect(await controller.findOneByname(mockShippingCompany.name));
      expect(service.findOneByName).toHaveBeenCalledTimes(1);
    });
  });

  describe('create shipping companies controller', () => {
    it('should call create shipping company service', async () => {
      await controller.create(mockNewShippingCompany);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update shipping companies controller', () => {
    it('should call update shipping companies service', async () => {
      const changes = { name: 'newName' };
      await controller.update(1, changes);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove shipping companies controller', () => {
    it('shoudl call remove shipping companies service', async () => {
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
