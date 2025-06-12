import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

import { Discount } from 'src/discount/entities/discount.entity';

import { CreateDiscountDto } from 'src/discount/dto/create-discount.dto';

export const createDiscount = (): CreateDiscountDto => ({
  code: faker.commerce.productName(),
  description: faker.lorem.sentence(),
  type: faker.lorem.word(),
  value: faker.number.float({ min: 10, max: 50, fractionDigits: 2 }),
  startDate: faker.date.anytime(),
  endDate: faker.date.anytime(),
  minimumOrderAmount: faker.number.float({
    min: 10,
    max: 50,
    fractionDigits: 2,
  }),
  usageLimit: faker.number.int(),
  usageLimitPerUser: faker.number.int(),
  active: faker.datatype.boolean(),
  createdBy: faker.number.int(),
  updatedBy: faker.number.int(),
  deletedBy: null,
});

export const generateDiscount = (id: number = 1): Discount => ({
  ...generateBaseEntity(id),
  ...createDiscount(),
  id,
});

export const generateManyDiscounts = (size: number): Discount[] => {
  const discounts: Discount[] = [];
  for (let i = 0; i < size; i++) {
    discounts.push(generateDiscount(i + 1));
  }
  return discounts;
};
