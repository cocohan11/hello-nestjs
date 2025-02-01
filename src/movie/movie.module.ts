import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from 'src/director/entity/director.entity';

@Module({
  imports:[
    // 저장 
    TypeOrmModule.forFeature([ // 1. 창구직원 채용 (Repository 등록)
      Movie, // Movie 담당 창구직원 채용
      MovieDetail,
      Director,
    ])
  ],
  controllers: [MovieController],
  providers: [MovieService], // MovieService라는 클래스의 인스턴스를 주입하겠다-고 프로바이더에 설정함
})
export class MovieModule {}
