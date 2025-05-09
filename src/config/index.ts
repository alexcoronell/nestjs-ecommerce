import { config } from 'dotenv';
import { registerAs } from '@nestjs/config';

const env = process.env.NODE_ENV || 'dev';

config({
  path: `.env.${env}`,
});

export default registerAs('config', () => {
  return {
    postgres: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string, 10) || 5432,
      dbName: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USERNAME,
    },
    apikey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_TOKEN_EXPIRATION_TIME,
    jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    jwtRefreshTokenExpirationTime:
      process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  };
});
