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

/* Interfaces */
import { User } from '@user/entities/user.entity';

/* Interceptors */
import { AuditInterceptor } from '@commons/interceptors/audit.interceptor';

/* DTO's */
import { UpdateSupplierDto } from '@supplier/dto/update-supplier.dto';

/* Seed */
import { upSeed, downSeed } from '../utils/seed';

/* DataSource */
import { dataSource } from '../utils/seed';

/* Faker */
import { generateNewSuppliers } from '@faker/supplier.faker';

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

describe('supplierController (e2e) [GET]', () => {
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
    await upSeed();
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

  afterEach(async () => {
    await downSeed();
  });

  afterAll(async () => {
    await app.close();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });
});
