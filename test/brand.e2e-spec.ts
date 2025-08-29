/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

/* Modules */
import { AppModule } from '../src/app.module';
import { BrandModule } from '@brand/brand.module';
import { UserModule } from '@user/user.module';

/* Seed */
import { upSeed, downSeed } from './utils/seed';

/* DataSource */
import { dataSource } from './utils/seed';

/* DTO's */
import { UpdateBrandDto } from '@brand/dto/update-brand.dto';

/* Faker */
import { createBrand, generateNewBrands } from '@faker/brand.faker';

import { seedNewAdminUser } from './utils/user.seed';

const API_KEY = process.env.API_KEY || 'api-e2e-key';

describe('BrandController (e2e)', () => {
  let app: INestApplication<App>;
  let repo: any = undefined;
  let repoUser: any = undefined;

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
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    repo = app.get('BrandRepository');
    repoUser = app.get('UserRepository');
  });

  beforeEach(async () => {
    await upSeed();
    await repoUser.save(seedNewAdminUser);
  });

  describe('GET Brand', () => {
    it('/count-all', async () => {
      const brands = generateNewBrands(10);
      await repo.save(brands);
      const res = await request(app.getHttpServer())
        .get('/brand/count-all')
        .set('Authorization', API_KEY);
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
        .set('Authorization', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count', async () => {
      const brands = generateNewBrands(10);
      await repo.save(brands);
      const res = await request(app.getHttpServer())
        .get('/brand/count')
        .set('Authorization', API_KEY);
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
        .set('Authorization', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return all brands', async () => {
      const brands = generateNewBrands(10);
      await repo.save(brands);
      const res = await request(app.getHttpServer())
        .get('/brand')
        .set('Authorization', API_KEY);
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
        .set('Authorization', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/:id should return an brand by id', async () => {
      const brand = createBrand();
      const dataNewBrand = await repo.save(brand);
      const res = await request(app.getHttpServer())
        .get(`/brand/${dataNewBrand.id}`)
        .set('Authorization', API_KEY);
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
        .set('Authorization', API_KEY);
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
        .set('Authorization', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });
  });

  describe('POST Brand', () => {
    it('/ should create a brand', async () => {
      const newBrand = createBrand();
      const res = await request(app.getHttpServer())
        .post('/brand')
        .set('Authorization', API_KEY)
        .send(newBrand);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(201);
      expect(data.name).toEqual(newBrand.name);
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
        .set('Authorization', API_KEY)
        .send(updatedData);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.name).toBe(updatedData.name);
    });
  });

  describe('DELETE Brand', () => {
    it('/:id should delete a user', async () => {
      const newBrands = generateNewBrands(10);
      const dataNewBrands = await repo.save(newBrands);
      const id = dataNewBrands[0].id;
      const res = await request(app.getHttpServer())
        .delete(`/brand/${id}`)
        .set('Authorization', API_KEY);
      const { statusCode } = res.body;
      const deletedInDB = await repo.findOne({
        where: { id, isDeleted: false },
      });
      expect(statusCode).toBe(204);
      expect(deletedInDB).toBeNull();
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
