import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

import cookieParser from 'cookie-parser';
import IORedis from 'ioredis';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import { ms } from 'ms';
import parseBoolean from '@eturino/ts-parse-boolean';
import { RedisStore } from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const redis = new IORedis(config.getOrThrow('REDIS_URI'));

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(
    session({
      secret: config.getOrThrow('SESSION_SECRET'),
      name: config.getOrThrow('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow('SESSION_FOLDER'),
      }),
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
bootstrap();
