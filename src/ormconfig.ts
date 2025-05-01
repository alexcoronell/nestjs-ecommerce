import * as dotenv from 'dotenv';
import { env } from 'process';
import { DataSource } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
dotenv.config();

export const dataSource = new DataSource({
  type: 'postgres',
  host: env.TYPEORM_HOST,
  port: env.TYPEORM_PORT ? Number(env.TYPEORM_PORT) : 5432, // default to 5432 or handle as needed
  username: env.TYPEORM_USERNAME,
  password: env.TYPEORM_PASSWORD,
  database: env.TYPEORM_DATABASE,
  entities: [env.TYPEORM_ENTITIES as string],
  migrations: [env.TYPEORM_MIGRATIONS as string],
  migrationsTableName: env.TYPEORM_MIGRATIONS_TABLE_NAME,
  synchronize: false,
  dropSchema: false,
});
