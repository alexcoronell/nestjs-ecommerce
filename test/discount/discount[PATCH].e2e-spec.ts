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

/* DTO's */
import { UpdateDiscountDto } from '@discount/dto/update-discount.dto';

/* Faker */
import { generateNewDiscounts } from '@faker/discount.faker';

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

describe('DiscountController (e2e) [PATCH]', () => {
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

  describe('PATCH Discount', () => {
    it('/:id should update a discount with admin user', async () => {
      const newDiscounts = generateNewDiscounts(10);
      const dataNewDiscounts = await repo.save(newDiscounts);
      const id = dataNewDiscounts[0].id;
      const updatedData: UpdateDiscountDto = {
        code: 'Updated code',
        description: 'updated-description',
      };
      const res = await request(app.getHttpServer())
        .patch(`/discount/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.code).toBe(updatedData.code);
    });

    it('/:id should return 401 if the user is seller', async () => {
      const newDiscounts = generateNewDiscounts(10);
      const dataNewDiscounts = await repo.save(newDiscounts);
      const id = dataNewDiscounts[0].id;
      const updatedData: UpdateDiscountDto = {
        code: 'Updated code',
      };
      const res = await request(app.getHttpServer())
        .patch(`/discount/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(updatedData);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return 401 if the user is customer', async () => {
      const newDiscounts = generateNewDiscounts(10);
      const dataNewDiscounts = await repo.save(newDiscounts);
      const id = dataNewDiscounts[0].id;
      const updatedData: UpdateDiscountDto = {
        code: 'Updated code',
      };
      const res = await request(app.getHttpServer())
        .patch(`/discount/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send(updatedData);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return Conflict if discount code is already taken', async () => {
      const newDiscounts = await repo.save(generateNewDiscounts(10));

      const discount = newDiscounts[0];
      const id = newDiscounts[1].id;

      const updatedData: UpdateDiscountDto = {
        code: discount.code,
      };
      try {
        await request(app.getHttpServer())
          .post(`/discount/${id}`)
          .send(updatedData);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `The Discount CODE: ${updatedData.code} is already in use`,
        );
      }
    });

    it('should return 404 if discount does not exist', async () => {
      const id = 9999;
      const updatedData: UpdateDiscountDto = {
        code: 'Updated code',
      };
      const res = await request(app.getHttpServer())
        .patch(`/discount/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(404);
      expect(message).toBe(`The Discount with ID: ${id} not found`);
    });

    it('/:id should return 401 if api key is missing', async () => {
      const newDiscounts = generateNewDiscounts(10);
      const dataNewDiscounts = await repo.save(newDiscounts);
      const id = dataNewDiscounts[0].id;
      const updatedData: UpdateDiscountDto = {
        code: 'Updated code',
      };
      const res = await request(app.getHttpServer())
        .patch(`/discount/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });

    it('/:id should return 401 if api key is invalid', async () => {
      const newDiscounts = generateNewDiscounts(10);
      const dataNewDiscounts = await repo.save(newDiscounts);
      const id = dataNewDiscounts[0].id;
      const updatedData: UpdateDiscountDto = {
        code: 'Updated code',
      };
      const res = await request(app.getHttpServer())
        .patch(`/discount/${id}`)
        .set('x-api-key', 'invalid-api-key')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });
  });

  afterAll(async () => {
    await app.close();
    // Close database connection after all tests
    await closeDataSource();
  });
});
