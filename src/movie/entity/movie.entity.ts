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
@TableInheritance({
    column: {
        type: 'varchar',
        name: 'type' // type컬럼으로 자식클래스를 분류하겠다. 
    }
})
export class Content extends BaseEntity {
    @PrimaryGeneratedColumn() //오토인크리먼트
    id: number;

    @Column()
    title: string;
    
    @Column() 
    genre: string;
}


@ChildEntity()
export class Movie extends Content {
    @Column()
    runtime: number;
}


@ChildEntity()
export class Series extends Content {
    @Column()
    seriesCount: number;
}