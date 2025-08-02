import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

import { Purchase } from '@purchase/entities/purchase.entity';

import { CreatePurchaseDto } from '@purchase/dto/create-purchase.dto';

export const createPurchase = (): CreatePurchaseDto => ({
  purchaseDate: faker.date.past(),
  totalAmount: parseFloat(faker.commerce.price()),
  createdBy: faker.number.int(),
  updatedBy: faker.number.int(),
  supplier: faker.number.int({ min: 1, max: 100 }),
});

export const generatePurchase = (id: number = 1): Purchase => ({
  ...generateBaseEntity(id),
  ...createPurchase(),
  id,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  deletedAt: null,
  isDeleted: false,
  deletedBy: null,
});

export const generateManyPurchases = (size: number): Purchase[] => {
  const purchases: Purchase[] = [];
  for (let i = 0; i < size; i++) {
    purchases.push(generatePurchase(i + 1));
  }
  return purchases;
};
