import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

import { PaymentMethod } from '@paymentMethod/entities/payment-method.entity';

import { CreatePaymentMethodDto } from '@paymentMethod/dto/create-payment-method.dto';

export const createPaymentMethod = (): CreatePaymentMethodDto => ({
  name: faker.lorem.word(),
  createdBy: faker.number.int(),
  updatedBy: faker.number.int(),
  deletedBy: null,
});

export const generatePaymentMethod = (id: number = 1): PaymentMethod => ({
  ...generateBaseEntity(id),
  ...createPaymentMethod(),
  id,
});

export const generateManyPaymentMethods = (size: number): PaymentMethod[] => {
  const paymentMethods: PaymentMethod[] = [];
  for (let i = 0; i < size; i++) {
    paymentMethods.push(generatePaymentMethod(i + 1));
  }
  return paymentMethods;
};
