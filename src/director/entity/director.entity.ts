import { BaseTable } from "src/common/entity/base.entity";
import { Movie } from "src/movie/entity/movie.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Director extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    dob: Date;

    @Column()
    nationality: string;

    @OneToMany(
        () => Movie,
        movie => movie.director, // 왜 id를 참조하지 않지? -> Movie객체의 director 속성을 가리킴
    ) // 디렉터1 : 영화N 이고 디렉터클래스라서 One이먼저옴
    movies: Movie[];
}
