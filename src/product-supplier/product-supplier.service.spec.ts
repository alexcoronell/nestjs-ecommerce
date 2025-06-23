import { Test, TestingModule } from '@nestjs/testing';
import { ProductSupplierService } from './product-supplier.service';

describe('ProductSupplierService', () => {
  let service: ProductSupplierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductSupplierService],
    }).compile();

    service = module.get<ProductSupplierService>(ProductSupplierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
