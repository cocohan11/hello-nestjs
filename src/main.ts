import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 정의하지 않은 값들은 전달X
    forbidNonWhitelisted: true, // 정의하지 않은 값들이면 에러냄
    transformOptions: {
      enableImplicitConversion: true, // 클래스 타입을 기반으로 입력하는 값을 변경해라라
    }
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
