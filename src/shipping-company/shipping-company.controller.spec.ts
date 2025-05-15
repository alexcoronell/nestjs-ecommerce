import { Test, TestingModule } from '@nestjs/testing';
import { ShippingCompanyController } from './shipping-company.controller';
import { ShippingCompanyService } from './shipping-company.service';

describe('ShippingCompanyController', () => {
  let controller: ShippingCompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingCompanyController],
      providers: [ShippingCompanyService],
    }).compile();

    controller = module.get<ShippingCompanyController>(ShippingCompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
