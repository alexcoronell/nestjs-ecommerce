import { registerAs } from '@nestjs/config';

type Config = {
  postgres: {
    dbName: string | undefined;
    port: number;
    password: string | undefined;
    user: string | undefined;
    host: string | undefined;
  };
  apiRoute: string | undefined;
  apikey: string | undefined;
  jwtSecret: string | undefined;
  jwtExpirationTime: string | undefined;
  jwtRefreshTokenSecret: string | undefined;
  jwtRefreshTokenExpirationTime: string | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default registerAs('config', (): Config => {
  return {
    postgres: {
      dbName: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT as string, 10),
      password: process.env.POSTGRES_PASSWORD,
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
    },
    apiRoute: process.env.API_ROUTE,
    apikey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_TOKEN_EXPIRATION_TIME,
    jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    jwtRefreshTokenExpirationTime:
      process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  };
});
