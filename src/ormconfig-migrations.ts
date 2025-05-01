import { DataSource } from 'typeorm';

const configMigration = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT ? Number(process.env.TYPEORM_PORT) : 5432, // default to 5432 or handle as needed
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [process.env.TYPEORM_ENTITIES as string],
  synchronize: false,
  migrations: [process.env.TYPEORM_MIGRATIONS as string],
});

export default configMigration;
