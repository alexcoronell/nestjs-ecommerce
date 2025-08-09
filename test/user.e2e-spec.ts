/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { UserModule } from '@user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

/* App Testing Module */
//import { testModule } from './test.module';

/* Seed */
import { upSeed, downSeed } from './utils/seed';

/* DataSource */
import { dataSource } from './utils/seed';

/* Seed */
import { seedNewUser, seedUser, seedUsers } from './utils/user.seed';
import { UpdateUserDto } from '@user/dto/update-user.dto';

describe('UserControler (e2e)', () => {
  let app: INestApplication<App>;
  let repo: any = undefined;

  beforeAll(async () => {
    /* if (!dataSource.isInitialized) {
      await dataSource.initialize();
    } */

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
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    repo = app.get('UserRepository');
  });

  beforeEach(async () => {
    await upSeed();
  });

  describe('GET User', () => {
    it('/count-all', async () => {
      await repo.save(seedUsers);
      const data: any = await request(app.getHttpServer()).get(
        '/user/count-all',
      );
      const { statusCode, total } = data.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(seedUsers.length);
    });

    it('/count', async () => {
      await repo.save(seedUsers);
      const data = await request(app.getHttpServer()).get('/user/count');
      const { statusCode, total } = data.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(seedUsers.length);
    });

    it('/', async () => {
      await repo.save(seedUsers);
      const res = await request(app.getHttpServer()).get('/user');
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(seedUsers.length);
      data.forEach((user) => {
        const seedUser = seedUsers.find((su) => su.id === user.id);
        expect(user).toEqual(
          expect.objectContaining({
            id: seedUser?.id,
            firstname: seedUser?.firstname,
            lastname: seedUser?.lastname,
            email: seedUser?.email,
            role: seedUser?.role,
          }),
        );
      });
    });

    it('/actives', async () => {
      await repo.save(seedUsers);
      const res = await request(app.getHttpServer()).get('/user/actives');
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.length).toEqual(seedUsers.length);
      data.forEach((user) => {
        const seedUser = seedUsers.find((su) => su.id === user.id);
        expect(user).toEqual(
          expect.objectContaining({
            id: seedUser?.id,
            firstname: seedUser?.firstname,
            lastname: seedUser?.lastname,
            email: seedUser?.email,
            role: seedUser?.role,
          }),
        );
      });
    });

    it('/:id', async () => {
      await repo.save(seedUser);
      const res = await request(app.getHttpServer()).get(
        `/user/${seedUser.id}`,
      );
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(seedUser.id);
      expect(data.firstname).toEqual(seedUser.firstname);
      expect(data.lastname).toEqual(seedUser.lastname);
      expect(data.email).toEqual(seedUser.email);
      expect(data.role).toEqual(seedUser.role);
    });

    it('/email/:email', async () => {
      await repo.save(seedUser);
      const res = await request(app.getHttpServer()).get(
        `/user/email/${seedUser.email}`,
      );
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(seedUser.id);
      expect(data.firstname).toEqual(seedUser.firstname);
      expect(data.lastname).toEqual(seedUser.lastname);
      expect(data.email).toEqual(seedUser.email);
      expect(data.role).toEqual(seedUser.role);
    });
  });

  describe('POST User', () => {
    it('/ should create a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .send(seedNewUser);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(201);
      expect(data.firstname).toEqual(seedNewUser.firstname);
    });
  });

  describe('PATCH User', () => {
    it('/:id should update a user', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const updatedData: UpdateUserDto = {
        firstname: 'Updated name',
        lastname: 'Updated lastname',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/${id}`)
        .send(updatedData);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.firstname).toBe(updatedData.firstname);
      expect(data.lastname).toBe(updatedData.lastname);
    });
  });

  describe('DELETE User', () => {
    it('/:id should delete a user', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const res = await request(app.getHttpServer()).delete(`/user/${id}`);
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
