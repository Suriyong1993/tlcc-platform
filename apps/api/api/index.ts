import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedApp: INestApplication | null = null;

async function createApp() {
  if (cachedApp) return cachedApp;
  const { AppModule } = await import('../src/app.module');
  const server = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );
  app.enableCors({ origin: true, credentials: true });
  await app.init();
  cachedApp = app;
  return app;
}

export default async (req: any, res: any) => {
  const app = await createApp();
  const server = app.getHttpAdapter().getInstance();
  server(req, res);
};
