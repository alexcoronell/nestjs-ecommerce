/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector, APP_INTERCEPTOR } from '@nestjs/core';
import * as bcrypt from 'bcrypt';

/* Modules */
import { AppModule } from '../src/app.module';
import { UserModule } from '../src/user/user.module';
import { CustomerModule } from '../src/customer/customer.module';

/* Interceptors */
import { AuditInterceptor } from '@commons/interceptors/audit.interceptor';

/* Entities */
import { Customer } from '../src/customer/entities/customer.entity';
import { User } from '@user/entities/user.entity';

/* DTO's */
import { UpdateCustomerDto } from '@customer/dto/update-customer.dto';

/* Seed */
import { upSeed, downSeed } from './utils/seed';

/* DataSource */
import { dataSource } from './utils/seed';

/* Faker */
import { createCustomer } from '@faker/customer.faker';

/* Seed */
import {
  seedNewAdminUser,
  adminPassword,
  seedNewSellerUser,
  sellerPassword,
} from './utils/user.seed';

import {
  seedNewCustomer,
  customerPasword,
  seedCustomers,
} from './utils/customer.seed';

const API_KEY = process.env.API_KEY || 'api-e2e-key';

describe('CustomerController (e2e)', () => {
  let app: INestApplication<App>;
  let repo: any = undefined;
  let repoUser: any = undefined;
  let adminUser: User | null = null;
  let sellerUser: User | null = null;
  let customer: Customer | null = null;
  let customers: Customer[] = [];
  let adminAccessToken: string;
  let sellerAccessToken: string;
  let customerAccessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.e2e',
        }),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            synchronize: true,
            ...dataSource.options,
          }),
        }),
        AppModule,
        CustomerModule,
        UserModule,
      ],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: AuditInterceptor,
        },
        Reflector,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    repo = moduleFixture.get('CustomerRepository');
    repoUser = moduleFixture.get('UserRepository');
  });

  beforeEach(async () => {
    await upSeed();
    const customersToSave = [await seedNewCustomer(), ...seedCustomers];
    adminUser = await repoUser.save(await seedNewAdminUser());
    sellerUser = await repoUser.save(await seedNewSellerUser());
    customers = await repo.save(customersToSave);
    const tempCustomer = await seedNewCustomer();
    customer = await repo.findOneBy({ email: tempCustomer.email });

    /* Login Admin User */
    const loginAdmin = await request(app.getHttpServer())
      .post('/auth/user/login')
      .set('x-api-key', API_KEY)
      .send({
        email: adminUser?.email,
        password: adminPassword,
      });
    const { access_token: tempAdminAccessToken } = loginAdmin.body;
    adminAccessToken = tempAdminAccessToken;

    /* Login Seller User */
    const loginSeller = await request(app.getHttpServer())
      .post('/auth/user/login')
      .set('x-api-key', API_KEY)
      .send({
        email: sellerUser?.email,
        password: sellerPassword,
      });
    const { access_token: tempSellerAccessToken } = loginSeller.body;
    sellerAccessToken = tempSellerAccessToken;

    /* Login Customer User */
    const loginCustomer = await request(app.getHttpServer())
      .post('/auth/customer/login')
      .set('x-api-key', API_KEY)
      .send({
        email: customer?.email,
        password: customerPasword,
      });
    const { access_token: tempCustomerAccessToken } = loginCustomer.body;
    customerAccessToken = tempCustomerAccessToken;
  });

  describe('GET Customer - Count', () => {
    it('/count-all should return 200 and the total customers count with Admin User', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, total } = data.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(customers.length);
    });

    it('/count-all should return 200 and the total customers count with Seller User', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, total } = data.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(customers.length);
    });

    it('/count-all should return 401 if api key is missing with user login', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/count-all')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count-all should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/count-all')
        .set('x-api-key', 'invalid-api-key')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count-all should return 401 when not login', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/count-all')
        .set('x-api-key', API_KEY);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Unauthorized');
    });

    it('/count-all should return 401 with Customer User', async () => {
      await repo.save(seedCustomers);
      const data: any = await request(app.getHttpServer())
        .get('/customer/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = data.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer user');
    });

    it('/count should return 200 and the total customers count with Admin User', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, total } = data.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(customers.length);
    });

    it('/count should return 200 and the total customers count with Seller User', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, total } = data.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(customers.length);
    });

    it('/count should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/count')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/count')
        .set('x-api-key', 'invalid-api-key')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count should return 401 when not login', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/count-all')
        .set('x-api-key', API_KEY);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Unauthorized');
    });

    it('/count should return 401 with Customer User', async () => {
      await repo.save(seedCustomers);
      const data: any = await request(app.getHttpServer())
        .get('/customer/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = data.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer user');
    });
  });

  describe('GET Customer - Find', () => {
    it('/ should return all customers with admin user', async () => {
      const res = await request(app.getHttpServer())
        .get('/customer')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(customers.length);
      data.forEach((customer) => {
        const customersMock = customers.find((su) => su.id === customer.id);
        expect(customer).toEqual(
          expect.objectContaining({
            id: customersMock?.id,
            firstname: customersMock?.firstname,
            lastname: customersMock?.lastname,
            email: customersMock?.email,
          }),
        );
      });
    });
    it('/ should return all customers with seller user', async () => {
      const res = await request(app.getHttpServer())
        .get('/customer')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(customers.length);
      data.forEach((customer) => {
        const customersMock = customers.find((su) => su.id === customer.id);
        expect(customer).toEqual(
          expect.objectContaining({
            id: customersMock?.id,
            firstname: customersMock?.firstname,
            lastname: customersMock?.lastname,
            email: customersMock?.email,
          }),
        );
      });
    });

    it('/ should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer')
        .set('x-api-key', 'invalid-api-key')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 when not login', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer')
        .set('x-api-key', API_KEY);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Unauthorized');
    });

    it('/actives should return all customers with admin user', async () => {
      const res = await request(app.getHttpServer())
        .get('/customer/actives')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(customers.length);
      data.forEach((customer) => {
        const customersMock = customers.find((su) => su.id === customer.id);
        expect(customer).toEqual(
          expect.objectContaining({
            id: customersMock?.id,
            firstname: customersMock?.firstname,
            lastname: customersMock?.lastname,
            email: customersMock?.email,
          }),
        );
      });
    });

    it('/actives should return all customers with seller user', async () => {
      const res = await request(app.getHttpServer())
        .get('/customer/actives')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(customers.length);
      data.forEach((customer) => {
        const customersMock = customers.find((su) => su.id === customer.id);
        expect(customer).toEqual(
          expect.objectContaining({
            id: customersMock?.id,
            firstname: customersMock?.firstname,
            lastname: customersMock?.lastname,
            email: customersMock?.email,
          }),
        );
      });
    });

    it('/actives should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/actives')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/actives should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/actives')
        .set('x-api-key', 'invalid-api-key')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/actives should return 401 when not login', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/actives')
        .set('x-api-key', API_KEY);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Unauthorized');
    });

    it('/:id should return a customer with admin user', async () => {
      const { id } = customers[0];
      const res: any = await request(app.getHttpServer())
        .get(`/customer/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.firstname).toEqual(customers[0].firstname);
      expect(data.lastname).toEqual(customers[0].lastname);
      expect(data.department).toEqual(customers[0].department);
    });

    it('/:id should return a customer with seller user', async () => {
      const { id } = customers[0];
      const res: any = await request(app.getHttpServer())
        .get(`/customer/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.firstname).toEqual(customers[0].firstname);
      expect(data.lastname).toEqual(customers[0].lastname);
      expect(data.department).toEqual(customers[0].department);
    });

    it('/:id should return 401 when a customer get other customer', async () => {
      const { id } = customers[6];
      const res = await request(app.getHttpServer())
        .get(`/customer/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Different Customer');
    });

    it('/:id should return 401 when not login', async () => {
      const { id } = customers[6];
      const data: any = await request(app.getHttpServer())
        .get(`/customer/${id}`)
        .set('x-api-key', API_KEY);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Unauthorized');
    });

    it('/email/:email should return one customer with admin user', async () => {
      const { email } = customers[0];
      const res = await request(app.getHttpServer())
        .get(`/customer/email/${email}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.firstname).toEqual(customers[0].firstname);
      expect(data.lastname).toEqual(customers[0].lastname);
      expect(data.department).toEqual(customers[0].department);
    });

    it('/email/:email should return one customer with seller user', async () => {
      const { email } = customers[0];
      const res = await request(app.getHttpServer())
        .get(`/customer/email/${email}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.firstname).toEqual(customers[0].firstname);
      expect(data.lastname).toEqual(customers[0].lastname);
      expect(data.department).toEqual(customers[0].department);
    });

    it('/email/:email should return 401 when a customer get other customer', async () => {
      const { email } = customers[6];
      const res = await request(app.getHttpServer())
        .get(`/customer/email/${email}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Different Customer');
    });

    it('/email/:email should return 401 when not login', async () => {
      const { email } = customers[6];
      const data: any = await request(app.getHttpServer())
        .get(`/customer/email/${email}`)
        .set('x-api-key', API_KEY);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Unauthorized');
    });
  });
});
