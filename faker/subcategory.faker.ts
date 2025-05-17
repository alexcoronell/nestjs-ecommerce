/* eslint-disable @typescript-eslint/no-unsafe-return */
import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

import { Subcategory } from '@subcategory/entities/subcategory.entity';

import { CreateSubcategoryDto } from '@subcategory/dto/create-subcategory.dto';

export const createSubcategory = (
  categoryId: number | null = null,
  name: string | null = null,
): CreateSubcategoryDto => {
  const category = categoryId || faker.number.int({ min: 1, max: 50 });
  return {
    name: name || faker.lorem.word(),
    category,
    createdBy: faker.number.int(),
    updatedBy: faker.number.int(),
    deletedBy: null,
  };
};

export const generateSubcategory = (
  id: number = 1,
  categoryId: number | null = null,
  name: string | null = null,
): Subcategory => ({
  ...generateBaseEntity(id),
  ...createSubcategory(categoryId, name || faker.lorem.word()),
  id,
  ...generateRelations(),
});

export const generateManySubcategories = (
  size: number,
  categoryId: number | null = null,
  name: string | null = null,
): Subcategory[] => {
  const categories: Subcategory[] = [];
  for (let i = 0; i < size; i++) {
    const finalName = i === 0 && name ? name : faker.lorem.word(1);
    categories.push(generateSubcategory(i + 1, categoryId, finalName));
  }
  return categories;
};

const generateRelations = () => ({
  products: [],
});
