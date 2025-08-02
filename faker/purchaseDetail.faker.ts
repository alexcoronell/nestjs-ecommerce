import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

import { PurchaseDetail } from '@purchase_detail/entities/purchase-detail.entity';

import { CreatePurchaseDetailDto } from '@purchase_detail/dto/create-purchase-detail.dto';

export const createPurchaseDetail = (): CreatePurchaseDetailDto => {
  return {
    quantity: faker.number.int({ min: 1, max: 100 }),
    unitPrice: parseFloat(faker.commerce.price()),
    subtotal: parseFloat(faker.commerce.price()),
    product: faker.number.int(),
    purchase: faker.number.int(),
    createdBy: faker.number.int(),
    updatedBy: faker.number.int(),
    deletedBy: null,
  };
};

export const generatePurchaseDetail = (id: number = 1): PurchaseDetail => ({
  ...generateBaseEntity(id),
  ...createPurchaseDetail(),
  id,
});

export const generateManyPurchaseDetails = (size: number): PurchaseDetail[] => {
  const purchaseDetails: PurchaseDetail[] = [];
  for (let i = 0; i < size; i++) {
    purchaseDetails.push(generatePurchaseDetail(i + 1));
  }
  return purchaseDetails;
};
