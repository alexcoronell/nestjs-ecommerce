/* Entity */
import { User } from '@user/entities/user.entity';

/* DTO's */
import { CreateUserDto } from '@user/dto/create-user.dto';

/* Faker */
import { createUser, generateUser, generateManyUsers } from '@faker/user.faker';

export const newAdminUser: CreateUserDto = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'johndoe@email.com',
  password: 'john123',
  address: '555 Address',
  neighborhood: 'neighborhood test',
  phoneNumber: '555-55-55',
  createdBy: 1,
  updatedBy: 1,
  deletedBy: null,
};

export const newUser = createUser();

export const user: User = generateUser();

export const users: User[] = generateManyUsers(10);
