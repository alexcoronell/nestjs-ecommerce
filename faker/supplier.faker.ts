import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

import { Supplier } from '@supplier/entities/supplier.entity';

import { CreateSupplierDto } from '@supplier/dto/create-supplier.dto';

export const createSupplier = (): CreateSupplierDto => ({
  name: faker.company.name(),
  contactName: faker.person.fullName(),
  phoneNumber: faker.phone.number(),
  email: faker.internet.email(),
  createdBy: faker.number.int(),
  updatedBy: faker.number.int(),
  deletedBy: null,
});

export const generateSupplier = (id: number = 1): Supplier => ({
  ...generateBaseEntity(id),
  ...createSupplier(),
  productSuppliers: [],
  purchases: [],
});

export const generateManySuppliers = (size: number): Supplier[] => {
  const suppliers: Supplier[] = [];
  for (let i = 0; i < size; i++) {
    suppliers.push(generateSupplier(i + 1));
  }
  return suppliers;
};
