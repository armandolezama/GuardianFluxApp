import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // más adelante puedes poner prefijo global: app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:5173'], // 5173 por si React está en Vite
    credentials: true,
  });

  await app.listen(3000);
  console.log('GuardianFlux backend listening on http://localhost:3000');
}

bootstrap();
