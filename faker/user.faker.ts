/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

/* Entities */
import { User } from '@user/entities/user.entity';

import { CreateUserDto } from '@user/dto/create-user.dto';

export const createUser = (): CreateUserDto => ({
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  address: faker.location.streetAddress(),
  neighborhood: faker.location.county(),
  phoneNumber: faker.phone.number(),
  createdBy: faker.number.int(),
  updatedBy: faker.number.int(),
  deletedBy: null,
});

export const generateUser = (id: User['id'] = 1, isDeleted = false): User => ({
  ...generateBaseEntity(id, isDeleted),
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  address: faker.location.streetAddress(),
  neighborhood: faker.location.county(),
  phoneNumber: faker.phone.number(),
  isActive: true,
  createdBy: faker.number.int(),
  updatedBy: faker.number.int(),
  deletedBy: null,
  ...generateUserRelations(),
});

export const generateManyUsers = (size: number): User[] => {
  const limit = size ?? 10;
  const users: User[] = [];
  for (let i = 0; i < limit; i++) {
    users.push(generateUser(i + 1));
  }
  return users;
};
export const generateManyDeletedUsers = (size: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < size; i++) {
    users.push(generateUser(i, true));
  }
  return users;
};

const generateUserRelations = () => ({
  createdBrands: [],
  updatedBrands: [],
  deletedBrands: [],
  createdCategories: [],
  updatedCategories: [],
  deletedCategories: [],
  createdPaymentMethods: [],
  updatedPaymentMethods: [],
  deletedPaymentMethods: [],
  createdShippingCompanies: [],
  updatedShippingCompanies: [],
  deletedShippingCompanies: [],
  createdSuppliers: [],
  updatedSuppliers: [],
  deletedSuppliers: [],
  createdTags: [],
  updatedTags: [],
  deletedTags: [],
  createdUsers: [],
  updatedUsers: [],
  deletedUsers: [],
});
