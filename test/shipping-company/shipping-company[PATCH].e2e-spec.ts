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
import { ShippingCompanyModule } from '@shipping_company/shipping-company.module';
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
import { UpdateShippingCompanyDto } from '@shipping_company/dto/update-shipping-company.dto';

/* Faker */
import { generateNewShippingCompanies } from '@faker/shippingCompany.faker';

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

describe('ShippingCompanyController (e2e) [PATCH]', () => {
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

  describe('PATCH shipping company', () => {
    it('/:id should update a shipping company with admin user', async () => {
      const newShippingCompanies = generateNewShippingCompanies(10);
      const dataNewShippingCompanies = await repo.save(newShippingCompanies);
      const id = dataNewShippingCompanies[0].id;
      const updatedData: UpdateShippingCompanyDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/shipping-company/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.name).toBe(updatedData.name);
    });

    it('/:id should return 401 if the user is seller', async () => {
      const newShippingCompanies = generateNewShippingCompanies(10);
      const dataNewShippingCompanies = await repo.save(newShippingCompanies);
      const id = dataNewShippingCompanies[0].id;
      const updatedData: UpdateShippingCompanyDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/shipping-company/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(updatedData);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return 401 if the user is customer', async () => {
      const newShippingCompanies = generateNewShippingCompanies(10);
      const dataNewShippingCompanies = await repo.save(newShippingCompanies);
      const id = dataNewShippingCompanies[0].id;
      const updatedData: UpdateShippingCompanyDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/shipping-company/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send(updatedData);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return Conflict if shipping company name is already taken', async () => {
      const newShippingCompanies = await repo.save(
        generateNewShippingCompanies(10),
      );

      const shippingCompany = newShippingCompanies[0];
      const id = newShippingCompanies[1].id;

      const updatedData: UpdateShippingCompanyDto = {
        name: shippingCompany.name,
      };
      try {
        await request(app.getHttpServer())
          .post(`/shipping-company/${id}`)
          .send(updatedData);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `The Shipping Company NAME ${updatedData.name} is already in use`,
        );
      }
    });

    it('should return 404 if shipping company does not exist', async () => {
      const id = 9999;
      const updatedData: UpdateShippingCompanyDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/shipping-company/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(404);
      expect(message).toBe(`The Shipping Company with ID: ${id} not found`);
    });

    it('/:id should return 401 if api key is missing', async () => {
      const newShippingCompanies = generateNewShippingCompanies(10);
      const dataNewShippingCompanies = await repo.save(newShippingCompanies);
      const id = dataNewShippingCompanies[0].id;
      const updatedData: UpdateShippingCompanyDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/shipping-company/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });

    it('/:id should return 401 if api key is invalid', async () => {
      const newShippingCompanies = generateNewShippingCompanies(10);
      const dataNewShippingCompanies = await repo.save(newShippingCompanies);
      const id = dataNewShippingCompanies[0].id;
      const updatedData: UpdateShippingCompanyDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/shipping-company/${id}`)
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
