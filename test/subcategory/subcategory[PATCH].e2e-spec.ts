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
import { SubcategoryModule } from '@subcategory/subcategory.module';
import { CategoryModule } from '@category/category.module';
import { UserModule } from '@user/user.module';

/* Entities */
import { Category } from '@category/entities/category.entity';
import { Subcategory } from '@subcategory/entities/subcategory.entity';

/* DTO's */
import { UpdateSubcategoryDto } from '@subcategory/dto/update-subcategory.dto';

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

  describe('PATCH Subcategory', () => {
    it('/:id should update a tag with admin user', async () => {
      const id = subcategories[0].id;
      const updatedData: UpdateSubcategoryDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`${path}/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.name).toBe(updatedData.name);
    });

    it('/:id should return 401 if the user is seller', async () => {
      const id = subcategories[0].id;
      const updatedData: UpdateSubcategoryDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`${path}/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(updatedData);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Admin access required');
    });

    it('/:id should return 401 if the user is customer', async () => {
      const id = subcategories[0].id;
      const updatedData: UpdateSubcategoryDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`${path}/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send(updatedData);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Admin access required');
    });

    it('/:id should return 401 if the user is not logged', async () => {
      const id = subcategories[0].id;
      const updatedData: UpdateSubcategoryDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`${path}/${id}`)
        .set('x-api-key', API_KEY)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Unauthorized');
    });

    it('/:id should return 401 if api key is missing', async () => {
      const id = subcategories[0].id;
      const updatedData: UpdateSubcategoryDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`${path}/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });

    it('/:id should return 401 if api key is invalid', async () => {
      const id = subcategories[0].id;
      const updatedData: UpdateSubcategoryDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`${path}/${id}`)
        .set('x-api-key', 'invalid-api-key')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });

    it('should return 404 if tag does not exist', async () => {
      const id = 9999;
      const updatedData: UpdateSubcategoryDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`${path}/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(404);
      expect(message).toBe(`The Subcategory with ID: ${id} not found`);
    });

    it('/:id should return Conflict if subcategory name is already taken with the same category', async () => {
      const existingSubcategory = subcategories[0];

      const id = subcategories[1].id;
      const repeatedNameSubcategory = {
        ...subcategories[1],
        name: existingSubcategory.name,
        categoryId: category.id,
      };
      try {
        await request(app.getHttpServer())
          .post(`${path}/${id}`)
          .send(repeatedNameSubcategory);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `The tag NAME ${repeatedNameSubcategory.name} is already in use`,
        );
      }
    });
  });

  afterAll(async () => {
    await app.close();
    // Close database connection after all tests
    await closeDataSource();
  });
});
