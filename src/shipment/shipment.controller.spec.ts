/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { ShipmentController } from './shipment.controller';

/* Services */
import { ShipmentService } from './shipment.service';

/* Entities */
import { Shipment } from './entities/shipment.entity';

/* Interfaces */
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

/* DTO's */
import { CreateShipmentDto } from './dto/create-shipment.dto';

/* Faker */
import {
  createShipment,
  generateShipment,
  generateManyShipments,
} from '@faker/shipment.faker';

describe('ShipmentController', () => {
  let controller: ShipmentController;
  let service: ShipmentService;

  const mockShipment: Shipment = generateShipment();
  const mockShipments: Shipment[] = generateManyShipments(10);
  const mockNewShipment: CreateShipmentDto = createShipment();

  const mockService = {
    countAll: jest.fn().mockResolvedValue(mockShipments.length),
    count: jest.fn().mockResolvedValue(mockShipments.length),
    findAll: jest.fn().mockResolvedValue(mockShipments),
    findAllByShippingCompanyId: jest.fn().mockResolvedValue(mockShipments),
    findOne: jest.fn().mockResolvedValue(mockShipment),
    findOneByTrackingNumber: jest.fn().mockResolvedValue(mockShipment),
    findOneBySaleId: jest.fn().mockResolvedValue(mockShipment),
    create: jest.fn().mockResolvedValue(mockNewShipment),
    update: jest.fn().mockResolvedValue(1),
    remove: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipmentController],
      providers: [
        {
          provide: ShipmentService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ShipmentController>(ShipmentController);
    service = module.get<ShipmentService>(ShipmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Count shipments controllers', () => {
    it('should call countAll shipment service', async () => {
      expect(await controller.countAll()).toBe(mockShipments.length);
      expect(service.countAll).toHaveBeenCalledTimes(1);
    });

    it('should call count shipment service', async () => {
      expect(await controller.count()).toBe(mockShipments.length);
      expect(service.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find shipments controllers', () => {
    it('should call findAll shipment service', async () => {
      expect(await controller.findAll()).toBe(mockShipments);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findAllByShippingCompanyId shipment service', async () => {
      expect(await controller.findAllByShippingCompanyId(1)).toBe(
        mockShipments,
      );
      expect(service.findAllByShippingCompanyId).toHaveBeenCalledTimes(1);
    });

    it('should call findOne shipment service', async () => {
      expect(await controller.findOne(1)).toBe(mockShipment);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should call findOneByTrackingNumber shipment service', async () => {
      expect(await controller.findOneByTrackingNumber('123')).toBe(
        mockShipment,
      );
      expect(service.findOneByTrackingNumber).toHaveBeenCalledTimes(1);
    });

    it('should call findOneBySaleId shipment service', async () => {
      expect(await controller.findOneBySaleId(1)).toBe(mockShipment);
      expect(service.findOneBySaleId).toHaveBeenCalledTimes(1);
    });
  });

  describe('create shipments controller', () => {
    it('should call create shipping company service', async () => {
      const request = { user: 1 };
      await controller.create(mockNewShipment, request as AuthRequest);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update shipments controller', () => {
    it('should call update shipments service', async () => {
      const changes = { shippingCompany: 3 };
      const request = { user: 1 };
      await controller.update(1, request as AuthRequest, changes);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove shipments controller', () => {
    it('shoudl call remove shipments service', async () => {
      const request = { user: 1 };
      await controller.remove(1, request as AuthRequest);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
