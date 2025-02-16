import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { Movie } from './movie/entity/movie.entity';
import { MovieDetail } from './movie/entity/movie-detail.entity';
import { DirectorModule } from './director/director.module';
import { Director } from './director/entity/director.entity';
import { GenreModule } from './genre/genre.module';
import { Genre } from './genre/entities/genre.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { envVariablesKeys } from './common/const/env.const';
import { BearerTokenMiddleware } from './auth/middleware/bearer-token.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { RBACGuard } from './auth/guard/rbac.guard';


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
        HASH_ROUNDS: Joi.number().required(),  
        ACCESS_TOKEN_SECRET: Joi.string().required(),  
        REFRESH_TOKEN_SECRET: Joi.string().required(),  
      })
    }),
    // 왜 비동기로 실행하느냐? -> 
    TypeOrmModule.forRootAsync({
      useFactory:(configService: ConfigService) => ({ // ConfigService를 IoC 컨테이너로부터 주입받아 사용
        type: configService.get<string>(envVariablesKeys.DB_TYPE) as "postgres",
        host: configService.get<string>(envVariablesKeys.DB_HOST),
        port: configService.get<number>(envVariablesKeys.DB_PORT),
        username: configService.get<string>(envVariablesKeys.DB_USERNAME),
        password: configService.get<string>(envVariablesKeys.DB_PASSWORD),
        database: configService.get<string>(envVariablesKeys.DB_DATABASE),
        entities: [
          Movie,
          MovieDetail,
          Director,
          Genre,
          User,
        ],
        synchronize: true,
      }),
      inject: [ConfigService] // "IoC 컨테이너에서 ConfigService를 인젝션해줘야 합니다"
    }),
    MovieModule,
    DirectorModule,
    GenreModule,
    AuthModule,
    UserModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RBACGuard,
    }
  ]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      BearerTokenMiddleware,
    ).exclude({
      path: 'auth/login',
      method: RequestMethod.POST,
    }, {
      path: 'auth/register',
      method: RequestMethod.POST,
    })
    .forRoutes('*') // 모든라우터에 적용을 할거다. 
  }

}
