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
import { UserModule } from '@user/user.module';

/* Interceptors */
import { AuditInterceptor } from '@commons/interceptors/audit.interceptor';

/* Seed */
import { initDataSource, cleanDB, closeDataSource } from '../utils/seed';

/* DataSource */
import { dataSource } from '../utils/seed';

/* User Seed */
import { seedUsers } from '../utils/user.seed';

/* Login Users */
import { loginAdmin } from '../utils/login-admin';
import { loginSeller } from '../utils/login-seller';
import { loginCustomer } from '../utils/login-customer';

const API_KEY = process.env.API_KEY || 'api-e2e-key';

describe('UserControler (e2e) [DELETE]', () => {
  let app: INestApplication<App>;
  let repo: any = undefined;
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
    repo = app.get('UserRepository');
  });

  beforeEach(async () => {
    // Clean all data before each test to ensure isolation
    await cleanDB();

    /* Login Users */
    const resLoginAdmin = await loginAdmin(app, repo);
    adminAccessToken = resLoginAdmin.access_token;

    const resLoginSeller = await loginSeller(app, repo);
    sellerAccessToken = resLoginSeller.access_token;

    const resLoginCustomer = await loginCustomer(app, repo);
    customerAccessToken = resLoginCustomer.access_token;
  });

  describe('DELETE User', () => {
    it('/:id should return 204 and message', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const res = await request(app.getHttpServer())
        .delete(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, message } = res.body;
      const deletedInDB = await repo.findOne({
        relations: ['createdBy', 'updatedBy', 'deletedBy'],
        where: { id, isDeleted: false },
      });
      const deletedInDBWithDeleted = await repo.findOne({
        relations: ['createdBy', 'updatedBy', 'deletedBy'],
        where: { id, isDeleted: true },
      });
      expect(deletedInDBWithDeleted).not.toBeNull();
      expect(deletedInDBWithDeleted.isDeleted).toBe(true);
      expect(deletedInDBWithDeleted.deletedBy.id).toBe(1);
      expect(statusCode).toBe(200);
      expect(deletedInDB).toBeNull();
      expect(message).toBe(`The User with id: ${id} has been deleted`);
    });

    it('/ should return 401 if api key is missing', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const res = await request(app.getHttpServer()).delete(`/user/${id}`);
      const { body, statusCode } = res;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const res = await request(app.getHttpServer())
        .delete(`/user/${id}`)
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = res;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/:id should return 401 and error message when user is not admin user', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const res = await request(app.getHttpServer())
        .delete(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe(`Unauthorized`);
    });

    it('/:id should return 401 and error message when is a customer user', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const res = await request(app.getHttpServer())
        .delete(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe(
        'Unauthorized: Admin or resource owner access required',
      );
    });
  });

  afterAll(async () => {
    await app.close();
    // Close database connection after all tests
    await closeDataSource();
  });
});
