import { faker } from '@faker-js/faker/.';
import { generateBaseEntity } from '@faker/base.faker';
import { ProductSupplier } from '@product_supplier/entities/product-supplier.entity';

export const createProductSupplier = () => ({
  supplierProductCode: faker.string.alphanumeric(10),
  costPrice: parseFloat(faker.commerce.price({ min: 1, max: 1000 })),
  isPrimarySupplier: faker.datatype.boolean(),
  product: faker.number.int(),
  createdBy: faker.number.int(),
  updatedBy: faker.number.int(),
  deletedBy: null,
});

export const generateProductSupplier = (id: number = 1): ProductSupplier => ({
  ...generateBaseEntity(id),
  ...createProductSupplier(),
  id,
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
