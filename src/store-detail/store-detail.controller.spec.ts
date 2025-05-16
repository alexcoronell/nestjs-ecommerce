/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { StoreDetailController } from './store-detail.controller';

/* Services */
import { StoreDetailService } from './store-detail.service';

/* Entities */
import { StoreDetail } from './entities/store-detail.entity';

/* Faker */
import { generateStoreDetail } from '@faker/storeDetail.faker';

describe('StoreDetailController', () => {
  let controller: StoreDetailController;
  let service: StoreDetailService;

  const mockStoreDetail: StoreDetail = generateStoreDetail();

  const mockService = {
    findOne: jest.fn().mockResolvedValue(mockStoreDetail),
    update: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreDetailController],
      providers: [
        {
          provide: StoreDetailService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<StoreDetailController>(StoreDetailController);
    service = module.get<StoreDetailService>(StoreDetailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Find Store Detail controllers', () => {
    it('should call findOne Store Detail service', async () => {
      expect(await controller.findOne(1)).toBe(mockStoreDetail);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update Store Detail controller', () => {
    it('should call update Store Detail service', async () => {
      const changes = { name: 'newName' };
      await controller.update(1, changes);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });
});
