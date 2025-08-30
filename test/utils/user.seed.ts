/* Entity */
import { User } from '@user/entities/user.entity';

/* DTO's */
import { CreateUserDto } from '@user/dto/create-user.dto';

/* Enums */
import { UserRoleEnum } from '@commons/enums/user-role.enum';

/* Faker */
import { createUser, generateUser, generateManyUsers } from '@faker/user.faker';

export const seedNewAdminUser: CreateUserDto = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'johndoe@email.com',
  password: 'john123',
  phoneNumber: '555-55-55',
  role: UserRoleEnum.ADMIN,
  createdBy: 1,
  updatedBy: null,
  deletedBy: null,
};

export const seedNewSellerUser: CreateUserDto = {
  firstname: 'Jane',
  lastname: 'Doe',
  email: 'janedoe@email.com',
  password: 'jane123',
  phoneNumber: '555-55-55',
  role: UserRoleEnum.SELLER,
  createdBy: 1,
  updatedBy: null,
  deletedBy: null,
};

export const seedNewUser = createUser();

export const seedUser: User = generateUser();

export const seedUsers: User[] = generateManyUsers(10);
