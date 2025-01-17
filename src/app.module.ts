import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [MovieModule],
  controllers: [AppController],
  providers: [AppService], // AppService라는 클래스의 인스턴스를 주입하겠다-고 프로바이더에 설정함
})
export class AppModule {}
