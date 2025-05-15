import { Test, TestingModule } from '@nestjs/testing';
import { StoreDetailController } from './store-detail.controller';
import { StoreDetailService } from './store-detail.service';

describe('StoreDetailController', () => {
  let controller: StoreDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreDetailController],
      providers: [StoreDetailService],
    }).compile();

    controller = module.get<StoreDetailController>(StoreDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
