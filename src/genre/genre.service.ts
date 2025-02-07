import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GenreService {


  // TypeORM 구현체 선언
  constructor(
    @InjectRepository(Genre) 
    private readonly genreRepository: Repository<Genre>,
  ) {}
  

  async create(createGenreDto: CreateGenreDto) {
    const genre = await this.genreRepository.create(createGenreDto);
    return this.genreRepository.save(genre);
  }

  findAll() {
    return this.genreRepository.find();
  }

  async findOne(id: number) {
    const director = await this.genreRepository.findOne({
      where:{
        id,
      }
    })
    return director;  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    // 업데이트할 데이터 검색
    const genre = await this.genreRepository.findOne({
      where:{
        id,
      }
    })
    // 예외처리
    if(!genre) {
      throw new NotFoundException('존재하지 않는 ID의 장르입니다!');
    }
    // 장르 업데이트
    await this.genreRepository.update(
      {
        id,
      }, {
        ...updateGenreDto,
      }
    );
    // 업데이트 한 값 리턴
    const newGenre = await this.genreRepository.findOne({
      where: {
        id,
      }
    })
    return newGenre;
  }

  async remove(id: number) {
    // 삭제할 데이터 검색
    const genre = await this.genreRepository.findOne({
      where: {
        id,
      },
    })
    // 예외처리
    if (!genre) {
      throw new NotFoundException('존재하지 않는 ID값의 장르입니다!')
    }
    //삭제
    await this.genreRepository.delete(id);
    return id;  
  }
}
