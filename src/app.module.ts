import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { Movie } from './movie/entity/movie.entity';


// 모듈들이 한 데 모이는 중앙모듈 역할을 하게 됨
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 어떤 모듈에서든 환경변수를 사용한다.
      validationSchema: Joi.object({
        ENV: Joi.string().valid('dev', 'prod').required(),
        DB_TYPE: Joi.string().valid('postgres').required(), // postgres만 가능능
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),  
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),  
      })
    }),
    // 왜 비동기로 실행하느냐? -> 
    TypeOrmModule.forRootAsync({
      useFactory:(configService: ConfigService) => ({ // ConfigService를 IoC 컨테이너로부터 주입받아 사용
        type: configService.get<string>('DB_TYPE') as "postgres",
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          Movie,
        ],
        synchronize: true,
      }),
      inject: [ConfigService] // "IoC 컨테이너에서 ConfigService를 인젝션해줘야 합니다"
    }),
    MovieModule
  ],
})
export class AppModule {}
