/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from './base.faker';

import { BaseEntity } from '@commons/entities/baseEntity';
import { PersonEntity } from '@commons/entities/personEntity';

import { CreatePersonDto } from '@commons/dtos/CreatePerson.dto';

export const createPerson = (): CreatePersonDto => ({
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phoneNumber: faker.phone.number(),
});

export const generatePersonEntity = (
  id: BaseEntity['id'] = 1,
  isDeleted = false,
): PersonEntity => ({
  ...generateBaseEntity(id),
  ...createPerson(),
  isDeleted,
  isActive: true,
});
