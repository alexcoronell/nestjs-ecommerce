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
import * as bcrypt from 'bcrypt';

import config from '@config/index';

/* Modules */
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';

/* Guards */
import { ApiKeyGuard } from '@commons/guards/api-key.guard';

/* Seed */
import { upSeed, downSeed } from './utils/seed';

/* DataSource */
import { dataSource } from './utils/seed';

import { seedNewAdminUser } from './utils/user.seed';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let repo: any = undefined;

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
  });

  beforeEach(async () => {
    await upSeed();
    const hashedPassword = await bcrypt.hash(seedNewAdminUser.password, 10);
    const userToSave = { ...seedNewAdminUser, password: hashedPassword };
    await repo.save(userToSave);
  });

  const API_KEY = process.env.API_KEY || 'api-e2e-key';

  describe('POST Auth Login', () => {
    it('/login', async () => {
      const user = {
        email: seedNewAdminUser.email,
        password: seedNewAdminUser.password,
      };

      const data: any = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Authorization', API_KEY) // <-- aquí agregas la API key
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
        .post('/auth/login')
        .set('Authorization', API_KEY) // <-- aquí también
        .send(user);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Not Allow');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should return a new access token', async () => {
      const user = {
        email: seedNewAdminUser.email,
        password: seedNewAdminUser.password,
      };

      const loginResponse: any = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Authorization', API_KEY)
        .send(user);
      const { refresh_token } = loginResponse.body;

      const data: any = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Authorization', API_KEY)
        .send({ refresh: refresh_token });
      const { body, statusCode } = data;
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('access_token');
      expect(body.access_token).toBeTruthy();
    });

    it('should return 401 if refresh token is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Authorization', API_KEY)
        .send({ refresh: 'invalid_token' });
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Unauthorized');
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
