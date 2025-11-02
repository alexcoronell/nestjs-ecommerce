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
import { CategoryModule } from '@category/category.module';
import { UserModule } from '@user/user.module';

/* Interfaces */
import { User } from '@user/entities/user.entity';

/* Interceptors */
import { AuditInterceptor } from '@commons/interceptors/audit.interceptor';

/* Seed */
import { upSeed, downSeed } from '../utils/seed';

/* DataSource */
import { dataSource } from '../utils/seed';

/* Faker */
import { createCategory, generateNewCategories } from '@faker/category.faker';

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

describe('CategoryController (e2e) [GET]', () => {
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
        CategoryModule,
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
    repo = app.get('CategoryRepository');
    repoUser = app.get('UserRepository');
    const categories = generateNewCategories(10);
    await repo.save(categories);
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

  describe('GET Category - Count-All', () => {
    it('/count-all should return 200 with admin access token', async () => {
      const categories = generateNewCategories(10);
      await repo.save(categories);
      const res = await request(app.getHttpServer())
        .get('/category/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(categories.length);
    });

    it('/count-all should return 200 with seller access token', async () => {
      const categories = generateNewCategories(10);
      await repo.save(categories);
      const res = await request(app.getHttpServer())
        .get('/category/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(categories.length);
    });

    it('/count-all should return 401 with customer access token', async () => {
      const res = await request(app.getHttpServer())
        .get('/category/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/count-all should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get(
        '/category/count-all',
      );
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count-all should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/category/count-all')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('GET Category - Count', () => {
    it('/count should return 200 with admin access token', async () => {
      const categories = generateNewCategories(10);
      await repo.save(categories);
      const res = await request(app.getHttpServer())
        .get('/category/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(categories.length);
    });

    it('/count should return 200 with seller access token', async () => {
      const categories = generateNewCategories(10);
      await repo.save(categories);
      const res = await request(app.getHttpServer())
        .get('/category/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(categories.length);
    });

    it('/count should return 401 with customer access token', async () => {
      const res = await request(app.getHttpServer())
        .get('/category/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/count should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get(
        '/category/count',
      );
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/category/count')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('GET Category - / Find', () => {
    it('/ should return all categories without logged user', async () => {
      const categories = generateNewCategories(10);
      await repo.save(categories);
      const res = await request(app.getHttpServer())
        .get('/category')
        .set('x-api-key', API_KEY);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(categories.length);
      data.forEach((user) => {
        const category = categories.find((su) => su.name === user.name);
        expect(user).toEqual(
          expect.objectContaining({
            name: category?.name,
          }),
        );
      });
    });

    it('/ should return all categories with admin user', async () => {
      const categories = generateNewCategories(10);
      await repo.save(categories);
      const res = await request(app.getHttpServer())
        .get('/category')
        .set('x-api-key', API_KEY)
        .set('Authorization', adminAccessToken);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(categories.length);
      data.forEach((user) => {
        const category = categories.find((su) => su.name === user.name);
        expect(user).toEqual(
          expect.objectContaining({
            name: category?.name,
          }),
        );
      });
    });

    it('/ should return all categories with seller user', async () => {
      const categories = generateNewCategories(10);
      await repo.save(categories);
      const res = await request(app.getHttpServer())
        .get('/category')
        .set('x-api-key', API_KEY)
        .set('Authorization', sellerAccessToken);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(categories.length);
      data.forEach((user) => {
        const category = categories.find((su) => su.name === user.name);
        expect(user).toEqual(
          expect.objectContaining({
            name: category?.name,
          }),
        );
      });
    });

    it('/ should return all categories with customer user', async () => {
      const categories = generateNewCategories(10);
      await repo.save(categories);
      const res = await request(app.getHttpServer())
        .get('/category')
        .set('x-api-key', API_KEY)
        .set('Authorization', customerAccessToken);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(categories.length);
      data.forEach((user) => {
        const category = categories.find((su) => su.name === user.name);
        expect(user).toEqual(
          expect.objectContaining({
            name: category?.name,
          }),
        );
      });
    });

    it('/ should return all categories without logged user', async () => {
      const categories = generateNewCategories(10);
      await repo.save(categories);
      const res = await request(app.getHttpServer())
        .get('/category')
        .set('x-api-key', API_KEY);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(categories.length);
      data.forEach((user) => {
        const category = categories.find((su) => su.name === user.name);
        expect(user).toEqual(
          expect.objectContaining({
            name: category?.name,
          }),
        );
      });
    });

    it('/ should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get('/category');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/category')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('GET Category - / FindOne', () => {
    it('/:id should return one category by id with admin user', async () => {
      const category = createCategory();
      const dataNewCategory = await repo.save(category);
      const res = await request(app.getHttpServer())
        .get(`/category/${dataNewCategory.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewCategory.id);
      expect(data.name).toEqual(dataNewCategory.name);
    });

    it('/:id should return one category by id with seller user', async () => {
      const category = createCategory();
      const dataNewCategory = await repo.save(category);
      const res = await request(app.getHttpServer())
        .get(`/category/${dataNewCategory.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewCategory.id);
      expect(data.name).toEqual(dataNewCategory.name);
    });

    it('/:id should return 401 by id with customer access token', async () => {
      const category = createCategory();
      const dataNewCategory = await repo.save(category);
      const res = await request(app.getHttpServer())
        .get(`/category/${dataNewCategory.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/name/:name should return 404 by id if category does not exist', async () => {
      const category = createCategory();
      await repo.save(category);
      const res = await request(app.getHttpServer())
        .get(`/category/9999999`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(404);
      expect(error).toBe('Not Found');
      expect(message).toBe('The Category with ID: 9999999 not found');
    });

    it('/name/:name should return an category by name with admin user', async () => {
      const category = createCategory();
      const dataNewCategory = await repo.save(category);
      const res = await request(app.getHttpServer())
        .get(`/category/name/${category.name}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewCategory.id);
      expect(data.name).toEqual(dataNewCategory.name);
    });

    it('/name/:name should return an category by name with seller user', async () => {
      const category = createCategory();
      const dataNewCategory = await repo.save(category);
      const res = await request(app.getHttpServer())
        .get(`/category/name/${category.name}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewCategory.id);
      expect(data.name).toEqual(dataNewCategory.name);
    });

    it('/name/:name should return 401 with customer user', async () => {
      const category = createCategory();
      await repo.save(category);
      const res = await request(app.getHttpServer())
        .get(`/category/name/${category.name}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/name/:name should return 404 by name if category does not exist', async () => {
      const category = createCategory();
      await repo.save(category);
      const res = await request(app.getHttpServer())
        .get(`/category/name/not-existing-name`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(404);
      expect(error).toBe('Not Found');
      expect(message).toBe(
        'The Category with NAME: not-existing-name not found',
      );
    });

    it('/slug/:slug should return an category by slug with admin user', async () => {
      const category = createCategory();
      const dataNewCategory = await repo.save(category);
      const res = await request(app.getHttpServer())
        .get(`/category/slug/${category.slug}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewCategory.id);
      expect(data.name).toEqual(dataNewCategory.name);
    });

    it('/slug/:slug should return an category by slug with seller user', async () => {
      const category = createCategory();
      const dataNewCategory = await repo.save(category);
      const res = await request(app.getHttpServer())
        .get(`/category/slug/${category.slug}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewCategory.id);
      expect(data.slug).toEqual(dataNewCategory.slug);
    });

    it('/slug/:slug should return 401 with customer user', async () => {
      const category = createCategory();
      await repo.save(category);
      const res = await request(app.getHttpServer())
        .get(`/category/slug/${category.slug}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/slug/:slug should return 404 by slug if category does not exist', async () => {
      const category = createCategory();
      await repo.save(category);
      const res = await request(app.getHttpServer())
        .get(`/category/slug/not-existing-slug`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(404);
      expect(error).toBe('Not Found');
      expect(message).toBe(
        'The Category with SLUG: not-existing-slug not found',
      );
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
