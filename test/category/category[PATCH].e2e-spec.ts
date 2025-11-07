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

/* DTO's */
import { UpdateCategoryDto } from '@category/dto/update-category.dto';

/* Faker */
import { generateNewCategories } from '@faker/category.faker';

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

describe('CategoryController (e2e) [PATCH]', () => {
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

  describe('PATCH Category', () => {
    it('/:id should update a category with admin user', async () => {
      const newCategories = generateNewCategories(10);
      const dataNewCategories = await repo.save(newCategories);
      const id = dataNewCategories[0].id;
      const updatedData: UpdateCategoryDto = {
        name: 'Updated name',
        slug: 'updated-name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/category/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.name).toBe(updatedData.name);
    });

    it('/:id should return 401 if the user is seller', async () => {
      const newCategories = generateNewCategories(10);
      const dataNewCategories = await repo.save(newCategories);
      const id = dataNewCategories[0].id;
      const updatedData: UpdateCategoryDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/category/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(updatedData);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return 401 if the user is customer', async () => {
      const newCategories = generateNewCategories(10);
      const dataNewCategories = await repo.save(newCategories);
      const id = dataNewCategories[0].id;
      const updatedData: UpdateCategoryDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/category/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send(updatedData);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return Conflict if category name is already taken', async () => {
      const newCategories = await repo.save(generateNewCategories(10));

      const category = newCategories[0];
      const id = newCategories[1].id;

      const updatedData: UpdateCategoryDto = {
        name: category.name,
      };
      try {
        await request(app.getHttpServer())
          .post(`/category/${id}`)
          .send(updatedData);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `The Category NAME ${updatedData.name} is already in use`,
        );
      }
    });

    it('/:id should return Conflict if category slug is already taken', async () => {
      const newCategories = await repo.save(generateNewCategories(10));

      const category = newCategories[0];
      const id = newCategories[1].id;

      const updatedData: UpdateCategoryDto = {
        slug: category.slug,
      };
      try {
        await request(app.getHttpServer())
          .post(`/category/${id}`)
          .send(updatedData);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `The Category SLUG ${updatedData.slug} is already in use`,
        );
      }
    });

    it('should return 404 if category does not exist', async () => {
      const id = 9999;
      const updatedData: UpdateCategoryDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/category/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(404);
      expect(message).toBe(`The Category with ID: ${id} not found`);
    });

    it('/:id should return 401 if api key is missing', async () => {
      const newCategories = generateNewCategories(10);
      const dataNewCategories = await repo.save(newCategories);
      const id = dataNewCategories[0].id;
      const updatedData: UpdateCategoryDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/category/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });

    it('/:id should return 401 if api key is invalid', async () => {
      const newCategories = generateNewCategories(10);
      const dataNewCategories = await repo.save(newCategories);
      const id = dataNewCategories[0].id;
      const updatedData: UpdateCategoryDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/category/${id}`)
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
