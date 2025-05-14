import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

import { Brand } from '@brand/entities/brand.entity';

import { CreateBrandDto } from '@brand/dto/create-brand.dto';

export const createBrand = (): CreateBrandDto => ({
  name: faker.lorem.word(),
  createdBy: faker.number.int(),
  updatedBy: faker.number.int(),
  deletedBy: null,
});

export const generateBrand = (id: number = 1): Brand => ({
  ...generateBaseEntity(id),
  ...createBrand(),
  id,
});

export const generateManyBrands = (size: number): Brand[] => {
  const brands: Brand[] = [];
  for (let i = 0; i < size; i++) {
    brands.push(generateBrand(i + 1));
  }
  return brands;
};
