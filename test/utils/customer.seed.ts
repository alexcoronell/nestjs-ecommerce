/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as bcrypt from 'bcrypt';

/* Entity */
import { Customer } from '@customer/entities/customer.entity';

/* DTO's */
import { CreateCustomerDto } from '@customer/dto/create-customer.dto';

/* Faker */
import {
  createCustomer,
  generateCustomer,
  generateManyCustomers,
} from '@faker/customer.faker';

export const customerPasword = 'customer123';

export const seedNewCustomer = async (): Promise<CreateCustomerDto> => ({
  firstname: 'Alice',
  lastname: 'Smith',
  email: 'alice.smith@emailcustomer.com',
  password: await bcrypt.hash(customerPasword, 10),
  phoneNumber: '123-456-7890',
  department: 'Sales',
  city: 'New York',
  address: '123 Main St',
  neighborhood: 'Downtown',
});

export const seedNewCustomerDynamic = createCustomer();

export const seedCustomer: Customer = generateCustomer();

export const seedCustomers: Customer[] = generateManyCustomers(10);
