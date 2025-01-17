import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { query } from 'express';


@Controller('movie') // 통합패스를 넣어줌
export class AppController {
  constructor(private readonly appService: AppService) {} 


  @Get()
  getMovies(
    @Query('title') title?: string
  ) {
    return this.appService.getManyMovies(title);
  }


  @Get(':id')
  getMovie(
    @Param('id') id: string
  ) {
    return this.appService.getMovieById(+id);
  }


  @Post()
  postMovie(
    @Body('title') title: string
  ) {
    return this.appService.createMovie(title);
  }


  @Patch(':id')
  patchMovie(
    @Param('id') id: string,
    @Body('title') title: string,
  ) {
    return this.appService.updateMovie(+id, title);
  }


  @Delete(':id')
  deleteMovie(
    @Param('id') id: string
  ) {
    return this.appService.deleteMovie(+id);
  }

}
