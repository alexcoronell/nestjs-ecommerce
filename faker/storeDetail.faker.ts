import { faker } from '@faker-js/faker/.';

import { StoreDetail } from '@store_detail/entities/store-detail.entity';

export const generateStoreDetail = (): StoreDetail => ({
  id: 1,
  name: faker.company.name(),
  country: faker.location.country(),
  state: faker.location.state(),
  city: faker.location.city(),
  neighborhood: faker.location.county(),
  address: faker.location.streetAddress(),
  phone: faker.phone.number(),
  email: faker.internet.email(),
  legalInformation: faker.lorem.paragraphs(2),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
  createdBy: 1,
  updatedBy: 1,
});
