import { faker } from '@faker-js/faker/.';

import { SaleDetail } from '@sale_detail/entities/sale-detail.entity';

import { CreateSaleDetailDto } from '@sale_detail/dto/create-sale-detail.dto';

export const createSaleDetail = (): CreateSaleDetailDto => ({
  quantity: faker.number.int({ min: 1, max: 10 }),
  unitPrice: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
  subtotal: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
  sale: faker.number.int({ min: 1, max: 100 }),
  product: faker.number.int({ min: 1, max: 100 }),
});

export const generateSaleDetail = (id: number = 1): SaleDetail => ({
  ...createSaleDetail(),
  id,
  createdAt: faker.date.recent(),
});

export const generateManySaleDetails = (size: number): SaleDetail[] => {
  const saleDetails: SaleDetail[] = [];
  for (let i = 0; i < size; i++) {
    saleDetails.push(generateSaleDetail(i + 1));
  }
  return saleDetails;
};
