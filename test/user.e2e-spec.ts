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
import * as bcrypt from 'bcrypt';

/* Modules */
import { AppModule } from '../src/app.module';
import { CustomerModule } from '@customer/customer.module';
import { UserModule } from '@user/user.module';

/* Interceptors */
import { AuditInterceptor } from '@commons/interceptors/audit.interceptor';

/* Entities */
import { User } from '@user/entities/user.entity';

/* Seed */
import { upSeed, downSeed } from './utils/seed';

/* DataSource */
import { dataSource } from './utils/seed';

/* Faker */
import { createUser } from '@faker/user.faker';

/* User Seed */
import {
  seedNewUser,
  seedUser,
  seedUsers,
  seedNewAdminUser,
  adminPassword,
  seedNewSellerUser,
  sellerPassword,
} from './utils/user.seed';

/* Customer Seed */
import { seedNewCustomer, customerPasword } from './utils/customer.seed';
import { UpdateUserDto } from '@user/dto/update-user.dto';

const API_KEY = process.env.API_KEY || 'api-e2e-key';

describe('UserControler (e2e)', () => {
  let app: INestApplication<App>;
  let repo: any = undefined;
  let repoCustomer: any = undefined;
  let adminUser: User | null = null;
  let sellerUser: User | null = null;
  let adminAccessToken: string;
  let sellerAccessToken: string;
  let customer: any = undefined;
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
        CustomerModule,
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
    repo = app.get('UserRepository');
    repoCustomer = app.get('CustomerRepository');
  });

  beforeEach(async () => {
    await upSeed();
    adminUser = await repo.save(await seedNewAdminUser());
    sellerUser = await repo.save(await seedNewSellerUser());
    customer = await repoCustomer.save(await seedNewCustomer());

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
      .post('/auth/customer/login')
      .set('x-api-key', API_KEY)
      .send({
        email: customer?.email,
        password: customerPasword,
      });
    const { access_token: tempCustomerAccessToken } = loginCustomer.body;
    customerAccessToken = tempCustomerAccessToken;
  });

  describe('GET User - Count', () => {
    it('/count-all should return 200 and the total user count', async () => {
      await repo.save(seedUsers);
      const data: any = await request(app.getHttpServer())
        .get('/user/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, total } = data.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(seedUsers.length);
    });

    it('/count-all should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get(
        '/user/count-all',
      );
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count-all should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/user/count-all')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count-all should return 401 if the user is not admin', async () => {
      await repo.save(seedUsers);
      const data: any = await request(app.getHttpServer())
        .get('/user/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, error } = data.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('count-all should return 401 if the user is a customer', async () => {
      await repo.save(seedUsers);
      const data: any = await request(app.getHttpServer())
        .get('/user/count-all')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = data.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer user');
    });

    it('/count should return 200 and the total user count not deleted', async () => {
      await repo.save(seedUsers);
      const data = await request(app.getHttpServer())
        .get('/user/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, total } = data.body;
      expect(statusCode).toBe(200);
      expect(total).toEqual(seedUsers.length);
    });

    it('/count should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get('/user/count');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/user/count')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/count should return 401 if the user is not admin', async () => {
      await repo.save(seedUsers);
      const data: any = await request(app.getHttpServer())
        .get('/user/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, error } = data.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('count should return 401 if the user is a customer', async () => {
      await repo.save(seedUsers);
      const data: any = await request(app.getHttpServer())
        .get('/user/count')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = data.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer user');
    });
  });

  describe('GET User - Find', () => {
    it('/ should return all users', async () => {
      await repo.save(seedUsers);
      const res = await request(app.getHttpServer())
        .get('/user')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
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

    it('/ should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get('/user');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/user')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 with the user not admin', async () => {
      await repo.save(seedUsers);
      const res = await request(app.getHttpServer())
        .get('/user')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/ should return 401 if the user is a customer', async () => {
      await repo.save(seedUsers);
      const data: any = await request(app.getHttpServer())
        .get('/user')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = data.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer user');
    });

    it('/actives should return 200 and all active users', async () => {
      await repo.save(seedUsers);
      const res = await request(app.getHttpServer())
        .get('/user/actives')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
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

    it('/actives should return 401 if api key is missing', async () => {
      const data: any = await request(app.getHttpServer()).get('/user/actives');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/actives should return 401 if api key is invalid', async () => {
      const data: any = await request(app.getHttpServer())
        .get('/user/actives')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/actives should return 401 if the user is a customer', async () => {
      await repo.save(seedUsers);
      const data: any = await request(app.getHttpServer())
        .get('/user/actives')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = data.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer user');
    });

    it('/:id should return 200 and the user details with admin user', async () => {
      await repo.save(seedUser);
      const res = await request(app.getHttpServer())
        .get(`/user/${seedUser.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(seedUser.id);
      expect(data.firstname).toEqual(seedUser.firstname);
      expect(data.lastname).toEqual(seedUser.lastname);
      expect(data.email).toEqual(seedUser.email);
      expect(data.role).toEqual(seedUser.role);
    });

    it('/:id should return 401 if api key is missing', async () => {
      const id = seedUser.id;
      const data: any = await request(app.getHttpServer()).get(`/user/${id}`);
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/:id should return 401 if api key is invalid', async () => {
      const id = seedUser.id;
      const data: any = await request(app.getHttpServer())
        .get(`/user/:${id}`)
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/:id should return 401 and error message with no admin user', async () => {
      await repo.save(seedUser);
      const res = await request(app.getHttpServer())
        .get(`/user/${seedUser.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return 200 and the user details with the same user', async () => {
      const res = await request(app.getHttpServer())
        .get(`/user/${sellerUser?.id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(sellerUser?.id);
      expect(data.firstname).toEqual(sellerUser?.firstname);
      expect(data.lastname).toEqual(sellerUser?.lastname);
      expect(data.email).toEqual(sellerUser?.email);
      expect(data.role).toEqual(sellerUser?.role);
    });

    it('/:id should return 401 if the user is a customer', async () => {
      await repo.save(seedUsers);
      const data: any = await request(app.getHttpServer())
        .get('/user/1')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = data.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer user');
    });

    it('/email/:email should return 200 and the user details with admin user', async () => {
      await repo.save(seedUser);
      const res = await request(app.getHttpServer())
        .get(`/user/email/${seedUser.email}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.id).toEqual(seedUser.id);
      expect(data.firstname).toEqual(seedUser.firstname);
      expect(data.lastname).toEqual(seedUser.lastname);
      expect(data.email).toEqual(seedUser.email);
      expect(data.role).toEqual(seedUser.role);
    });

    it('/email/:email should return 401 if api key is missing', async () => {
      const email = seedUser.email;
      const data: any = await request(app.getHttpServer()).get(
        `/user/email/${email}`,
      );
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/email/:email should return 401 if api key is invalid', async () => {
      const email = seedUser.email;
      const data: any = await request(app.getHttpServer())
        .get(`/user/email/:${email}`)
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = data;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/email/:email should return 401 and error message with no admin user', async () => {
      await repo.save(seedUser);
      const res = await request(app.getHttpServer())
        .get(`/user/email/${seedUser.email}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return 401 if the user is a customer', async () => {
      await repo.save(seedUser);
      const data: any = await request(app.getHttpServer())
        .get(`/user/${seedUser.email}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = data.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer user');
    });
  });

  describe('POST User', () => {
    it('/ should return 201 and created user', async () => {
      const newUser = createUser();
      const seedNewUser = {
        ...newUser,
        password: await bcrypt.hash(newUser.password, 10),
      };
      const res = await request(app.getHttpServer())
        .post('/user')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(seedNewUser);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(201);
      expect(data.firstname).toEqual(seedNewUser.firstname);
      expect(data.createdBy).toEqual(adminUser?.id);
    });

    it('/ should  return conflict exception with existing email', async () => {
      await repo.save(seedUsers);
      const user = seedUsers[0];
      const newUser = {
        ...seedNewUser,
        email: user.email,
      };
      try {
        await request(app.getHttpServer())
          .post('/user')
          .set('x-api-key', API_KEY)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(newUser);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(`The Email ${user.email} is already in use`);
      }
    });

    it('/ should return 401 if api key is missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .send(seedNewUser);
      const { body, statusCode } = res;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = res;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 and error message with no admin user', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(seedNewUser);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/ should return 401 with customer user', async () => {
      const newUser = createUser();
      const seedNewUser = {
        ...newUser,
        password: await bcrypt.hash(newUser.password, 10),
      };
      const res = await request(app.getHttpServer())
        .post('/user')
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send(seedNewUser);
      const { statusCode, message, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer user');
    });
  });

  describe('PATCH User', () => {
    it('/:id should 200 and the updated a user', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const updatedData: UpdateUserDto = {
        firstname: 'Updated name',
        lastname: 'Updated lastname',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.firstname).toBe(updatedData.firstname);
      expect(data.lastname).toBe(updatedData.lastname);
    });

    it('/:id should return 200 and the updated a user with the same user', async () => {
      const id = sellerUser?.id;
      const updatedData: UpdateUserDto = {
        firstname: 'Updated name',
        lastname: 'Updated lastname',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(updatedData);
      const { statusCode, data } = res.body;
      expect(statusCode).toBe(200);
      expect(data.firstname).toBe(updatedData.firstname);
      expect(data.lastname).toBe(updatedData.lastname);
      expect(data.updatedBy).toEqual(sellerUser?.id);
    });

    it('/:id should return conflict exception with existing email', async () => {
      await repo.save(seedUsers);

      const user = seedUsers[0];
      const id = seedUsers[1].id;
      const updatedData: UpdateUserDto = {
        email: user.email,
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(409);
      expect(message).toBe(`The Email ${user.email} is already in use`);
    });

    it('/:id should return 401 if api key is missing', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const updatedData: UpdateUserDto = {
        firstname: 'Updated name',
        lastname: 'Updated lastname',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/${id}`)
        .send(updatedData);
      const { body, statusCode } = res;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const updatedData: UpdateUserDto = {
        firstname: 'Updated name',
        lastname: 'Updated lastname',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/${id}`)
        .set('x-api-key', 'invalid-api-key')
        .send(updatedData);
      const { body, statusCode } = res;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/:id should 401 and error message with no admin user', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const updatedData: UpdateUserDto = {
        firstname: 'Updated name',
        lastname: 'Updated lastname',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(updatedData);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
    });

    it('/:id should return 200 and message when the password is updated by admin user', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const updatedData = {
        password: 'newPassword',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/password/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(200);
      expect(message).toBe('Password updated successfully');
    });

    it('/:id should return 200 and message when the password is updated by admin user', async () => {
      const id = sellerUser?.id;
      const updatedData = {
        password: 'newPassword',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/password/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`)
        .send(updatedData);
      const { statusCode, message } = res.body;
      expect(statusCode).toBe(200);
      expect(message).toBe('Password updated successfully');
    });

    it('/:id should 401 and error message with customer user', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const updatedData: UpdateUserDto = {
        firstname: 'Updated name',
        lastname: 'Updated lastname',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send(updatedData);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer user');
    });
  });

  describe('DELETE User', () => {
    it('/:id should return 204 and message', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const res = await request(app.getHttpServer())
        .delete(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const { statusCode, message } = res.body;
      const deletedInDB = await repo.findOne({
        relations: ['createdBy', 'updatedBy', 'deletedBy'],
        where: { id, isDeleted: false },
      });
      const deletedInDBWithDeleted = await repo.findOne({
        relations: ['createdBy', 'updatedBy', 'deletedBy'],
        where: { id, isDeleted: true },
      });
      expect(deletedInDBWithDeleted).not.toBeNull();
      expect(deletedInDBWithDeleted.isDeleted).toBe(true);
      expect(deletedInDBWithDeleted.deletedBy.id).toBe(adminUser?.id);
      expect(statusCode).toBe(204);
      expect(deletedInDB).toBeNull();
      expect(message).toBe(`The User with id: ${id} has been deleted`);
    });

    it('/ should return 401 if api key is missing', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const res = await request(app.getHttpServer()).delete(`/user/${id}`);
      const { body, statusCode } = res;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/ should return 401 if api key is invalid', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const res = await request(app.getHttpServer())
        .delete(`/user/${id}`)
        .set('x-api-key', 'invalid-api-key');
      const { body, statusCode } = res;
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('message', 'Invalid API key');
    });

    it('/:id should return 401 and error message when user is not admin user', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const res = await request(app.getHttpServer())
        .delete(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${sellerAccessToken}`);
      const { statusCode, error } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe(`Unauthorized`);
    });

    it('/:id should return 401 and error message when is a customer user', async () => {
      await repo.save(seedUsers);
      const id = seedUsers[0].id;
      const res = await request(app.getHttpServer())
        .delete(`/user/${id}`)
        .set('x-api-key', API_KEY)
        .set('Authorization', `Bearer ${customerAccessToken}`);
      const { statusCode, error, message } = res.body;
      expect(statusCode).toBe(401);
      expect(error).toBe('Unauthorized');
      expect(message).toBe('Unauthorized: Customer user');
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
