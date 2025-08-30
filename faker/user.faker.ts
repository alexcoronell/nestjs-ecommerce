import { faker } from '@faker-js/faker/.';

import { generateBaseEntity } from '@faker/base.faker';

/* Entities */
import { User } from '@user/entities/user.entity';

/* DTO's */
import { CreateUserDto } from '@user/dto/create-user.dto';

/* Enums */
import { UserRoleEnum } from '@commons/enums/user-role.enum';

export const createUser = (): CreateUserDto => ({
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password(),
  phoneNumber: faker.phone.number(),
  role: faker.helpers.arrayElement(Object.values(UserRoleEnum)),
  createdBy: null,
  updatedBy: null,
  deletedBy: null,
});

export const generateUser = (
  id: User['id'] = 1,
  isDeleted = false,
  auditUser = 1,
): User => ({
  ...generateBaseEntity(id, isDeleted),
  ...createUser(),
  isActive: true,
  id,
  createdBy: auditUser,
  updatedBy: auditUser,
  deletedBy: null,
});

export const generateManyUsers = (size: number): User[] => {
  const limit = size ?? 10;
  const users: User[] = [];
  for (let i = 0; i < limit; i++) {
    users.push(generateUser(i + 1));
  }
  return users;
};
export const generateManyDeletedUsers = (size: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < size; i++) {
    users.push(generateUser(i, true));
  }
  return users;
};

export const generateUserRelations = () => ({
  createdBrands: [],
  updatedBrands: [],
  deletedBrands: [],
  createdCategories: [],
  updatedCategories: [],
  deletedCategories: [],
  createdDiscounts: [],
  updatedDiscounts: [],
  deletedDiscounts: [],
  createdPaymentMethods: [],
  updatedPaymentMethods: [],
  deletedPaymentMethods: [],
  createdProducts: [],
  updatedProducts: [],
  deletedProducts: [],
  createdProductDiscounts: [],
  uploadedProductImages: [],
  createdProductSuppliers: [],
  updatedProductSuppliers: [],
  deletedProductSuppliers: [],
  createdProductsTags: [],
  createdPurchases: [],
  updatedPurchases: [],
  deletedPurchases: [],
  createdPurchaseDetails: [],
  updatedPurchaseDetails: [],
  deletedPurchaseDetails: [],
  cancelledSales: [],
  createdShipments: [],
  updatedShipments: [],
  deletedShipments: [],
  createdShippingCompanies: [],
  updatedShippingCompanies: [],
  deletedShippingCompanies: [],
  createdStoreDetail: [],
  updatedStoreDetail: [],
  createdSubcategories: [],
  updatedSubcategories: [],
  deletedSubcategories: [],
  createdSuppliers: [],
  updatedSuppliers: [],
  deletedSuppliers: [],
  createdTags: [],
  updatedTags: [],
  deletedTags: [],
  createdUsers: [],
  updatedUsers: [],
  deletedUsers: [],
  wishlists: [],
});
