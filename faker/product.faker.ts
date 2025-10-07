import { faker } from '@faker-js/faker/.';

/* Entity */
import { Product } from '@product/entities/product.entity';

/* DTO */
import { CreateProductDto } from '@product/dto/create-product.dto';

/* Fakers */
import { generateBaseEntity } from '@faker/base.faker';
import { generateBrand } from './brand.faker';
import { generateCategory } from './category.faker';
import { generateUser } from './user.faker';
import { generateSubcategory } from './subcategory.faker';

export const createProduct = (): CreateProductDto => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseInt(faker.commerce.price()),
  stock: faker.number.int(),
  category: faker.number.int(),
  subcategory: faker.number.int(),
  brand: faker.number.int(),
});

export const generateProduct = (id: number = 1): Product => ({
  ...generateBaseEntity(id),
  ...createProduct(),
  id,
  brand: generateBrand(),
  category: generateCategory(),
  subcategory: generateSubcategory(),
  createdBy: generateUser(),
  updatedBy: generateUser(),
  deletedBy: null,
  images: [],
  productSuppliers: [],
  tags: [],
  productDiscounts: [],
  wishlists: [],
  saleDetails: [],
  purchaseDetails: [],
});

export const generateManyProducts = (size: number): Product[] => {
  const products: Product[] = [];
  for (let i = 0; i < size; i++) {
    products.push(generateProduct(i + 1));
  }
  return products;
};
