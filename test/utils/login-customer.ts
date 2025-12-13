/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { seedNewCustomerUser, customerPassword } from './user.seed';

/* ApiKey */
const API_KEY = process.env.API_KEY || 'api-e2e-key';

async function loginCustomer(app: INestApplication<App>, repo: any) {
  const customerUser = await repo.save(await seedNewCustomerUser());

  const login = await request(app.getHttpServer())
    .post('/auth/user/login')
    .set('x-api-key', API_KEY)
    .send({
      email: customerUser?.email,
      password: customerPassword,
    });
  const { access_token } = login.body;
  return { customerUser, access_token };
}

export { loginCustomer };
