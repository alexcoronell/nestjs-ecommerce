import { Test, TestingModule } from '@nestjs/testing';
import { ShippingCompanyService } from './shipping-company.service';

describe('ShippingCompanyService', () => {
  let service: ShippingCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShippingCompanyService],
    }).compile();

    service = module.get<ShippingCompanyService>(ShippingCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
