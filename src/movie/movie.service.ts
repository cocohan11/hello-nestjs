import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Like, Repository } from 'typeorm';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from 'src/director/entity/director.entity';
import { Genre } from 'src/genre/entities/genre.entity';


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
    @InjectRepository(Genre) 
    private readonly genreRepository: Repository<Genre>, 
    private readonly dataSource: DataSource,
  ) {}
  

  async findAll(title: string) {
    const qb = await this.movieRepository.createQueryBuilder('movie')
    .leftJoinAndSelect('movie.director', 'director')
    .leftJoinAndSelect('movie.detail', 'detail')
    .leftJoinAndSelect('movie.genres', 'genres');
    // 제목이 있다면 다음 조건을 쿼리빌더에 덧붙이기
    if (title) {
      qb.where('movie.title LIKE :title', {title: `%${title}%`})
    }
    return await qb.getManyAndCount();

    // /// 나중에 title 필터 기능 추가하기
    // if (!title) {
    //     return [await this.movieRepository.find({
    //       relations: ['director', 'genres'] // 출력이안되네? 
    //     }), await this.movieRepository.count()]; // 데이터베이스 작업은 비동기이므로, 항상 async/await를 사용해야 함
    // }

    // return this.movieRepository.findAndCount({
    //   where:{
    //     title: Like(`%${title}%`)
    //   },
    //   relations: ['director']
    // })
    // // if (!title) {
    // //   return this.movies;
    // // }
    // // return this.movies.filter(m => m.title.startsWith(title)); // 검색처럼
  } 


  async findOne(id: number) {
    const movie = await this.movieRepository.createQueryBuilder('m')
    .leftJoinAndSelect('m.director', 'director')
    .leftJoinAndSelect('m.detail', 'detail')
    .leftJoinAndSelect('m.genres', 'genres')
    .where('m.id = :id', {id})
    .getOne();

    // const movie = await this.movieRepository.findOne({
    //   where:{
    //     id,
    //   },
    //   relations: ['detail', 'director', 'genres']
    // })
     
    if(!movie) {
      throw new NotFoundException('존재하지않는 ID 값의 영화입니다!');
    }
    return movie;
  }


  async create(createMovieDto: CreateMovieDto) {
    const qr = this.dataSource.createQueryRunner(); // 트랜잭션 만들 때 사용
    await qr.connect();
    await qr.startTransaction();

    // 트랜잭션 사용 틀 
    // try {
    //   await qr.commitTransaction();
    // } catch (e) {
    //   qr.rollbackTransaction();
    //   throw e;
    // } finally {
    //   await qr.release(); // db pool에 되돌려줘야됨. 안그러면 물고있을 수 있음음
    // }
    try {
      // 영화만들기 전에 감독/장르르부터 존재여부확인
      const director = await qr.manager.findOne(Director, { // repository대신 테이블넣어줌줌
        where:{
          id:createMovieDto.directorId
        }
      });
      const genres = await qr.manager.find(Genre, { // 여러 개
        where:{
          id: In(createMovieDto.genreIds), // 리스트로 값을 넣으면, 리스트에 해당되는 모든 ids를 다 찾는다.
        }
      });
      // 예외처리
      if (!director) {
        throw new NotFoundException('존재하지 않는 ID의 감독입니다!');
      }
      if (genres.length !== createMovieDto.genreIds.length) { // 전송한 장르갯수와 실제DB에서 찾아낸 장르갯수가 같아야 함
        throw new NotFoundException(`존재하지 않는 ID의 장르입니다! 존재하는 ids -> ${genres.map(genre => genre.id).join(',')}`);
      }
      // 영화디테일 생성
      // const movieDetail = await this.movieDetailRepository.createQueryBuilder() // 이렇게 하면 롤백안됨
      const movieDetail = await qr.manager.createQueryBuilder() 
      .insert()
      .into(MovieDetail)
      .values({
        detail: createMovieDto.detail,
      })
      .execute();
      
      // throw new NotFoundException('일부러 에러 던짐 ');
      const movieDetailId = movieDetail.identifiers[0].id; // 생성한 영화디테일일 id를 받아냄
      
      // 영화 생성
      const movie = await qr.manager.createQueryBuilder()
      .insert()
      .into(Movie)
      .values({
        title: createMovieDto.title,
        detail: {
          id: movieDetailId,
        },
        director,
        genres,
      })
      .execute();
      const movieId = movie.identifiers[0].id; // 생성한 영화 id를 받아냄
      
      //--Many to Many 직접 설정하기--
      // 이 코드는 movie_genres_genre 테이블에 movieId와 genreId 쌍을 여러 개 삽입하는 작업을 수행
      await qr.manager.createQueryBuilder()
      .relation(Movie, 'genres') // -> Movie 엔티티의 genres 필드(관계)를 대상으로
      .of(movieId) // -> 특정 movieId를 가진 영화에
      .add(genres.map(genre => genre.id)); // -> 선택된 장르들의 id를 연결(중간 테이블에 관계 데이터 추가)

      // 커밋!
      await qr.commitTransaction();

      // (커밋 후) 찾아서 반환
      return await this.movieRepository.findOne({ // 커밋이후라서 repository 냅두기
        where: {
          id: movieId,
        },
        relations: ['detail', 'director', 'genres'],
      })
      
    } catch (e) {
      qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release(); // db pool에 되돌려줘야됨. 안그러면 물고있을 수 있음음
    }

    // const movie = await this.movieRepository.save({
    //   title: createMovieDto.title,
    //   // genre: createMovieDto.genre,
    //   genres,
    //   detail: {
    //     detail: createMovieDto.detail,
    //   },
    //   director,
    // });
    
    // return movie;
  }


  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const qr = this.dataSource.createQueryRunner(); // 트랜잭션 만들 때 사용
    await qr.connect();
    await qr.startTransaction();
    // 트랜잭션 사용 틀 
    try {
      // movie + movieDetail
      const movie = await qr.manager.findOne(Movie, {
        where:{
          id,
        }, 
        relations: ['detail', 'genres']
      })
      // 예외처리
      if(!movie) {
        throw new NotFoundException('존재하지않는 ID 값의 영화입니다!');
      }
      // 데이터 쪼갬
      const { detail, directorId, genreIds, ...movieRest } = updateMovieDto;
      // console.log(typeof movieRest.title); // boolean
      let newDirector;
      // directorId를 수정할 경우, 
      if (directorId) {
        // 먼저 그 감독의 존재여부 확인
        const director = await qr.manager.findOne(Director, {
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
      // DTO로 받은 장르ids 모두 찾기
      let newGenres;
      if (genreIds) {
        const genres = await qr.manager.find(Genre, {
          where: {
            id: In(genreIds), // 리스트 안의 값들을 다 찾는다. 
          },
        });
        // 예외 처리
        if (genres.length !== updateMovieDto.genreIds.length) { // 전송한 장르갯수와 실제DB에서 찾아낸 장르갯수가 같아야 함
          throw new NotFoundException(`존재하지 않는 ID의 장르입니다! 존재하는 ids -> ${genres.map(genre => genre.id).join(',')}`);
        }
        // newGenres에 값 대입
        newGenres = genres;
      }

      // movieUpdateFields는 업데이트할 영화 데이터를 담는 객체
      // 1. movieRest: UpdateMovieDto에서 detail과 directorId를 제외한 나머지 필드들
      // 2. 새로운 감독(newDirector)이 있다면 director 필드에 추가
      const movieUpdateFields = {
        ...movieRest,
        ...(newDirector && {director: newDirector})
      }

      //  Director 테이블 업뎃
      await qr.manager.createQueryBuilder()
      .update(Movie)
      .set(movieUpdateFields)
      .where('id = :id', {id})
      .execute();
      
      // throw new NotFoundException('일부러 에러 던짐 ');
      
      // await this.movieRepository.update(
      //   {id},
      //   movieUpdateFields
      // );
      // movieDetail 테이블 업뎃
      if (detail) {
        await qr.manager.createQueryBuilder()
        .update(MovieDetail)
        .set({detail})
        .where('id = :id', {id: movie.detail.id})
        .execute()
      }
      // if (detail) {
      //   await this.movieDetailRepository.update(
      //     {
      //       id: movie.detail.id, // movieDetail테이블의 id를 넣어야됨 주의
      //     },
      //     {
      //       detail,
      //     }
      //   )
      // }
      // 업뎃한 영화 조회 
      if (newGenres) {
        await qr.manager.createQueryBuilder()
        .relation(Movie, 'genres')
        .of(id)
        .addAndRemove(newGenres.map(genre => genre.id), movie.genres.map(genre => genre.id)); // 바꿔치기
        
      }
      // const newMovie = await this.movieRepository.findOne({
      //   where:{
      //     id,
      //   },
      //   relations: ['detail', 'director', 'genres']
      // })
      // // Movie-Genre 조인테이블 수정 
      // newMovie.genres = newGenres;
      // await this.movieRepository.save(newMovie);  // update대신 save를 써야 함
      // // 왜 장르를 저장안하지? 
      // // -> 아, 장르를 수정하는게 아니라 연결된 장르 id만 수정하는거니까, 조인테이블을 수정해야되는구나. 
      // // 조인테이블은 Movie Entity에 저장되어있기 때문에 MovieRepository를 불러와서 save하는 것 같다. 

      // return newMovie;  // 강사와 다르지만, 위에서 'genres'와 join했고 새로운 값으로 대체했기 때문에 밑에서 다시 findOne()쿼리요청해서 리턴안해도됨됨
      // // return this.movieRepository.preload(newMovie);
      
      // 커밋!
      await qr.commitTransaction();

      // 리턴!
      return this.movieRepository.findOne({
        where: {
          id,
        },
        relations: ['detail', 'director', 'genres']
      })
    } catch (e) {
      qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release(); // db pool에 되돌려줘야됨. 안그러면 물고있을 수 있음음
    }
    
    

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
    await this.movieRepository.createQueryBuilder()
    .delete()
    .where('id = :id', {id})
    .execute();
    // await this.movieRepository.delete(id);
    await this.movieDetailRepository.delete(movie.detail.id)
    return id;
  }
}


