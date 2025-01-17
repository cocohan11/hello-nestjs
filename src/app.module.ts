import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';

// 모듈들이 한 데 모이는 중앙모듈 역할을 하게 됨
@Module({
  imports: [MovieModule],
})
export class AppModule {}
