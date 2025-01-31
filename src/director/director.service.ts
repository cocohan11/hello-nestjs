import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { Director } from './entity/director.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { retry } from 'rxjs';

@Injectable()
export class DirectorService {


  // TypeORM 구현체 선언
  constructor(
    @InjectRepository(Director) 
    private readonly directorRepository: Repository<Director>,
  ) {}


  create(createDirectorDto: CreateDirectorDto) {
    const director = this.directorRepository.create(createDirectorDto);
    return this.directorRepository.save(director);
  }

  findAll() {
    return this.directorRepository.find();
  }

  async findOne(id: number) {
    const director = await this.directorRepository.findOne({
      where:{
        id,
      }
    })
    return director;
  }

  async update(id: number, updateDirectorDto: UpdateDirectorDto) {
    // 업데이트할 데이터 검색
    const director = await this.directorRepository.findOne({
      where:{
        id,
      }
    })
    // 예외처리
    if(!director) {
      throw new NotFoundException('존재하지 않는 ID의 감독입니다!');
    }
    // 업데이트
    await this.directorRepository.update(
      {
        id // 조건절 (WHERE id = :id)
      },
      {
        ...updateDirectorDto, // 업데이트할 데이터 (SET name = :name, dob = :dob, nationality = :nationality)
      }
    )
    // 업데이트 한 값 리턴
    const newDirector = await this.directorRepository.findOne({
      where: {
        id,
      }
    })
    return newDirector;
  }

  async remove(id: number) {
    // 삭제할 데이터 검색
    const director = await this.directorRepository.findOne({
      where: {
        id,
      },
    })
    // 예외처리
    if (!director) {
      throw new NotFoundException('존재하지 않는 ID값의 감독입니다!')
    }
    //삭제
    await this.directorRepository.delete(id);
    return id;
  }
}
