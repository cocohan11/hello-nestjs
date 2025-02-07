import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {

  // TypeORM 구현체 선언
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
  ) {}


  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      }
    })
    // 예외처리
    if(!user) {
      throw new NotFoundException('존재하지 않는 ID의 유저입니다!');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      }
    })
    // 예외처리
    if(!user) {
      throw new NotFoundException('존재하지 않는 ID의 유저입니다!');
    }
    await this.userRepository.update(
      {id},
      {...updateUserDto},
    )
    // 업데이트 한 값 리턴
    const newUser = await this.userRepository.findOne({
      where: {
        id,
      }
    })
    return newUser;
  }

  async remove(id: number) {
    // 삭제할 데이터 검색
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    })
    // 예외처리
    if (!user) {
      throw new NotFoundException('존재하지 않는 ID의 유저입니다!');
    }
    //삭제
    await this.userRepository.delete(id);
    return id;  
  }
}
