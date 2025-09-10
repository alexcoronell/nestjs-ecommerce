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
import { AppModule } from '../src/app.module';
import { BrandModule } from '@brand/brand.module';
import { UserModule } from '@user/user.module';

import { User } from '@user/entities/user.entity';

/* Interceptors */
import { AuditInterceptor } from '@commons/interceptors/audit.interceptor';

/* Seed */
import { upSeed, downSeed } from './utils/seed';

/* DataSource */
import { dataSource } from './utils/seed';

/* DTO's */
import { UpdateBrandDto } from '@brand/dto/update-brand.dto';

/* Faker */
import { createBrand, generateNewBrands } from '@faker/brand.faker';

/* Users for Login */
import {
  seedNewAdminUser,
  adminPassword,
  seedNewSellerUser,
  sellerPassword,
} from './utils/user.seed';

/* ApiKey */
const API_KEY = process.env.API_KEY || 'api-e2e-key';

describe('BrandController (e2e)', () => {
  let app: INestApplication<App>;
  let repo: any = undefined;
  let repoUser: any = undefined;
  let adminUser: User | null = null;
  let sellerUser: User | null = null;
  let adminAccessToken: string;
  let sellerAccessToken: string;

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
        BrandModule,
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
    repo = app.get('BrandRepository');
    repoUser = app.get('UserRepository');
  });

  beforeEach(async () => {
    await upSeed();
    adminUser = await repoUser.save(await seedNewAdminUser());
    sellerUser = await repoUser.save(await seedNewSellerUser());
    const loginAdmin = await request(app.getHttpServer())
      .post('/auth/login')
      .set('x-api-key', API_KEY)
      .send({
        email: adminUser?.email,
        password: adminPassword,
      });
    const { access_token: tempAdminAccessToken } = loginAdmin.body;
    const loginSeller = await request(app.getHttpServer())
      .post('/auth/login')
      .set('x-api-key', API_KEY)
      .send({
        email: sellerUser?.email,
        password: sellerPassword,
      });
    const { access_token: tempSellerAccessToken } = loginSeller.body;
    adminAccessToken = tempAdminAccessToken;
    sellerAccessToken = tempSellerAccessToken;
  });

  describe('GET Brand - Count', () => {
    it('/count-all should return 200 with seller access token', async () => {
      const brands = generateNewBrands(10);
      await repo.save(brands);
      const res = await request(app.getHttpServer())
        .get('/brand/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(brands.length);
    });

    it('/count-all should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get(
        '/brand/count-all',
      );
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count-all should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/brand/count-all')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count', async () => {
      const brands = generateNewBrands(10);
      await repo.save(brands);
      const res = await request(app.getHttpServer())
        .get('/brand/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, total } = res.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(brands.length);
    });

    it('/count should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get('/brand/count');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/brand/count')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('GET Brand - Find', () => {
    it('/ should return all brands', async () => {
      const brands = generateNewBrands(10);
      await repo.save(brands);
      const res = await request(app.getHttpServer())
        .get('/brand')
        .set('x-api-key', API_KEY);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(brands.length);
      data.forEach((user) => {
        const brand = brands.find((su) => su.name === user.name);
        expect(user).toEqual(
          expect.objectContaining({
            name: brand?.name,
          }),
        );
      });
    });

    it('/ should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get('/brand');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/brand')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/:id should return an brand by id', async () => {
      const brand = createBrand();
      const dataNewBrand = await repo.save(brand);
      const res = await request(app.getHttpServer())
        .get(`/brand/${dataNewBrand.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewBrand.id);
      expect(data.name).toEqual(dataNewBrand.name);
    });

    it('/name/:name should return an brand by name', async () => {
      const brand = createBrand();
      const dataNewBrand = await repo.save(brand);
      const res = await request(app.getHttpServer())
        .get(`/brand/name/${brand.name}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(dataNewBrand.id);
      expect(data.name).toEqual(dataNewBrand.name);
    });

    it('should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get('/brand/count');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/brand/count')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('should return 404 if brand does not exist', async () => {
      const id = 9999;
      const res = await request(app.getHttpServer())
        .get(`/brand/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(404);
      expect(message).toBe(`The Brand with id: ${id} not found`);
    });
  });

  describe('POST Brand', () => {
    it('/ should create a brand, return 201 and the brand', async () => {
      const newBrand = createBrand();
      const res = await request(app.getHttpServer())
        .post('/brand')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newBrand);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(201);
      expect(data.name).toEqual(newBrand.name);
    });

    it('/ should create a brand, return 401 if user is not admin', async () => {
      const newBrand = createBrand();
      const res = await request(app.getHttpServer())
        .post('/brand')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(newBrand);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/ should return a  conflict exception with existing brand name', async () => {
      const newBrand = createBrand();
      await repo.save(newBrand);
      const repeatedBrand = {
        ...createBrand(),
        name: newBrand.name,
      };
      try {
        await request(app.getHttpServer())
          .post('/brand')
          .set('x-api-key', API_KEY)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(repeatedBrand);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `The Brand name: ${repeatedBrand.name} is already in use`,
        );
      }
    });

    it('/ should create a brand, return 401 if api key is missing', async () => {
      const newBrand = createBrand();
      const res = await request(app.getHttpServer())
        .post('/brand')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newBrand);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });
  });

  describe('PATCH Brand', () => {
    it('/:id should update a brand', async () => {
      const newBrands = generateNewBrands(10);
      const dataNewBrands = await repo.save(newBrands);
      const id = dataNewBrands[0].id;
      const updatedData: UpdateBrandDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/brand/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.name).toBe(updatedData.name);
    });

    it('/:id should return 401 if the user is not admin', async () => {
      const newBrands = generateNewBrands(10);
      const dataNewBrands = await repo.save(newBrands);
      const id = dataNewBrands[0].id;
      const updatedData: UpdateBrandDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/brand/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(updatedData);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return Conflict if brand name is already taken', async () => {
      const newBrands = await repo.save(generateNewBrands(10));

      const brand = newBrands[0];
      const id = newBrands[1].id;

      const updatedData: UpdateBrandDto = {
        name: brand.name,
      };
      const res = await request(app.getHttpServer())
        .patch(`/brand/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(409);
      expect(message).toBe(
        `The Brand name: ${updatedData.name} is already in use`,
      );
    });

    it('should return 404 if brand does not exist', async () => {
      const id = 9999;
      const updatedData: UpdateBrandDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/brand/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(404);
      expect(message).toBe(`The Brand with id: ${id} not found`);
    });

    it('/:id should return 401 if api key is missing', async () => {
      const newBrands = generateNewBrands(10);
      const dataNewBrands = await repo.save(newBrands);
      const id = dataNewBrands[0].id;
      const updatedData: UpdateBrandDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/brand/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });

    it('/:id should return 401 if api key is invalid', async () => {
      const newBrands = generateNewBrands(10);
      const dataNewBrands = await repo.save(newBrands);
      const id = dataNewBrands[0].id;
      const updatedData: UpdateBrandDto = {
        name: 'Updated name',
      };
      const res = await request(app.getHttpServer())
        .patch(`/brand/${id}`)
        .set('x-api-key', 'invalid-api-key')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });
  });

  describe('DELETE Brand', () => {
    it('/:id should delete a user', async () => {
      const newBrands = generateNewBrands(10);
      const dataNewBrands = await repo.save(newBrands);
      const id = dataNewBrands[0].id;
      const res = await request(app.getHttpServer())
        .delete(`/brand/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode } = res.body;
      const deletedInDB = await repo.findOne({
        where: { id, isDeleted: false },
      });
      expect(statusCode).toBe(204);
      expect(deletedInDB).toBeNull();
    });

    it('/:id should return 401 if user is not admin', async () => {
      const newBrands = generateNewBrands(10);
      const dataNewBrands = await repo.save(newBrands);
      const id = dataNewBrands[0].id;
      const res = await request(app.getHttpServer())
        .delete(`/brand/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return 401 if api key is missing', async () => {
      const newBrands = generateNewBrands(10);
      const dataNewBrands = await repo.save(newBrands);
      const id = dataNewBrands[0].id;
      const res = await request(app.getHttpServer())
        .delete(`/brand/${id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });

    it('/:id should return 401 if api key is invalid', async () => {
      const newBrands = generateNewBrands(10);
      const dataNewBrands = await repo.save(newBrands);
      const id = dataNewBrands[0].id;
      const res = await request(app.getHttpServer())
        .delete(`/brand/${id}`)
        .set('x-api-key', 'invalid-api-key')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(401);
      expect(message).toBe('Invalid API key');
    });

    it('/:id should return 404 if brand does not exist', async () => {
      const id = 9999;
      const res = await request(app.getHttpServer())
        .delete(`/brand/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(404);
      expect(message).toBe(`The Brand with id: ${id} not found`);
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
