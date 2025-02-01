import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from 'src/director/entity/director.entity';


// "IcO컨테이너야. 너가 MovieService클래스(인스턴스)를 싱글톤으로 컨테이너에서 관리해줘" 
// 인스턴스화하는 코드가 안보이네. NestJS가 알아서 관리하기때문.
@Injectable() 
export class MovieService {

  // 생성자
  constructor(
    @InjectRepository(Movie) // 2. 은행원이 창구직원에게 업무 지시
    private readonly movieRepository: Repository<Movie>, // 창구직원 배정
    @InjectRepository(MovieDetail) 
    private readonly movieDetailRepository: Repository<MovieDetail>, 
    @InjectRepository(Director) 
    private readonly directorRepository: Repository<Director>, 
  ) {}


  async findAll(title: string) {
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


  async findOne(id: number) {
    const movie = await this.movieRepository.findOne({
      where:{
        id,
      },
      relations: ['detail']
    })
     
    if(!movie) {
      throw new NotFoundException('존재하지않는 ID 값의 영화입니다!');
    }
    return movie;
  }


  async create(createMovieDto: CreateMovieDto) {
    // 영화만들기 전에 감독부터 존재여부확인
    const director = await this.directorRepository.findOne({
      where:{
        id:createMovieDto.directorId
      }
    });
    // 예외처리
    if (!director) {
      throw new NotFoundException('존재하지 않는 ID의 감독입니다!');
    }
    // 영화 생성
    const movie = await this.movieRepository.save({
      title: createMovieDto.title,
      genre: createMovieDto.genre,
      detail: {
        detail: createMovieDto.detail,
      },
      director,
    });
    
    return movie;
  }


  async update(id: number, updateMovieDto: UpdateMovieDto) {
    // movie + movieDetail
    const movie = await this.movieRepository.findOne({
      where:{
        id,
      }, 
      relations: ['detail']
    })
    // 예외처리
    if(!movie) {
      throw new NotFoundException('존재하지않는 ID 값의 영화입니다!');
    }
    // 데이터 쪼갬
    const { detail, directorId, ...movieRest } = updateMovieDto;
    let newDirector;
    // directorId를 수정할 경우, 
    if (directorId) {
      // 먼저 그 감독의 존재여부 확인
      const director = await this.directorRepository.findOne({
        where: {
          id: directorId,
        }
      })
      // 예외처리
      if (!director) {
        throw new NotFoundException('존재하지 않는 ID의 감독입니다!');
      }
      newDirector = director;
    }
    // movieUpdateFields는 업데이트할 영화 데이터를 담는 객체
    // 1. movieRest: UpdateMovieDto에서 detail과 directorId를 제외한 나머지 필드들
    // 2. 새로운 감독(newDirector)이 있다면 director 필드에 추가
    const movieUpdateFields = {
      ...movieRest,
      ...(newDirector && {director: newDirector})
    }
    //  Director 테이블 업뎃
    await this.movieRepository.update(
      {id},
      movieUpdateFields
    );
    // movieDetail 테이블 업뎃
    if (detail) {
      await this.movieDetailRepository.update(
        {
          id: movie.detail.id, // movieDetail테이블의 id를 넣어야됨 주의
        },
        {
          detail,
        }
      )
    }
    // 업뎃한 영화 조회 
    const newMovie = await this.movieRepository.findOne({
      where:{
        id,
      },
      relations: ['detail', 'director']
    })

    return newMovie;
  }


  async remove(id: number) {
    const movie = await this.movieRepository.findOne({
      where:{
        id,
      }, 
      relations: ['detail']
    })
    
    if(!movie) {
      throw new NotFoundException('존재하지않는 ID 값의 영화입니다!');
    }

    //삭제
    await this.movieRepository.delete(id);
    await this.movieDetailRepository.delete(movie.detail.id)
    return id;
  }
}
