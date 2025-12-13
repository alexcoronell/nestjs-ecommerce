/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector, APP_INTERCEPTOR } from '@nestjs/core';

/* Modules */
import { AppModule } from '../../src/app.module';
import { DiscountModule } from '@discount/discount.module';
import { UserModule } from '@user/user.module';

/* Interfaces */
import { User } from '@user/entities/user.entity';

/* Interceptors */
import { AuditInterceptor } from '@commons/interceptors/audit.interceptor';

/* Seed */
import { initDataSource, cleanDB, closeDataSource } from '../utils/seed';

/* DataSource */
import { dataSource } from '../utils/seed';

/* Faker */
import { createDiscount, generateNewDiscounts } from '@faker/discount.faker';

/* Users for Login */
import {
  seedNewAdminUser,
  adminPassword,
  seedNewSellerUser,
  sellerPassword,
  seedNewCustomerUser,
  customerPassword,
} from '../utils/user.seed';

/* ApiKey */
const API_KEY = process.env.API_KEY || 'api-e2e-key';

describe('DiscountController (e2e) [GET]', () => {
  let app: INestApplication<App>;
  let repo: any = undefined;
  let repoUser: any = undefined;
  let adminUser: User | null = null;
  let sellerUser: User | null = null;
  let customerUser: User | null = null;
  let adminAccessToken: string;
  let sellerAccessToken: string;
  let customerAccessToken: string;

  beforeAll(async () => {
    // Initialize database connection once for the entire test suite
    await initDataSource();
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
        DiscountModule,
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
    repo = app.get('DiscountRepository');
    repoUser = app.get('UserRepository');
    const discounts = generateNewDiscounts(10);
    await repo.save(discounts);
  });

  beforeEach(async () => {
    // Clean all data before each test to ensure isolation
    await cleanDB();

    // Create fresh users for each test
    adminUser = await repoUser.save(await seedNewAdminUser());
    sellerUser = await repoUser.save(await seedNewSellerUser());
    customerUser = await repoUser.save(await seedNewCustomerUser());

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
      .post('/auth/user/login')
      .set('x-api-key', API_KEY)
      .send({
        email: customerUser?.email,
        password: customerPassword,
      });
    const { access_token: tempCustomererAccessToken } = loginCustomer.body;
    customerAccessToken = tempCustomererAccessToken;
  });

  describe('GET Discount - Count-All', () => {
    it('/count-all should return 200 with admin access token', async () => {
      const discounts = generateNewDiscounts(10);
      await repo.save(discounts);
      const res = await request(app.getHttpServer())
        .get('/discount/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(discounts.length);
    });

    it('/count-all should return 200 with seller access token', async () => {
      const discounts = generateNewDiscounts(10);
      await repo.save(discounts);
      const res = await request(app.getHttpServer())
        .get('/discount/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(discounts.length);
    });

    it('/count-all should return 401 with customer access token', async () => {
      const res = await request(app.getHttpServer())
        .get('/discount/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/count-all should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get(
        '/discount/count-all',
      );
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count-all should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/discount/count-all')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('GET Discount - Count', () => {
    it('/count should return 200 with admin access token', async () => {
      const discounts = generateNewDiscounts(10);
      await repo.save(discounts);
      const res = await request(app.getHttpServer())
        .get('/discount/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(discounts.length);
    });

    it('/count should return 200 with seller access token', async () => {
      const discounts = generateNewDiscounts(10);
      await repo.save(discounts);
      const res = await request(app.getHttpServer())
        .get('/discount/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(discounts.length);
    });

    it('/count should return 401 with customer access token', async () => {
      const res = await request(app.getHttpServer())
        .get('/discount/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/count should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get(
        '/discount/count',
      );
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/discount/count')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('GET Discount - / Find', () => {
    it('/ should return all discounts with admin user', async () => {
      const discounts = generateNewDiscounts(10);
      await repo.save(discounts);
      const res = await request(app.getHttpServer())
        .get('/discount')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(discounts.length);
      data.forEach((data) => {
        const discount = discounts.find((su) => su.code === data.code);
        expect(data).toEqual(
          expect.objectContaining({
            code: discount?.code,
          }),
        );
      });
    });

    it('/ should return all discounts with seller user', async () => {
      const discounts = generateNewDiscounts(10);
      await repo.save(discounts);
      const res = await request(app.getHttpServer())
        .get('/discount')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(discounts.length);
      data.forEach((data) => {
        const discount = discounts.find((su) => su.code === data.code);
        expect(data).toEqual(
          expect.objectContaining({
            code: discount?.code,
          }),
        );
      });
    });

    it('/ should return 401 with customer user', async () => {
      const discounts = generateNewDiscounts(10);
      await repo.save(discounts);
      const res = await request(app.getHttpServer())
        .get('/discount')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/ should return all discounts without logged user', async () => {
      const discounts = generateNewDiscounts(10);
      await repo.save(discounts);
      const res = await request(app.getHttpServer())
        .get('/discount')
        .set('x-api-key', API_KEY);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized');
    });

    it('/ should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get('/discount');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/discount')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('GET Discount - /:id FindOne', () => {
    it('/:id should return one discount by id with admin user', async () => {
      const discount = createDiscount();
      const dataNewDiscount = await repo.save(discount);
      const res = await request(app.getHttpServer())
        .get(`/discount/${dataNewDiscount.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewDiscount.id);
      expect(data.name).toEqual(dataNewDiscount.name);
    });

    it('/:id should return one discount by id with seller user', async () => {
      const discount = createDiscount();
      const dataNewDiscount = await repo.save(discount);
      const res = await request(app.getHttpServer())
        .get(`/discount/${dataNewDiscount.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewDiscount.id);
      expect(data.name).toEqual(dataNewDiscount.name);
    });

    it('/:id should return 401 by id with customer access token', async () => {
      const discount = createDiscount();
      const dataNewDiscount = await repo.save(discount);
      const res = await request(app.getHttpServer())
        .get(`/discount/${dataNewDiscount.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/:id should return 401 by id without access token', async () => {
      const discount = createDiscount();
      const dataNewDiscount = await repo.save(discount);
      const res = await request(app.getHttpServer())
        .get(`/discount/${dataNewDiscount.id}`)
        .set('x-api-key', API_KEY);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized');
    });

    it('/:id should return 401 by id without api key', async () => {
      const discount = createDiscount();
      const dataNewDiscount = await repo.save(discount);
      const res = await request(app.getHttpServer())
        .get(`/discount/${dataNewDiscount.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });

    it('/:id should return 404 by id if discount does not exist', async () => {
      const discount = createDiscount();
      await repo.save(discount);
      const res = await request(app.getHttpServer())
        .get(`/discount/9999999`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(404);
      expect(error).toBe('Not Found');
      expect(message).toBe('The Discount with ID: 9999999 not found');
    });
  });

  describe('GET Discount - /:code FindOne', () => {
    it('/code/:code should return an discount by code with admin user', async () => {
      const discount = createDiscount();
      const dataNewDiscount = await repo.save(discount);
      const res = await request(app.getHttpServer())
        .get(`/discount/code/${discount.code}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewDiscount.id);
      expect(data.code).toEqual(dataNewDiscount.code);
    });

    it('/code/:code should return an discount by code with seller user', async () => {
      const discount = createDiscount();
      const dataNewDiscount = await repo.save(discount);
      const res = await request(app.getHttpServer())
        .get(`/discount/code/${discount.code}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewDiscount.id);
      expect(data.code).toEqual(dataNewDiscount.code);
    });

    it('/code/:code should return 401 with customer user', async () => {
      const discount = createDiscount();
      await repo.save(discount);
      const res = await request(app.getHttpServer())
        .get(`/discount/code/${discount.code}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/:code should return 401 by code without access token', async () => {
      const discount = createDiscount();
      const dataNewDiscount = await repo.save(discount);
      const res = await request(app.getHttpServer())
        .get(`/discount/${dataNewDiscount.code}`)
        .set('x-api-key', API_KEY);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized');
    });

    it('/:code should return 401 by code without api key', async () => {
      const discount = createDiscount();
      const dataNewDiscount = await repo.save(discount);
      const res = await request(app.getHttpServer())
        .get(`/discount/${dataNewDiscount.code}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });

    it('/code/:code should return 404 by code if discount does not exist', async () => {
      const discount = createDiscount();
      await repo.save(discount);
      const res = await request(app.getHttpServer())
        .get(`/discount/code/un-existing-code`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(404);
      expect(error).toBe('Not Found');
      expect(message).toBe(
        'The Discount with CODE: un-existing-code not found',
      );
    });
  });

  afterAll(async () => {
    await app.close();
    // Close database connection after all tests
    await closeDataSource();
  });
});
