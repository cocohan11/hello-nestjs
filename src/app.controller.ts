import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { query } from 'express';


interface Moive {
  id: number;
  title: string;
}

@Controller('movie') // 통합패스를 넣어줌
export class AppController {

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

  constructor(private readonly appService: AppService) {}

  @Get()
  getMovies(
    @Query('title') title?: string
  ) {
    if (!title) {
      return this.movies;
    }
    return this.movies.filter(m => m.title.startsWith(title)); // 검색처럼
  }

  @Get(':id')
  getMovie(
    @Param('id') id: string
  ) {
    const movie = this.movies.find((m)=> m.id === +id);
    if(!movie) {
      throw new NotFoundException('존재하지않는 ID 값의 영화입니다!');
    }
    return movie;
  }

  @Post()
  postMovie(
    @Body('title') title: string
  ) {
    const movie: Moive = {
      id: this.idCounter++,
      title : title,
    }
    this.movies.push(movie);

    return movie;
  }

  @Patch(':id')
  patchMovie(
    @Param('id') id: string,
    @Body('title') title: string,
  ) {
    const movie = this.movies.find((m)=> m.id === +id);
    if(!movie) {
      throw new NotFoundException('존재하지않는 ID 값의 영화입니다!');
    }

    Object.assign(movie, {title}); // 덮어쓰겠다
  }

  @Delete(':id')
  deleteMovie(
    @Param('id') id: string
  ) {
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
