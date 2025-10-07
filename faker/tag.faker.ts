import { faker } from '@faker-js/faker/.';

/* Entity */
import { Tag } from '@tag/entities/tag.entity';

/* DTO */
import { CreateTagDto } from '@tag/dto/create-tag.dto';

/* Fakers */
import { generateBaseEntity } from '@faker/base.faker';
import { generateManyProductTags } from './productTag.faker';
import { generateUser } from './user.faker';

export const createTag = (): CreateTagDto => ({
  name: faker.lorem.word(),
});

export const generateTag = (id: number = 1): Tag => ({
  ...generateBaseEntity(id),
  ...createTag(),
  id,
  createdBy: generateUser(),
  updatedBy: generateUser(),
  deletedBy: null,
  product: generateManyProductTags(2),
});

export const generateManyTags = (size: number): Tag[] => {
  const tags: Tag[] = [];
  for (let i = 0; i < size; i++) {
    tags.push(generateTag(i + 1));
  }
  return tags;
};
