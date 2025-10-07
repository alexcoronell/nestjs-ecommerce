import { faker } from '@faker-js/faker/.';

/* Entity */
import { ProductImage } from '@product_images/entities/product-image.entity';

/* DTO */
import { CreateProductImageDto } from '@product_images/dto/create-product-image.dto';

/* Fakers */
import { generateBaseEntity } from '@faker/base.faker';
import { generateProduct } from './product.faker';
import { generateUser } from './user.faker';

export const createProductImage = (): CreateProductImageDto => ({
  filePath: faker.system.filePath(),
  title: faker.lorem.words(3),
  isMain: faker.datatype.boolean(),
  product: faker.number.int(),
  uploadedBy: faker.number.int(),
});

export const generateProductImage = (id: number = 1): ProductImage => ({
  ...generateBaseEntity(id),
  ...createProductImage(),
  id,
  product: generateProduct(),
  uploadedBy: generateUser(),
});

export const generateManyProductImages = (size: number): ProductImage[] => {
  const images: ProductImage[] = [];
  for (let i = 0; i < size; i++) {
    images.push(generateProductImage(i + 1));
  }
  return images;
};
