/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import config from '@config/index';

/* Modules */
import { AuthModule } from '@auth/auth.module';
import { CustomerModule } from '@customer/customer.module';
import { UserModule } from '@user/user.module';

/* Guards */
import { ApiKeyGuard } from '@commons/guards/api-key.guard';

/* Seed */
import { upSeed, downSeed } from './utils/seed';

/* DataSource */
import { dataSource } from './utils/seed';

/* User Seed */
import {
  seedNewAdminUser,
  adminPassword,
  seedNewSellerUser,
  sellerPassword,
} from './utils/user.seed';

/* Customer Seed */
import { seedNewCustomer, customerPasword } from './utils/customer.seed';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let repo: any = undefined;
  let repoCustomer: any = undefined;
  let userAdmin: any = undefined;
  let userSeller: any = undefined;
  let customer: any = undefined;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.e2e',
          load: [config],
        }),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            synchronize: true,
            ...dataSource.options,
          }),
        }),
        JwtModule.registerAsync({
          inject: [config.KEY],
          useFactory: (configService: ConfigType<typeof config>) => {
            return {
              secret: configService.jwtSecret,
              signOptions: {
                expiresIn: configService.jwtExpirationTime,
              },
            };
          },
        }),
        AuthModule,
        CustomerModule,
        UserModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ApiKeyGuard,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    repo = app.get('UserRepository');
    repoCustomer = app.get('CustomerRepository');
  });

  beforeEach(async () => {
    await upSeed();
    userAdmin = await seedNewAdminUser();
    userSeller = await seedNewSellerUser();
    customer = await seedNewCustomer();
    await repo.save(userAdmin);
    await repo.save(userSeller);
    await repoCustomer.save(customer);
  });

  const API_KEY = process.env.API_KEY || 'api-e2e-key';

  describe('POST /user/login  Auth Login Users', () => {
    it('should return an access token with Admin User', async () => {
      const user = {
        email: userAdmin.email,
        password: adminPassword,
      };

      const data: any = await request(app.getHttpServer())
        .post('/auth/user/login')
        .set('x-api-key', API_KEY)
        .send(user);
      const { body, statusCode } = data;
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('access_token');
      expect(body.access_token).toBeTruthy();
      expect(body.refresh_token).toBeTruthy();
    });

    it('should return and access token with Seller User', async () => {
      const user = {
        email: userSeller.email,
        password: sellerPassword,
      };

      const data: any = await request(app.getHttpServer())
        .post('/auth/user/login')
        .set('x-api-key', API_KEY)
        .send(user);
      const { body, statusCode } = data;
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('access_token');
      expect(body.access_token).toBeTruthy();
      expect(body.refresh_token).toBeTruthy();
    });

    it('should return 401 if user is not found', async () => {
      const user = {
        email: 'unknown@example.com',
        password: 'wrongpassword',
      };

      const data: any = await request(app.getHttpServer())
        .post('/auth/user/login')
        .set('x-api-key', API_KEY)
        .send(user);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Not Allow');
    });

    it('should return 401 if user password is incorrect', async () => {
      const user = {
        email: userAdmin.email,
        password: 'wrongpassword',
      };

      const data: any = await request(app.getHttpServer())
        .post('/auth/user/login')
        .set('x-api-key', API_KEY)
        .send(user);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Not Allow');
    });

    it('should return 401 if api key is missing', async () => {
      const user = {
        email: userAdmin.email,
        password: adminPassword,
      };

      const data: any = await request(app.getHttpServer())
        .post('/auth/user/login')
        .send(user);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('should return 401 if api key is invalid', async () => {
      const user = {
        email: userAdmin.email,
        password: adminPassword,
      };

      const data: any = await request(app.getHttpServer())
        .post('/auth/user/login')
        .set('x-api-key', 'invalid-api-key')
        .send(user);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('POST /customer/login  Auth Login Customers', () => {
    it('should return an access token', async () => {
      const loginCustomer = {
        email: customer.email,
        password: customerPasword,
      };
      const data: any = await request(app.getHttpServer())
        .post('/auth/customer/login')
        .set('x-api-key', API_KEY)
        .send(loginCustomer);
      const { body, statusCode } = data;
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('access_token');
      expect(body.access_token).toBeTruthy();
      expect(body.refresh_token).toBeTruthy();
    });

    it('should return 401 if customer is not found', async () => {
      const customer = {
        email: 'unknown@example.com',
        password: 'wrongpassword',
      };

      const data: any = await request(app.getHttpServer())
        .post('/auth/customer/login')
        .set('x-api-key', API_KEY)
        .send(customer);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Not Allow');
    });

    it('should return 401 if customer password is incorrect', async () => {
      const customerMock = {
        email: customer.email,
        password: 'wrongpassword',
      };

      const data: any = await request(app.getHttpServer())
        .post('/auth/customer/login')
        .set('x-api-key', API_KEY)
        .send(customerMock);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Not Allow');
    });

    it('should return 401 if api key is missing', async () => {
      const customerMock = {
        email: customer.email,
        password: customerPasword,
      };

      const data: any = await request(app.getHttpServer())
        .post('/auth/customer/login')
        .send(customerMock);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('should return 401 if api key is invalid', async () => {
      const customerMock = {
        email: customer.email,
        password: customerPasword,
      };

      const data: any = await request(app.getHttpServer())
        .post('/auth/customer/login')
        .set('x-api-key', 'invalid-api-key')
        .send(customerMock);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should return a new access token', async () => {
      const user = {
        email: userAdmin.email,
        password: adminPassword,
      };

      const loginResponse: any = await request(app.getHttpServer())
        .post('/auth/user/login')
        .set('x-api-key', API_KEY)
        .send(user);
      const { refresh_token } = loginResponse.body;

      const data: any = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('x-api-key', API_KEY)
        .send({ refresh: refresh_token });
      const { body, statusCode } = data;
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('access_token');
      expect(body.access_token).toBeTruthy();
    });

    it('should return 401 if refresh token is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('x-api-key', API_KEY)
        .send({ refresh: 'invalid_token' });
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .send({ refresh: 'some_refresh_token' });
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('x-api-key', 'invalid-api-key')
        .send({ refresh: 'some_refresh_token' });
      const { body, statusCode } = data;
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
