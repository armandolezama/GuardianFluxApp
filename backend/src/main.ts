// backend/src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global si luego quieres versionar API
  // app.setGlobalPrefix('api/v1');

  // CORS configurable por env
  const corsOrigins =
    process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()) ?? [
      'http://localhost:4200',
      'http://localhost:5173',
    ];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  await app.listen(port);
  console.log(`GuardianFlux backend listening on http://localhost:${port}`);
}

bootstrap();
