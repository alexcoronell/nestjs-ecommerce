import { faker } from '@faker-js/faker/.';

import { Customer } from '@customer/entities/customer.entity';

import { createPerson, generatePersonEntity } from './person.faker';
import { CreateCustomerDto } from '@customer/dto/create-customer.dto';

export const createCustomer = (): CreateCustomerDto => ({
  ...createPerson(),
  department: faker.location.state(),
  city: faker.location.city(),
  address: faker.location.streetAddress(),
  neighborhood: faker.location.street(),
});

export const generateCustomer = (
  id: Customer['id'] = 1,
  isDeleted = false,
): Customer => ({
  ...generatePersonEntity(id, isDeleted),
  ...createCustomer(),
});

export const generateManyCustomers = (size: number = 1): Customer[] => {
  const limit = size ?? 10;
  const customers: Customer[] = [];
  for (let i = 0; i < limit; i++) {
    customers.push(generateCustomer(i + 1));
  }
  return customers;
};
