import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

import { Product } from '@product/entities/product.entity';

import { CreateProductDto } from '@product/dto/create-product.dto';

export const createProduct = (): CreateProductDto => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseInt(faker.commerce.price()),
  stock: faker.number.int(),
  category: faker.number.int(),
  subcategory: faker.number.int(),
  brand: faker.number.int(),
  createdBy: faker.number.int(),
  updatedBy: faker.number.int(),
  deletedBy: null,
});

export const generateProduct = (id: number = 1): Product => ({
  ...generateBaseEntity(id),
  ...createProduct(),
  id,
  images: [],
});

export const generateManyProducts = (size: number): Product[] => {
  const products: Product[] = [];
  for (let i = 0; i < size; i++) {
    products.push(generateProduct(i + 1));
  }
  return products;
};
