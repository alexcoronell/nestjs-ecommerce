import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

import { ProductImage } from '@product_images/entities/product-image.entity';

import { CreateProductImageDto } from '@product_images/dto/create-product-image.dto';

export const createProductImage = (): CreateProductImageDto => ({
  filePath: faker.system.filePath(),
  title: faker.lorem.words(3),
  isMain: faker.datatype.boolean(),
  product: faker.number.int(),
  uploadedBy: faker.number.int(),
});

export const generateProductImage = (id: number = 1): ProductImage => ({
  ...generateBaseEntity(id),
  ...createProductImage(),
  id,
});

export const generateManyProductImages = (size: number): ProductImage[] => {
  const images: ProductImage[] = [];
  for (let i = 0; i < size; i++) {
    images.push(generateProductImage(i + 1));
  }
  return images;
};
