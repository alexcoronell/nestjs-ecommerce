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
import { AppModule } from '../../src/app.module';
import { UserModule } from '@user/user.module';

/* Interceptors */
import { AuditInterceptor } from '@commons/interceptors/audit.interceptor';

/* Entities */
import { User } from '@user/entities/user.entity';

/* Seed */
import { upSeed, downSeed } from '../utils/seed';

/* DataSource */
import { dataSource } from '../utils/seed';

/* Faker */
import { createUser } from '@faker/user.faker';

/* User Seed */
import {
  seedNewUser,
  seedUsers,
  seedNewAdminUser,
  adminPassword,
  seedNewSellerUser,
  sellerPassword,
  seedNewCustomerUser,
  customerPassword,
} from '../utils/user.seed';

const API_KEY = process.env.API_KEY || 'api-e2e-key';

describe('UserControler (e2e) [POST]', () => {
  let app: INestApplication<App>;
  let repo: any = undefined;
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
    await upSeed();
    adminUser = await repo.save(await seedNewAdminUser());
    sellerUser = await repo.save(await seedNewSellerUser());
    customerUser = await repo.save(await seedNewCustomerUser());

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
    const { access_token: tempCustomerAccessToken } = loginCustomer.body;
    customerAccessToken = tempCustomerAccessToken;
  });

  describe('POST User', () => {
    it('/ should return 201 and created user', async () => {
      const newUser = createUser();
      const seedNewUser = {
        ...newUser,
        password: await bcrypt.hash(newUser.password, 10),
      };
      const res = await request(app.getHttpServer())
        .post('/user')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(seedNewUser);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(201);
      expect(data.firstname).toEqual(seedNewUser.firstname);
      expect(data.createdBy.id).toEqual(adminUser?.id);
    });

    it('/ should  return conflict exception with existing email', async () => {
      await repo.save(seedUsers);
      const user = seedUsers[0];
      const newUser = {
        ...seedNewUser,
        email: user.email,
      };
      try {
        await request(app.getHttpServer())
          .post('/user')
          .set('x-api-key', API_KEY)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(newUser);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(`The Email ${user.email} is already in use`);
      }
    });

    it('/ should return 401 if api key is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .send(seedNewUser);
      const { body, statusCode } = res;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = res;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 and error message with no admin user', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(seedNewUser);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/ should return 401 with customer user', async () => {
      const newUser = createUser();
      const seedNewUser = {
        ...newUser,
        password: await bcrypt.hash(newUser.password, 10),
      };
      const res = await request(app.getHttpServer())
        .post('/user')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send(seedNewUser);
      const { statusCode, message, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Admin access required');
    });
  });

  describe('POST Register User', () => {
    it('/register should return 201 and created user with register', async () => {
      const newUser = createUser();
      const res = await request(app.getHttpServer())
        .post('/user/register')
        .set('x-api-key', API_KEY)
        .send(newUser);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(201);
      expect(data.firstname).toEqual(newUser.firstname);
    });

    it('/register should  return conflict exception with existing email', async () => {
      await repo.save(seedUsers);
      const user = seedUsers[0];
      const newUser = {
        ...seedNewUser,
        email: user.email,
      };
      try {
        await request(app.getHttpServer()).post('/user/register').send(newUser);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(`The Email ${user.email} is already in use`);
      }
    });

    it('/register should return 401 if api key is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/user/register')
        .send(seedNewUser);
      const { body, statusCode } = res;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/register should return 401 if api key is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/user/register')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = res;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
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
