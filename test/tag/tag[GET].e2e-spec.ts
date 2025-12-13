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
import { TagModule } from '@tag/tag.module';
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
import { createTag, generateNewTags } from '@faker/tag.faker';

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

describe('TagController (e2e) [GET]', () => {
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
        TagModule,
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
    repo = app.get('TagRepository');
    repoUser = app.get('UserRepository');
    const tags = generateNewTags(10);
    await repo.save(tags);
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

  describe('GET Tag - Count-All', () => {
    it('/count-all should return 200 with admin access token', async () => {
      const tags = generateNewTags(10);
      await repo.save(tags);
      const res = await request(app.getHttpServer())
        .get('/tag/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(tags.length);
    });

    it('/count-all should return 200 with seller access token', async () => {
      const tags = generateNewTags(10);
      await repo.save(tags);
      const res = await request(app.getHttpServer())
        .get('/tag/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(tags.length);
    });

    it('/count-all should return 401 with customer access token', async () => {
      const res = await request(app.getHttpServer())
        .get('/tag/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/count-all should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get(
        '/tag/count-all',
      );
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count-all should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/tag/count-all')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('GET Tag - Count', () => {
    it('/count should return 200 with admin access token', async () => {
      const tags = generateNewTags(10);
      await repo.save(tags);
      const res = await request(app.getHttpServer())
        .get('/tag/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(tags.length);
    });

    it('/count should return 200 with seller access token', async () => {
      const tags = generateNewTags(10);
      await repo.save(tags);
      const res = await request(app.getHttpServer())
        .get('/tag/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(tags.length);
    });

    it('/count should return 401 with customer access token', async () => {
      const res = await request(app.getHttpServer())
        .get('/tag/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/count should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get('/tag/count');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/tag/count')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('GET Tag - / Find', () => {
    it('/ should return all tags without logged user', async () => {
      const tags = generateNewTags(10);
      await repo.save(tags);
      const res = await request(app.getHttpServer())
        .get('/tag')
        .set('x-api-key', API_KEY);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(tags.length);
      data.forEach((user) => {
        const tag = tags.find((su) => su.name === user.name);
        expect(user).toEqual(
          expect.objectContaining({
            name: tag?.name,
          }),
        );
      });
    });

    it('/ should return all tags with admin user', async () => {
      const tags = generateNewTags(10);
      await repo.save(tags);
      const res = await request(app.getHttpServer())
        .get('/tag')
        .set('x-api-key', API_KEY)
        .set('Authorization', adminAccessToken);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(tags.length);
      data.forEach((user) => {
        const tag = tags.find((su) => su.name === user.name);
        expect(user).toEqual(
          expect.objectContaining({
            name: tag?.name,
          }),
        );
      });
    });

    it('/ should return all tags with seller user', async () => {
      const tags = generateNewTags(10);
      await repo.save(tags);
      const res = await request(app.getHttpServer())
        .get('/tag')
        .set('x-api-key', API_KEY)
        .set('Authorization', sellerAccessToken);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(tags.length);
      data.forEach((user) => {
        const tag = tags.find((su) => su.name === user.name);
        expect(user).toEqual(
          expect.objectContaining({
            name: tag?.name,
          }),
        );
      });
    });

    it('/ should return all tags with customer user', async () => {
      const tags = generateNewTags(10);
      await repo.save(tags);
      const res = await request(app.getHttpServer())
        .get('/tag')
        .set('x-api-key', API_KEY)
        .set('Authorization', customerAccessToken);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(tags.length);
      data.forEach((user) => {
        const tag = tags.find((su) => su.name === user.name);
        expect(user).toEqual(
          expect.objectContaining({
            name: tag?.name,
          }),
        );
      });
    });

    it('/ should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get('/tag');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/tag')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('GET Tag - / FindOne', () => {
    it('/:id should return an tag by id with admin user', async () => {
      const tag = createTag();
      const dataNewTag = await repo.save(tag);
      const res = await request(app.getHttpServer())
        .get(`/tag/${dataNewTag.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewTag.id);
      expect(data.name).toEqual(dataNewTag.name);
    });

    it('/:id should return an tag by id with seller user', async () => {
      const tag = createTag();
      const dataNewTag = await repo.save(tag);
      const res = await request(app.getHttpServer())
        .get(`/tag/${dataNewTag.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewTag.id);
      expect(data.name).toEqual(dataNewTag.name);
    });

    it('/:id should return 401 by id with customer access token', async () => {
      const tag = createTag();
      const dataNewTag = await repo.save(tag);
      const res = await request(app.getHttpServer())
        .get(`/tag/${dataNewTag.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/name/:name should return 404 by id if tag does not exist', async () => {
      const tag = createTag();
      await repo.save(tag);
      const res = await request(app.getHttpServer())
        .get(`/tag/9999999`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(404);
      expect(error).toBe('Not Found');
      expect(message).toBe('The Tag with ID: 9999999 not found');
    });

    it('/name/:name should return an tag by name with admin user', async () => {
      const tag = createTag();
      const dataNewTag = await repo.save(tag);
      const res = await request(app.getHttpServer())
        .get(`/tag/name/${tag.name}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewTag.id);
      expect(data.name).toEqual(dataNewTag.name);
    });

    it('/name/:name should return an tag by name with seller user', async () => {
      const tag = createTag();
      const dataNewTag = await repo.save(tag);
      const res = await request(app.getHttpServer())
        .get(`/tag/name/${tag.name}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewTag.id);
      expect(data.name).toEqual(dataNewTag.name);
    });

    it('/name/:name should return 401 with customer user', async () => {
      const tag = createTag();
      await repo.save(tag);
      const res = await request(app.getHttpServer())
        .get(`/tag/name/${tag.name}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/name/:name should return 404 by name if tag does not exist', async () => {
      const tag = createTag();
      await repo.save(tag);
      const res = await request(app.getHttpServer())
        .get(`/tag/name/not-existing-name`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(404);
      expect(error).toBe('Not Found');
      expect(message).toBe('The Tag with NAME: not-existing-name not found');
    });
  });

  afterAll(async () => {
    await app.close();
    // Close database connection after all tests
    await closeDataSource();
  });
});
