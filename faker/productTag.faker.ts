/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { faker } from '@faker-js/faker/.';

import { ProductTag } from 'src/product-tag/entities/product-tag.entity';

import { CreateProductTagDto } from 'src/product-tag/dto/create-product-tag.dto';

export const createProductTag = (): CreateProductTagDto => ({
  products: faker.number.int({ min: 1, max: 100 }),
  tags: faker.number.int({ min: 1, max: 100 }),
  createdBy: faker.number.int({ min: 1, max: 100 }),
});

export const generateProductTag = (id: number = 1): ProductTag => ({
  id,
  createdAt: faker.date.anytime(),
  ...createProductTag(),
});

export const generateManyProductTags = (size: number): ProductTag[] => {
  const images: ProductTag[] = [];
  for (let i = 0; i < size; i++) {
    images.push(generateProductTag(i + 1));
  }
  return images;
};
