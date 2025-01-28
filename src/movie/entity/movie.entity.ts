import { Exclude, Expose, Transform } from "class-transformer";
import { ChildEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn, VersionColumn } from "typeorm";


export class BaseEntity {
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @VersionColumn()
    version: number; 
}


@Entity()
export class Movie extends BaseEntity {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column()
    title: string;
    
    @Column() 
    genre: string;
}
