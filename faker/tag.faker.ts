import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

import { Tag } from '@tag/entities/tag.entity';

import { CreateTagDto } from '@tag/dto/create-tag.dto';

export const createTag = (): CreateTagDto => ({
  name: faker.lorem.word(),
  createdBy: faker.number.int(),
  updatedBy: faker.number.int(),
  deletedBy: null,
});

export const generateTag = (id: number = 1): Tag => ({
  ...generateBaseEntity(id),
  ...createTag(),
  id,
});

export const generateManyTags = (size: number): Tag[] => {
  const tags: Tag[] = [];
  for (let i = 0; i < size; i++) {
    tags.push(generateTag(i + 1));
  }
  return tags;
};
