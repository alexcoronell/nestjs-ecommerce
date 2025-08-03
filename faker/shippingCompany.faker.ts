import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

import { ShippingCompany } from '@shipping_company/entities/shipping-company.entity';

import { CreateShippingCompanyDto } from '@shipping_company/dto/create-shipping-company.dto';

export const createShippingCompany = (): CreateShippingCompanyDto => ({
  name: faker.company.name(),
  contactName: faker.person.fullName(),
  phoneNumber: faker.phone.number(),
  email: faker.internet.email(),
  createdBy: faker.number.int(),
  updatedBy: faker.number.int(),
  deletedBy: null,
});

export const generateShippingCompany = (id: number = 1): ShippingCompany => ({
  ...generateBaseEntity(id),
  ...createShippingCompany(),
  ...generateRelations(),
});

export const generateManyShippingCompanies = (
  size: number,
): ShippingCompany[] => {
  const shippingCompanies: ShippingCompany[] = [];
  for (let i = 0; i < size; i++) {
    shippingCompanies.push(generateShippingCompany(i + 1));
  }
  return shippingCompanies;
};

const generateRelations = () => ({
  sales: [],
  shipments: [],
});
