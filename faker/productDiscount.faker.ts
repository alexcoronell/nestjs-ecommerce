/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { faker } from '@faker-js/faker/.';

import { ProductDiscount } from 'src/product-discount/entities/product-discount.entity';

import { CreateProductDiscountDto } from 'src/product-discount/dto/create-product-discount.dto';

export const createProductDiscount = (): CreateProductDiscountDto => ({
  product: faker.number.int({ min: 1, max: 100 }),
  discount: faker.number.int({ min: 1, max: 100 }),
  createdBy: faker.number.int({ min: 1, max: 100 }),
});

export const generateProductDiscount = (): ProductDiscount => {
  const productGenerated = createProductDiscount();
  const product = productGenerated.product;
  const discount = productGenerated.discount;
  const createdBy = productGenerated.createdBy;

  const productDiscount: ProductDiscount = {
    productId: product,
    discountId: discount,
    product,
    discount,
    createdBy,
    createdAt: faker.date.anytime(),
  };
  return productDiscount;
};

export const generateManyProductDiscounts = (
  size: number,
): ProductDiscount[] => {
  const images: ProductDiscount[] = [];
  for (let i = 0; i < size; i++) {
    images.push(generateProductDiscount());
  }
  return images;
};
