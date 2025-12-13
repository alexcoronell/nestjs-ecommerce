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
import { SupplierModule } from '@supplier/supplier.module';
import { UserModule } from '@user/user.module';

/* Interceptors */
import { AuditInterceptor } from '@commons/interceptors/audit.interceptor';

/* DTO's */
import { UpdateSupplierDto } from '@supplier/dto/update-supplier.dto';

/* Seed */
import { initDataSource, cleanDB, closeDataSource } from '../utils/seed';

/* DataSource */
import { dataSource } from '../utils/seed';

/* Faker */
import { generateNewSuppliers } from '@faker/supplier.faker';

/* Login Users */
import { loginAdmin } from '../utils/login-admin';
import { loginSeller } from '../utils/login-seller';
import { loginCustomer } from '../utils/login-customer';

/* ApiKey */
const API_KEY = process.env.API_KEY || 'api-e2e-key';

describe('supplierController (e2e) [GET]', () => {
  let app: INestApplication<App>;
  let repo: any = undefined;
  let repoUser: any = undefined;
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
        SupplierModule,
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
    repo = app.get('SupplierRepository');
    repoUser = app.get('UserRepository');
    const suppliers = generateNewSuppliers(10);
    await repo.save(suppliers);
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
  });

  describe('PATCH supplier', () => {
    it('/:id should update a supplier with admin user', async () => {
      const newSuppliers = generateNewSuppliers(10);
      const dataNewSuppliers = await repo.save(newSuppliers);
      const id = dataNewSuppliers[0].id;
      const updatedData: UpdateSupplierDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/supplier/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.name).toBe(updatedData.name);
    });

    it('/:id should return 401 if the user is seller', async () => {
      const newSuppliers = generateNewSuppliers(10);
      const dataNewSuppliers = await repo.save(newSuppliers);
      const id = dataNewSuppliers[0].id;
      const updatedData: UpdateSupplierDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/supplier/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(updatedData);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return 401 if the user is customer', async () => {
      const newSuppliers = generateNewSuppliers(10);
      const dataNewSuppliers = await repo.save(newSuppliers);
      const id = dataNewSuppliers[0].id;
      const updatedData: UpdateSupplierDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/supplier/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send(updatedData);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return Conflict if supplier name is already taken', async () => {
      const newSuppliers = await repo.save(generateNewSuppliers(10));

      const supplier = newSuppliers[0];
      const id = newSuppliers[1].id;

      const updatedData: UpdateSupplierDto = {
        name: supplier.name,
      };
      try {
        await request(app.getHttpServer())
          .post(`/supplier/${id}`)
          .send(updatedData);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `The supplier NAME ${updatedData.name} is already in use`,
        );
      }
    });

    it('should return 404 if supplier does not exist', async () => {
      const id = 9999;
      const updatedData: UpdateSupplierDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/supplier/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(404);
      expect(message).toBe(`The Supplier with ID: ${id} not found`);
    });

    it('/:id should return 401 if api key is missing', async () => {
      const newSuppliers = generateNewSuppliers(10);
      const dataNewSuppliers = await repo.save(newSuppliers);
      const id = dataNewSuppliers[0].id;
      const updatedData: UpdateSupplierDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/supplier/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });

    it('/:id should return 401 if api key is invalid', async () => {
      const newSuppliers = generateNewSuppliers(10);
      const dataNewSuppliers = await repo.save(newSuppliers);
      const id = dataNewSuppliers[0].id;
      const updatedData: UpdateSupplierDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/supplier/${id}`)
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
