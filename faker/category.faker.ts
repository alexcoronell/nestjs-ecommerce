/* eslint-disable @typescript-eslint/no-unsafe-return */
import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

import { Category } from '@category/entities/category.entity';

import { CreateCategoryDto } from '@category/dto/create-category.dto';

export const createCategory = (): CreateCategoryDto => ({
  name: faker.lorem.word(),
  createdBy: faker.number.int(),
  updatedBy: faker.number.int(),
  deletedBy: null,
});

export const generateCategory = (id: number = 1): Category => ({
  ...generateBaseEntity(id),
  ...createCategory(),
  id,
  ...generateRelations(),
});

export const generateManyCategories = (size: number): Category[] => {
  const categories: Category[] = [];
  for (let i = 0; i < size; i++) {
    categories.push(generateCategory(i + 1));
  }
  return categories;
};

const generateRelations = () => ({
  subcategories: [],
  products: [],
});
