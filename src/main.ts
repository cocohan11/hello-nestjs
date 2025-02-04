import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 정의하지 않은 값들은 전달X
    forbidNonWhitelisted: true, // 정의하지 않은 값들이면 에러냄
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
