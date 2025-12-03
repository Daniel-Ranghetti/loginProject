import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // Habilita CORS para o frontend em desenvolvimento
  app.enableCors({
    origin: 'http://localhost:5173', // ou use process.env.FRONTEND_URL
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // se você quiser permitir cookies/credenciais
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
  