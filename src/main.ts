import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  const allowedOrigins = [
    '*',
    ...(process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',')
          .map((url) => url.trim())
          .filter(Boolean)
      : []),
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((allowed) => origin === allowed)) {
        callback(null, true);
      } else {
        console.warn(`Dominio bloqueado por CORS: ${origin}`); // Log para debugging
        callback(new Error('Acceso no permitido'), false);
      }
    },
    methods: 'GET,POST,PUT,DELETE,OPTIONS,HEAD',
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  });

  // Global validation pipe
  const port = process.env.PORT || 3000;
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
