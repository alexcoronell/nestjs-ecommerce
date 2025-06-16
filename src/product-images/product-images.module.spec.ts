import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductImagesModule } from './product-images.module';
import { ProductImagesService } from './product-images.service';
import { ProductImagesController } from './product-images.controller';
import { ProductImage } from './entities/product-image.entity';

describe('Category module', () => {
  let module: TestingModule;
  let service: ProductImagesService;
  let controller: ProductImagesController;
  let repository: Repository<ProductImage>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ProductImagesModule],
    })
      .overrideProvider(getRepositoryToken(ProductImage))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    service = module.get<ProductImagesService>(ProductImagesService);
    controller = module.get<ProductImagesController>(ProductImagesController);
    repository = module.get<Repository<ProductImage>>(
      getRepositoryToken(ProductImage),
    );
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should have ProductImagesService and ProductImagesController', () => {
    expect(module.get(ProductImagesService)).toBeInstanceOf(
      ProductImagesService,
    );
    expect(module.get(ProductImagesController)).toBeInstanceOf(
      ProductImagesController,
    );
  });

  it('should inject TypeORM repository for ProductImage', () => {
    expect(module.get(getRepositoryToken(ProductImage))).toBeDefined();
  });
});
