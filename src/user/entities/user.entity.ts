import { Exclude } from "class-transformer";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum Role {
    admin, // 0
    paidUser, // 1
    user, // 2
}

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude({ toPlainOnly: true }) // 응답할 때 
    password: string;

    @Column({
        enum: Role,
        default: Role.user,
    })
    role: Role;
}
