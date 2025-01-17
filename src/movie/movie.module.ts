import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  controllers: [MovieController],
  providers: [MovieService], // MovieService라는 클래스의 인스턴스를 주입하겠다-고 프로바이더에 설정함
})
export class MovieModule {}
