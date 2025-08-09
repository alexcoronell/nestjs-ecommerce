import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

import { Brand } from '@brand/entities/brand.entity';

import { CreateBrandDto } from '@brand/dto/create-brand.dto';

export const createBrand = (): CreateBrandDto => ({
  name: faker.lorem.words(2),
  createdBy: 1,
  updatedBy: 1,
  deletedBy: null,
});

export const generateNewBrands = (size: number = 1): CreateBrandDto[] => {
  const newBrands: CreateBrandDto[] = [];
  for (let i = 0; i < size; i++) {
    newBrands.push(createBrand());
  }
  return newBrands;
};

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
