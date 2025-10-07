import { faker } from '@faker-js/faker/.';

/* Entity */
import { ProductSupplier } from '@product_supplier/entities/product-supplier.entity';
/* DTO */
import { CreateProductSupplierDto } from '@product_supplier/dto/create-product-supplier.dto';

/* Fakers */
import { generateBaseEntity } from '@faker/base.faker';
import { generateProduct } from './product.faker';
import { generateSupplier } from './supplier.faker';
import { generateUser } from './user.faker';

export const createProductSupplier = (): CreateProductSupplierDto => ({
  supplierProductCode: faker.string.alphanumeric(10),
  costPrice: parseFloat(faker.commerce.price({ min: 1, max: 1000 })),
  isPrimarySupplier: faker.datatype.boolean(),
  product: faker.number.int(),
  supplier: faker.number.int(),
});

export const generateProductSupplier = (id: number = 1): ProductSupplier => ({
  ...generateBaseEntity(id),
  ...createProductSupplier(),
  id,
  product: generateProduct(),
  supplier: generateSupplier(),
  createdBy: generateUser(),
  updatedBy: generateUser(),
  deletedBy: null,
});

export const generateManyProductSuppliers = (
  size: number,
): ProductSupplier[] => {
  const suppliers: ProductSupplier[] = [];
  for (let i = 0; i < size; i++) {
    suppliers.push(generateProductSupplier(i + 1));
  }
  return suppliers;
};
