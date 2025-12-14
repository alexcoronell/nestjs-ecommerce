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
import { SubcategoryModule } from '@subcategory/subcategory.module';
import { CategoryModule } from '@category/category.module';
import { UserModule } from '@user/user.module';

/* Entities */
import { Category } from '@category/entities/category.entity';
import { Subcategory } from '@subcategory/entities/subcategory.entity';

/* Interceptors */
import { AuditInterceptor } from '@commons/interceptors/audit.interceptor';

/* Seed */
import { initDataSource, cleanDB, closeDataSource } from '../utils/seed';

/* DataSource */
import { dataSource } from '../utils/seed';

/* Faker */
import { generateNewSubcategories } from '@faker/subcategory.faker';
import { generateCategory } from '@faker/category.faker';

/* Login Users */
import { loginAdmin } from '../utils/login-admin';
import { loginSeller } from '../utils/login-seller';
import { loginCustomer } from '../utils/login-customer';

/* ApiKey */
const API_KEY = process.env.API_KEY || 'api-e2e-key';

describe('SubcategoryController (e2e) [GET]', () => {
  let app: INestApplication<App>;
  let repo: any = undefined;
  let repoCategory: any = undefined;
  let repoUser: any = undefined;
  let adminAccessToken: string;
  let sellerAccessToken: string;
  let customerAccessToken: string;
  let category: Category;
  let subcategories: Subcategory[] = [];
  const path = '/subcategory';

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
        SubcategoryModule,
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
    repo = app.get('SubcategoryRepository');
    repoCategory = app.get('CategoryRepository');
    repoUser = app.get('UserRepository');
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

    /* Create category and 5 subcategories for testing */
    const newCategory = generateCategory();
    category = await repoCategory.save(newCategory);
    const newSubcategories = generateNewSubcategories(5, category.id);
    subcategories = await repo.save(newSubcategories);
  });

  describe('GET Subcategory - Count-All', () => {
    it('/count-all should return 200 with admin access token', async () => {
      const res = await request(app.getHttpServer())
        .get(`${path}/count-all`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(subcategories.length);
    });

    it('/count-all should return 200 with seller access token', async () => {
      const res = await request(app.getHttpServer())
        .get(`${path}/count-all`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(subcategories.length);
    });

    it('/count-all should return 401 with customer access token', async () => {
      const res = await request(app.getHttpServer())
        .get(`${path}/count-all`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/count-all should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get(
        `${path}/count-all`,
      );
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count-all should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get(`${path}/count-all`)
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('GET Subcategory - Count', () => {
    it('/count should return 200 with admin access token', async () => {
      const res = await request(app.getHttpServer())
        .get(`${path}/count`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(subcategories.length);
    });

    it('/count should return 200 with seller access token', async () => {
      const res = await request(app.getHttpServer())
        .get(`${path}/count`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(subcategories.length);
    });

    it('/count should return 401 with customer access token', async () => {
      const res = await request(app.getHttpServer())
        .get(`${path}/count`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized: Customer access denied');
    });

    it('/count should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get(`${path}/count`);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get(`${path}/count`)
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('GET Subcategory - / Find', () => {
    it('/ should return all subcategories with admin user', async () => {
      const res = await request(app.getHttpServer())
        .get(`${path}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(subcategories.length);
      data.forEach((user) => {
        const subcategory = subcategories.find((su) => su.name === user.name);
        expect(user).toEqual(
          expect.objectContaining({
            name: subcategory?.name,
          }),
        );
      });
    });

    it('/ should return 401 with seller user', async () => {
      const res = await request(app.getHttpServer())
        .get(`${path}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized: Admin access required');
    });

    it('/ should return 401 with customer user', async () => {
      const res = await request(app.getHttpServer())
        .get(`${path}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized: Admin access required');
    });

    it('/ should return 401 without logged user', async () => {
      const res = await request(app.getHttpServer())
        .get(`${path}`)
        .set('x-api-key', API_KEY);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized');
    });

    it('/ should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get(`${path}`);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get(`${path}`)
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('GET Subcategory - / Find ByCategory', () => {
    it('/category/:category should return the subcategories by category with admin user', async () => {
      const categoryId = category.id;
      const dataByCategory = await repo.find({
        where: { category: { id: categoryId }, isDeleted: false },
      });
      const res = await request(app.getHttpServer())
        .get(`${path}/category/${categoryId}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(dataByCategory.length);
      data.forEach((data) => {
        const subcategory = subcategories.find((su) => su.name === data.name);
        expect(data).toEqual(
          expect.objectContaining({
            name: subcategory?.name,
          }),
        );
      });
    });

    it('/category/:category should return the subcategories by category with seller user', async () => {
      const categoryId = category.id;
      const dataByCategory = await repo.find({
        where: { category: { id: categoryId }, isDeleted: false },
      });
      const res = await request(app.getHttpServer())
        .get(`${path}/category/${categoryId}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(dataByCategory.length);
      data.forEach((data) => {
        const subcategory = subcategories.find((su) => su.name === data.name);
        expect(data).toEqual(
          expect.objectContaining({
            name: subcategory?.name,
          }),
        );
      });
    });

    it('/category/:category should return the subcategories by category with customer user', async () => {
      const categoryId = category.id;
      const dataByCategory = await repo.find({
        where: { category: { id: categoryId }, isDeleted: false },
      });
      const res = await request(app.getHttpServer())
        .get(`${path}/category/${categoryId}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(dataByCategory.length);
      data.forEach((data) => {
        const subcategory = subcategories.find((su) => su.name === data.name);
        expect(data).toEqual(
          expect.objectContaining({
            name: subcategory?.name,
          }),
        );
      });
    });

    it('/category/:category should return the subcategories by category without user', async () => {
      const categoryId = category.id;
      const dataByCategory = await repo.find({
        where: { category: { id: categoryId }, isDeleted: false },
      });
      const res = await request(app.getHttpServer())
        .get(`${path}/category/${categoryId}`)
        .set('x-api-key', API_KEY);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(dataByCategory.length);
      data.forEach((data) => {
        const subcategory = subcategories.find((su) => su.name === data.name);
        expect(data).toEqual(
          expect.objectContaining({
            name: subcategory?.name,
          }),
        );
      });
    });

    it('/ should return 401 if api key is missing', async () => {
      const categoryId = category.id;
      const data: any = await request(app.getHttpServer()).get(
        `${path}/category/${categoryId}`,
      );
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      const categoryId = category.id;
      const data: any = await request(app.getHttpServer())
        .get(`${path}/category/${categoryId}`)
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/:id should return 404 by id if subcategory does not exist with admin user', async () => {
      const id = 9999;
      const res = await request(app.getHttpServer())
        .get(`${path}/category/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toBe(0);
    });
  });

  describe('GET Subcategory - / FindOne', () => {
    it('/:id should return an subcategory by id with admin user', async () => {
      const subcategory = subcategories[0];
      const res = await request(app.getHttpServer())
        .get(`${path}/${subcategory.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(subcategory.id);
      expect(data.name).toEqual(subcategory.name);
    });

    it('/:id should return 401 by id with seller user', async () => {
      const subcategory = subcategories[0];
      const res = await request(app.getHttpServer())
        .get(`${path}/${subcategory.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Admin access required');
    });

    it('/:id should return 401 by id with customer access token', async () => {
      const subcategory = subcategories[0];
      const res = await request(app.getHttpServer())
        .get(`${path}/${subcategory.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Admin access required');
    });

    it('/ should return 401 if api key is missing', async () => {
      const subcategory = subcategories[0];
      const data: any = await request(app.getHttpServer()).get(
        `${path}/${subcategory.id}`,
      );
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      const subcategory = subcategories[0];
      const data: any = await request(app.getHttpServer())
        .get(`${path}/${subcategory.id}`)
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/:id should return 404 by id if subcategory does not exist with admin user', async () => {
      const id = 9999;
      const res = await request(app.getHttpServer())
        .get(`${path}/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(404);
      expect(error).toBe('Not Found');
      expect(message).toBe(`The Subcategory with ID: ${id} not found`);
    });
  });

  describe('GET Subcategory - / FindOneByName', () => {
    it('/name/:name should return an tag by id with admin user', async () => {
      const category = subcategories[0];
      const name = subcategories[0].name;
      const res = await request(app.getHttpServer())
        .get(`${path}/name/${name}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(category.id);
      expect(data.name).toEqual(category.name);
      expect(data.isDeleted).toBeFalsy();
    });

    it('/name/:name should return 401 by id with seller user', async () => {
      const name = subcategories[0].name;
      const res = await request(app.getHttpServer())
        .get(`${path}/name/${name}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Admin access required');
    });

    it('/name/:name should return 401 by id with customer access token', async () => {
      const name = subcategories[0].name;
      const res = await request(app.getHttpServer())
        .get(`${path}/name/${name}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Admin access required');
    });

    it('/ should return 401 if api key is missing', async () => {
      const name = subcategories[0].name;
      const data: any = await request(app.getHttpServer()).get(
        `${path}/name/${name}`,
      );
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      const name = subcategories[0].name;
      const data: any = await request(app.getHttpServer())
        .get(`${path}/name/${name}`)
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/name/:name should return 404 by id if subcategory does not exist with admin user', async () => {
      const name = 'non-existing-name';
      const res = await request(app.getHttpServer())
        .get(`${path}/name/${name}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(404);
      expect(error).toBe('Not Found');
      expect(message).toBe(`The Subcategory with NAME: ${name} not found`);
    });
  });

  afterAll(async () => {
    await app.close();
    // Close database connection after all tests
    await closeDataSource();
  });
});
