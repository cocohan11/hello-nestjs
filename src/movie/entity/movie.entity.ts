import { Exclude, Expose, Transform } from "class-transformer";
import { ChildEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn, VersionColumn } from "typeorm";
import { BaseTable } from "../../common/entity/base.entity";
import { MovieDetail } from "./movie-detail.entity";
import { Director } from "src/director/entity/director.entity";


/// OneToOne  MovieDetail -> 영화는 하나의 상세한 내용을 가질 수 있음
/// ManyToOne  Director -> 감독은 여러개의 영화를 만들 수 있음
/// ManyToMany  Genre -> 영화는 여러개 장르를, 장르는 여러개의 영화에 속할 수 있음음


@Entity()
export class Movie extends BaseTable {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column()
    title: string;
    
    @Column() 
    genre: string;

    @OneToOne(
        () => MovieDetail, // 관계를 맺을 엔티티 타입
        movieDetail => movieDetail.id, // 대상 엔티티의 참조 속성 // 생략 가능(?)
        {
            cascade: true // 케스케이드 : (한 셋트로 만듦)
        }
    ) 
    @JoinColumn()
    detail: MovieDetail; // 단순 값(string, number 등)을 저장할 때는 @Column() 데코레이터를 사용하는데,
                         // Relationship을 가지려고할 땐 해당 클래스타입으로 써준다. 

    @ManyToOne(
        () => Director,
        director => director.id, // (생략가능)
    )
    director: Director;
}
