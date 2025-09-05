/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as bcrypt from 'bcrypt';

/* Entity */
import { User } from '@user/entities/user.entity';

/* DTO's */
import { CreateUserDto } from '@user/dto/create-user.dto';

/* Enums */
import { UserRoleEnum } from '@commons/enums/user-role.enum';

/* Faker */
import { createUser, generateUser, generateManyUsers } from '@faker/user.faker';

export const seedNewAdminUser = async (): Promise<CreateUserDto> => ({
  firstname: 'John',
  lastname: 'Doe',
  email: 'johndoe@email.com',
  password: await bcrypt.hash('john123', 10),
  phoneNumber: '555-55-55',
  role: UserRoleEnum.ADMIN,
  createdBy: 1,
  updatedBy: null,
  deletedBy: null,
});

export const adminPassword = 'john123';

export const seedNewSellerUser = async (): Promise<CreateUserDto> => ({
  firstname: 'Jane',
  lastname: 'Doe',
  email: 'janedoe@email.com',
  password: await bcrypt.hash('jane123', 10),
  phoneNumber: '555-55-55',
  role: UserRoleEnum.SELLER,
  createdBy: 1,
  updatedBy: null,
  deletedBy: null,
});

export const sellerPassword = 'jane123';

export const seedNewUser = createUser();

export const seedUser: User = generateUser();

export const seedUsers: User[] = generateManyUsers(10);
