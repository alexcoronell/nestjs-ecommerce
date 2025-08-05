import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ShipmentModule } from './shipment.module';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { Shipment } from './entities/shipment.entity';

describe('Category module', () => {
  let module: TestingModule;
  let service: ShipmentService;
  let controller: ShipmentController;
  let repository: Repository<Shipment>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ShipmentModule],
    })
      .overrideProvider(getRepositoryToken(Shipment))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<ShipmentService>(ShipmentService);
    controller = module.get<ShipmentController>(ShipmentController);
    repository = module.get<Repository<Shipment>>(getRepositoryToken(Shipment));
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have ShipmentService and ShipmentController', () => {
    expect(module.get(ShipmentService)).toBeInstanceOf(ShipmentService);
    expect(module.get(ShipmentController)).toBeInstanceOf(ShipmentController);
  });

  it('should inject TypeORM repository for Shipment', () => {
    expect(module.get(getRepositoryToken(Shipment))).toBeDefined();
  });
});
