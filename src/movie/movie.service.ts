import { Injectable, NotFoundException } from '@nestjs/common';


export interface Moive {
  id: number;
  title: string;
}


// "IcO컨테이너야. 너가 MovieService클래스(인스턴스)를 싱글톤으로 컨테이너에서 관리해줘" 
// 인스턴스화하는 코드가 안보이네. NestJS가 알아서 관리하기때문.
@Injectable() 
export class MovieService {

  // 임시 DB
  private movies: Moive[] =  [
    {
      id: 1,
      title: '해리포터',
    },
    {
      id: 2,
      title: '반지의 제왕왕',
    }
  ];
  private idCounter = 3;


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


  createMovie(title: string) {
    const movie: Moive = {
      id: this.idCounter++,
      title : title,
    }
    this.movies.push(movie);

    return movie;
  }


  updateMovie(id: number, title: string) {
    const movie = this.movies.find((m)=> m.id === +id);
    if(!movie) {
      throw new NotFoundException('존재하지않는 ID 값의 영화입니다!');
    }

    Object.assign(movie, {title}); // 덮어쓰겠다
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
