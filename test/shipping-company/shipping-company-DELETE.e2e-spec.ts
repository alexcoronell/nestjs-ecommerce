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
import { ShippingCompanyModule } from '@shipping_company/shipping-company.module';
import { UserModule } from '@user/user.module';

/* Interceptors */
import { AuditInterceptor } from '@commons/interceptors/audit.interceptor';

/* Seed */
import { initDataSource, cleanDB, closeDataSource } from '../utils/seed';

/* DataSource */
import { dataSource } from '../utils/seed';

/* Faker */
import { generateNewShippingCompanies } from '@faker/shippingCompany.faker';

/* Login Users */
import { loginAdmin } from '../utils/login-admin';
import { loginSeller } from '../utils/login-seller';
import { loginCustomer } from '../utils/login-customer';

/* ApiKey */
const API_KEY = process.env.API_KEY || 'api-e2e-key';

describe('ShippingCompanyController (e2e) [DELETE]', () => {
  let app: INestApplication<App>;
  let repo: any = undefined;
  let repoUser: any = undefined;
  let adminAccessToken: string;
  let sellerAccessToken: string;
  let customerAccessToken: string;
  const ID = 1;

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
        ShippingCompanyModule,
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
    repo = app.get('ShippingCompanyRepository');
    repoUser = app.get('UserRepository');
    const shippingCompanies = generateNewShippingCompanies(10);
    await repo.save(shippingCompanies);
  });

  beforeEach(async () => {
    // Clean all data before each test to ensure isolation
    await cleanDB();

    /* Login Users */
    const resLoginAdmin = await loginAdmin(app, repoUser);
    adminAccessToken = resLoginAdmin.access_token;
    const resLoginSeller = await loginSeller(app, repoUser);
    sellerAccessToken = resLoginSeller.access_token;
    const resLoginCustomer = await loginCustomer(app, repoUser);
    customerAccessToken = resLoginCustomer.access_token;

    const shippingCompanies = generateNewShippingCompanies(10);
    await repo.save(shippingCompanies);
  });

  describe('DELETE Shipping company', () => {
    it('/:id should delete a shipping company with admin user', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/shipping-company/${ID}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode } = res.body;
      const deletedInDB = await repo.findOne({
        where: { id: ID, isDeleted: false },
      });
      expect(statusCode).toBe(200);
      expect(deletedInDB).toBeNull();
    });

    it('/:id should return 401 if user is seller', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/shipping-company/${ID}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return 401 if user is customer', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/shipping-company/${ID}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return 401 if api key is missing', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/shipping-company/${ID}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });

    it('/:id should return 401 if api key is invalid', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/shipping-company/${ID}`)
        .set('x-api-key', 'invalid-api-key')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });

    it('/:id should return 404 if shipping company does not exist', async () => {
      const id = 9999;
      const res = await request(app.getHttpServer())
        .delete(`/shipping-company/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(404);
      expect(message).toBe(`The Shipping Company with ID: ${id} not found`);
    });
  });

  afterAll(async () => {
    await app.close();
    // Close database connection after all tests
    await closeDataSource();
  });
});
