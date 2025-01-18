import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Moive } from './entity/movie.entity';



// "IcO컨테이너야. 너가 MovieService클래스(인스턴스)를 싱글톤으로 컨테이너에서 관리해줘" 
// 인스턴스화하는 코드가 안보이네. NestJS가 알아서 관리하기때문.
@Injectable() 
export class MovieService {

  // 임시 DB
  private movies: Moive[] =  [
    {
      id: 1,
      title: '해리포터',
      genre: 'fantasy'
    },
    {
      id: 2,
      title: '반지의 제왕왕',
      genre: 'action'
    }
  ];
  private idCounter = 3;


  // 생성자
  constructor() {
    const movie1 = {
      
    }
  }


  getManyMovies(title: string) {
    if (!title) {
      return this.movies;
    }
    return this.movies.filter(m => m.title.startsWith(title)); // 검색처럼
  }


  getMovieById(id: number) {
    const movie = this.movies.find((m)=> m.id === +id);
    if(!movie) {
      throw new NotFoundException('존재하지않는 ID 값의 영화입니다!');
    }
    return movie;
  }


  createMovie(createMovieDto: CreateMovieDto) {
    const movie: Moive = {
      id: this.idCounter++,
      ...createMovieDto,
    }
    this.movies.push(movie);

    return movie;
  }


  updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = this.movies.find((m)=> m.id === +id);
    if(!movie) {
      throw new NotFoundException('존재하지않는 ID 값의 영화입니다!');
    }

    Object.assign(movie, updateMovieDto); // 덮어쓰겠다
    return movie;
  }


  deleteMovie(id: number) {
    const movieIndex = this.movies.findIndex((m)=> m.id === +id);
    if(movieIndex === -1) {
      throw new NotFoundException('존재하지않는 ID 값의 영화입니다!');
    }

    //삭제
    //this.movies = this.movies.filter(movie => movie.id !== +id); // 남긴다
    this.movies.splice(movieIndex, 1); // 1만 잘라냄
    return id;
  }
}
