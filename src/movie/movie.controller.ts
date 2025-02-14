import { Request, Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe, BadRequestException, NotFoundException, ParseBoolPipe, ParseArrayPipe, ParseEnumPipe, DefaultValuePipe, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { number } from 'joi';
import { MovieTitleValidationPipe } from './pipe/movie-title-validation.pipe';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Public } from 'src/auth/decorator/public.decorator';


@Controller('movie')
@UseInterceptors(ClassSerializerInterceptor) // -> class transformer를 movieController에 적용하겠다. 
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

 
  @Public()
  @Get()
  getMovies(
    @Query('title', MovieTitleValidationPipe) title?: string,
  ) {
    return this.movieService.findAll(title);
  }


  @Get(':id')
  getMovie(
    @Param('id', ParseIntPipe) id: number, // ParseIntPipe를 넣어주면 id를 string으로 하지않아도됨. 왜냐면 변환해주고 검증해주니까. 
    // @Query('test', new DefaultValuePipe(10)) test: number,
  ) {
    console.log(test);
    throw new NotFoundException('에러!')
    return this.movieService.findOne(+id);
  }


  @Post()
  // @UseGuards(AuthGuard) // nestjs자체 AuthGuard도 존재함. 유의 
  postMovie(
    @Body() body: CreateMovieDto
  ) {
    return this.movieService.create(
      body
    );
  }


  @Patch(':id')
  patchMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMovieDto
  ) {
    return this.movieService.update(
      +id, 
      body
    );
  }


  @Delete(':id')
  deleteMovie(
    @Param('id', ParseIntPipe) id: number
  ) {   
    return this.movieService.remove(+id); 
  }
}
