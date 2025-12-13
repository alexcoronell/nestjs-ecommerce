/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { seedNewAdminUser, adminPassword } from './user.seed';

/* ApiKey */
const API_KEY = process.env.API_KEY || 'api-e2e-key';

async function loginAdmin(app: INestApplication<App>, repo: any) {
  const adminUser = await repo.save(await seedNewAdminUser());

  const login = await request(app.getHttpServer())
    .post('/auth/user/login')
    .set('x-api-key', API_KEY)
    .send({
      email: adminUser?.email,
      password: adminPassword,
    });
  const { access_token } = login.body;
  return { adminUser, access_token };
}

export { loginAdmin };
