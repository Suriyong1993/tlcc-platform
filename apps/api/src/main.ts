import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const config = app.get(ConfigService);
  const port = config.get('APP_PORT') || 3001;

  // ── Security ──────────────────────────────
  app.use(helmet());
  app.enableCors({
    origin: [
      'http://localhost:3000',     // Next.js admin
      'http://localhost:8081',     // Expo dev
      process.env.WEB_URL,
      process.env.MOBILE_URL,
    ].filter(Boolean),
    credentials: true,
  });

  // ── Global pipes ──────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── API prefix ────────────────────────────
  app.setGlobalPrefix('api/v1');

  await app.listen(port);
  logger.log(`🚀 TLCC API running on http://localhost:${port}/api/v1`);
}

bootstrap();
