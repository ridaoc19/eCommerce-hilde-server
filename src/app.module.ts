import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import config, { environments } from './config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        URL_CLIENT: Joi.string().required(),
        SECRET_KEY_JWT: Joi.string().required(),
        SECRET_KEY_JWT_EMAIL: Joi.string().required(),
        EMAIL_RESEND: Joi.string().email().required(),
        KEY_RESEND: Joi.string(),
        ADMIN_USER_EMAIL: Joi.string().email().required(),
        API_KEY: Joi.string().required(),
      }),
    }),
    UsersModule,
    DatabaseModule,
    AuthModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
