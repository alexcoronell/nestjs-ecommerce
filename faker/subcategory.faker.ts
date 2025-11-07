import { faker } from '@faker-js/faker/.';

/* Entity */
import { Subcategory } from '@subcategory/entities/subcategory.entity';

/* DTO */
import { CreateSubcategoryDto } from '@subcategory/dto/create-subcategory.dto';

/* Fakers */
import { generateBaseEntity } from '@faker/base.faker';
import { generateUser } from './user.faker';
import { generateCategory } from './category.faker';

export const createSubcategory = (
  categoryId: number = 1,
  name: string | null = null,
): CreateSubcategoryDto => {
  const category = categoryId || faker.number.int({ min: 1, max: 50 });
  return {
    name: name || faker.lorem.word(),
    category,
  };
};

export const generateSubcategory = (
  id: number = 1,
  categoryId: number = 1,
  name: string | null = null,
): Subcategory => ({
  ...generateBaseEntity(id),
  ...createSubcategory(categoryId, name || faker.lorem.word()),
  id,
  category: generateCategory(),
  createdBy: generateUser(),
  updatedBy: generateUser(),
  deletedBy: null,
  ...generateRelations(),
});

export const generateManySubcategories = (
  size: number,
  categoryId: number = 1,
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
