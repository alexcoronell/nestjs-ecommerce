import { faker } from '@faker-js/faker/.';

/* Entity */
import { Category } from '@category/entities/category.entity';

/* DTO */
import { CreateCategoryDto } from '@category/dto/create-category.dto';

/* Fakers */
import { generateBaseEntity } from '@faker/base.faker';
import { generateUser } from './user.faker';

/* Utils */
import { createSlug } from '../src/commons/utils/create-slug.uti';

export const createCategory = (): CreateCategoryDto => {
  const name = faker.lorem.word();
  return {
    name,
    slug: createSlug(name),
  };
};

export const generateCategory = (id: number = 1): Category => ({
  ...generateBaseEntity(id),
  ...createCategory(),
  id,
  createdBy: generateUser(),
  updatedBy: generateUser(),
  deletedBy: null,
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
