import { Exclude, Expose, Transform } from "class-transformer";
import { ChildEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn, VersionColumn } from "typeorm";
import { BaseTable } from "./base.entity";
import { MovieDetail } from "./movie-detail.entity";


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
        () => MovieDetail
    )
    @JoinColumn()
    detail: string;
}
