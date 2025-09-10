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
  seedNewUser,
  seedUser,
  seedUsers,
  seedNewAdminUser,
  adminPassword,
  seedNewSellerUser,
  sellerPassword,
} from './utils/user.seed';

import {
  seedNewCustomer,
  customerPasword,
  seedCustomer,
  seedCustomers,
} from './utils/customer.seed';

const API_KEY = process.env.API_KEY || 'api-e2e-key';

describe('CustomerController (e2e)', () => {
  let app: INestApplication<App>;
  let repoUser: any = undefined;
  let repo: any = undefined;
  let adminUser: User | null = null;
  let sellerUser: User | null = null;
  let customer: Customer | null = null;
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
        UserModule,
        CustomerModule,
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
    repoUser = moduleFixture.get('UserRepository');
    repo = moduleFixture.get('CustomerRepository');
  });

  beforeEach(async () => {
    await upSeed();

    /* Login Admin User */
    adminUser = await repoUser.save(await seedNewAdminUser());
    const loginAdmin = await request(app.getHttpServer())
      .post('/auth/login')
      .set('x-api-key', API_KEY)
      .send({
        email: adminUser?.email,
        password: adminPassword,
      });
    const { access_token: tempAdminAccessToken } = loginAdmin.body;
    adminAccessToken = tempAdminAccessToken;

    /* Login Seller User */
    sellerUser = await repoUser.save(await seedNewSellerUser());
    const loginSeller = await request(app.getHttpServer())
      .post('/auth/login')
      .set('x-api-key', API_KEY)
      .send({
        email: sellerUser?.email,
        password: sellerPassword,
      });
    const { access_token: tempSellerAccessToken } = loginSeller.body;
    sellerAccessToken = tempSellerAccessToken;

    /* Login Customer User */
    customer = await repo.save(await seedNewCustomer());
    const loginCustomer = await request(app.getHttpServer())
      .post('/auth/login')
      .set('x-api-key', API_KEY)
      .send({
        email: customer?.email,
        password: customerPasword,
      });
    const { access_token: tempCustomerAccessToken } = loginCustomer.body;
    customerAccessToken = tempCustomerAccessToken;
  });

  describe('GET Customer - Count', () => {
    it('/count-all should return 200 and the total customer count with Admin User', async () => {
      await repo.save(seedCustomers);
      const data: any = await request(app.getHttpServer())
        .get('/customer/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, total } = data.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(seedCustomers.length);
    });

    it('/count-all should return 200 and the total customer count with Seller User', async () => {
      await repo.save(seedCustomers);
      const data: any = await request(app.getHttpServer())
        .get('/customer/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, total } = data.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(seedCustomers.length);
    });

    it('/count-all should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get(
        '/customer/count-all',
      );
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count-all should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/count-all')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count should return 200 and the total customer count with Admin User', async () => {
      await repo.save(seedCustomers);
      const data: any = await request(app.getHttpServer())
        .get('/customer/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, total } = data.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(seedCustomers.length);
    });

    it('/count should return 200 and the total customer count with Seller User', async () => {
      await repo.save(seedCustomers);
      const data: any = await request(app.getHttpServer())
        .get('/customer/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, total } = data.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(seedCustomers.length);
    });

    it('/count should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get(
        '/customer/count',
      );
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/customer/count')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    xit('/count-all should return 401 with Customer User', async () => {
      await repo.save(seedCustomers);
      const data: any = await request(app.getHttpServer())
        .get('/customer/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Unauthorized');
    });
  });
});
