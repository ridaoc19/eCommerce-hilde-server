import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    postgres: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    resend: {
      key: process.env.KEY_RESEND,
      email: process.env.EMAIL_RESEND,
    },
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.SECRET_KEY_JWT,
  };
});

export const environments = {
  dev: '.env',
  stag: '.stag.env',
  prod: '.prod.env',
};
