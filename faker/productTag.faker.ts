/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { faker } from '@faker-js/faker/.';

import { ProductTag } from 'src/product-tag/entities/product-tag.entity';
import { CreateProductTagDto } from 'src/product-tag/dto/create-product-tag.dto';

export const createProductTag = (): CreateProductTagDto => ({
  products: faker.number.int({ min: 1, max: 100 }),
  tags: faker.number.int({ min: 1, max: 100 }),
  createdBy: faker.number.int({ min: 1, max: 100 }),
});

export const generateProductTag = (): ProductTag => {
  const productGenerated = createProductTag();
  const product = productGenerated.products;
  const tag = productGenerated.tags;
  const createdBy = productGenerated.createdBy;

  const productTag: ProductTag = {
    productId: product,
    tagId: tag,
    products: product,
    tags: tag,
    createdBy,
    createdAt: faker.date.anytime(),
  };
  return productTag;
};

export const generateManyProductTags = (size: number): ProductTag[] => {
  const tags: ProductTag[] = [];
  for (let i = 0; i < size; i++) {
    tags.push(generateProductTag());
  }
  return tags;
};
