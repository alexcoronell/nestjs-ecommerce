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
import { UserModule } from '@user/user.module';

/* Interceptors */
import { AuditInterceptor } from '@commons/interceptors/audit.interceptor';

/* Entities */
import { User } from '@user/entities/user.entity';

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

/* Customer Seed */
import { UpdateUserDto } from '@user/dto/update-user.dto';

const API_KEY = process.env.API_KEY || 'api-e2e-key';

describe('UserControler (e2e) [PATCH]', () => {
  let app: INestApplication<App>;
  let repo: any = undefined;
  let sellerUser: User | null = null;
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
    sellerUser = resLoginSeller.sellerUser;
    sellerAccessToken = resLoginSeller.access_token;

    const resLoginCustomer = await loginCustomer(app, repo);
    customerAccessToken = resLoginCustomer.access_token;
  });

  describe('PATCH User', () => {
    it('/:id should 200 and the updated a user', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const updatedData: UpdateUserDto = {
        firstname: 'Updated name',
        lastname: 'Updated lastname',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.firstname).toBe(updatedData.firstname);
      expect(data.lastname).toBe(updatedData.lastname);
    });

    it('/:id should return 200 and the updated a user with the same user', async () => {
      const id = sellerUser?.id;
      const updatedData: UpdateUserDto = {
        firstname: 'Updated name',
        lastname: 'Updated lastname',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(updatedData);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.firstname).toBe(updatedData.firstname);
      expect(data.lastname).toBe(updatedData.lastname);
      expect(data.updatedBy.id).toEqual(sellerUser?.id);
    });

    it('/:id should return conflict exception with existing email', async () => {
      await repo.save(seedUsers);

      const user = seedUsers[0];
      const id = seedUsers[1].id;
      const updatedData: UpdateUserDto = {
        email: user.email,
      };
      try {
        await request(app.getHttpServer())
          .patch(`/user/${id}`)
          .send(updatedData);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `The User with EMAIL: ${user.email} is already in use`,
        );
      }
    });

    it('/:id should return 401 if api key is missing', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const updatedData: UpdateUserDto = {
        firstname: 'Updated name',
        lastname: 'Updated lastname',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/${id}`)
        .send(updatedData);
      const { body, statusCode } = res;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const updatedData: UpdateUserDto = {
        firstname: 'Updated name',
        lastname: 'Updated lastname',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/${id}`)
        .set('x-api-key', 'invalid-api-key')
        .send(updatedData);
      const { body, statusCode } = res;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/:id should 401 and error message with no admin user', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const updatedData: UpdateUserDto = {
        firstname: 'Updated name',
        lastname: 'Updated lastname',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(updatedData);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return 200 and message when the password is updated by admin user', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const updatedData = {
        password: 'newPassword',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/password/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(200);
      expect(message).toBe('Password updated successfully');
    });

    it('/:id should return 200 and message when the password is updated by admin user', async () => {
      const id = sellerUser?.id;
      const updatedData = {
        password: 'newPassword',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/password/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(200);
      expect(message).toBe('Password updated successfully');
    });

    it('/:id should 401 and error message with customer user no owner', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const updatedData: UpdateUserDto = {
        firstname: 'Updated name',
        lastname: 'Updated lastname',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send(updatedData);
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
