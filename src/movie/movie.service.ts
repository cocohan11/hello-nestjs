import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie, Series } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';


// "IcO컨테이너야. 너가 MovieService클래스(인스턴스)를 싱글톤으로 컨테이너에서 관리해줘" 
// 인스턴스화하는 코드가 안보이네. NestJS가 알아서 관리하기때문.
@Injectable() 
export class MovieService {

  // 생성자
  constructor(
    @InjectRepository(Movie) // 2. 은행원이 창구직원에게 업무 지시
    private readonly movieRepository: Repository<Movie>, // 창구직원 배정
    
    @InjectRepository(Series) 
    private readonly seriesRepository: Repository<Series> 
  ) {}


  async getManyMovies(title: string) {
    /// 나중에 title 필터 기능 추가하기
    if (!title) {
        return [await this.movieRepository.find(), await this.movieRepository.count()]; // 데이터베이스 작업은 비동기이므로, 항상 async/await를 사용해야 함
    }

    return this.movieRepository.findAndCount({
      where:{
        title: Like(`%${title}%`)
      }
    })
    // if (!title) {
    //   return this.movies;
    // }
    // return this.movies.filter(m => m.title.startsWith(title)); // 검색처럼
  }


  async getMovieById(id: number) {
    const movie = await this.movieRepository.findOne({
      where:{
        id,
      }
    })
     
    if(!movie) {
      throw new NotFoundException('존재하지않는 ID 값의 영화입니다!');
    }
    return movie;
  }


  async createMovie(createMovieDto: CreateMovieDto) {
    const movie = await this.movieRepository.save({
      ...createMovieDto,
      runtime: 100,
    });
    return movie;
  }


  async createSeries(createSeriesDto: CreateMovieDto) {
    const movie = await this.seriesRepository.save({
      ...createSeriesDto,
      seriesCount: 16,
    });
    return movie;
  }


  async updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where:{
        id,
      }
    })
    
    if(!movie) {
      throw new NotFoundException('존재하지않는 ID 값의 영화입니다!');
    }

    await this.movieRepository.update(
      {id},
      updateMovieDto
    )

    const newMovie = await this.movieRepository.findOne({
      where:{
        id,
      }
    })

    return newMovie;
  }


  async deleteMovie(id: number) {
    const movie = await this.movieRepository.findOne({
      where:{
        id,
      }
    })
    
    if(!movie) {
      throw new NotFoundException('존재하지않는 ID 값의 영화입니다!');
    }

    //삭제
    await this.movieRepository.delete(id);
    return id;
  }
}
