import { Test, TestingModule } from '@nestjs/testing';
import { StoreDetailService } from './store-detail.service';

describe('StoreDetailService', () => {
  let service: StoreDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreDetailService],
    }).compile();

    service = module.get<StoreDetailService>(StoreDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
