/* eslint-disable @typescript-eslint/no-unsafe-return */
import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

import { Subcategory } from '@subcategory/entities/subcategory.entity';

import { CreateSubcategoryDto } from '@subcategory/dto/create-subcategory.dto';

export const createSubcategory = (
  categoryId: number | null = null,
): CreateSubcategoryDto => {
  const category = categoryId || faker.number.int({ min: 1, max: 50 });
  return {
    name: faker.lorem.word(),
    category,
    createdBy: faker.number.int(),
    updatedBy: faker.number.int(),
    deletedBy: null,
  };
};

export const generateSubcategory = (id: number = 1): Subcategory => ({
  ...generateBaseEntity(id),
  ...createSubcategory(),
  id,
  ...generateRelations(),
});

export const generateManyCategories = (size: number): Subcategory[] => {
  const categories: Subcategory[] = [];
  for (let i = 0; i < size; i++) {
    categories.push(generateSubcategory(i + 1));
  }
  return categories;
};

const generateRelations = () => ({});
