import { faker } from '@faker-js/faker/.';

/* Entity */
import { ProductDiscount } from 'src/product-discount/entities/product-discount.entity';

/* DTO */
import { CreateProductDiscountDto } from 'src/product-discount/dto/create-product-discount.dto';

/* Fakers */
import { generateDiscount } from './discount.faker';
import { generateProduct } from './product.faker';
import { generateUser } from './user.faker';

export const createProductDiscount = (): CreateProductDiscountDto => ({
  product: faker.number.int({ min: 1, max: 100 }),
  discount: faker.number.int({ min: 1, max: 100 }),
});

export const generateNewProductDiscounts = (
  size: number = 1,
): CreateProductDiscountDto[] => {
  const newProducDiscounts: CreateProductDiscountDto[] = [];
  for (let i = 0; i < size; i++) {
    newProducDiscounts.push(createProductDiscount());
  }
  return newProducDiscounts;
};

export const generateProductDiscount = (): ProductDiscount => {
  const product = generateProduct();
  const discount = generateDiscount();
  const createdBy = generateUser();

  const productDiscount: ProductDiscount = {
    productId: product.id,
    discountId: discount.id,
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
