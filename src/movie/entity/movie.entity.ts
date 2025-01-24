import { Exclude, Expose, Transform } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";


@Entity() // “이 클래스는 데이터베이스 테이블이야!”
export class Movie {
    @PrimaryGeneratedColumn() //오토인크리먼트
    id: number;

    @Column()
    title: string;
    
    @Column()
    genre: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @VersionColumn()
    version: number; 

    age: number;

}