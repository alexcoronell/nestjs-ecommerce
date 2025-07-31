import { faker } from '@faker-js/faker/.';

import { Sale } from '@sale/entities/sale.entity';

import { CreateSaleDto } from '@sale/dto/create-sale.dto';

export const createSale = (): CreateSaleDto => ({
  totalAmount: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
  shippingAddress: faker.location.streetAddress(),
  shippingStatus: faker.lorem.word(),
  user: faker.number.int({ min: 1, max: 100 }),
  paymentMethod: faker.number.int({ min: 1, max: 10 }),
  shippingCompany: faker.number.int({ min: 1, max: 10 }),
});

export const generateSale = (id: number = 1): Sale => ({
  ...createSale(),
  id,
  saleDate: faker.date.recent(),
  cancelledAt: null,
  cancelledBy: null,
});

export const generateManySales = (size: number): Sale[] => {
  const sales: Sale[] = [];
  for (let i = 0; i < size; i++) {
    sales.push(generateSale(i + 1));
  }
  return sales;
};
