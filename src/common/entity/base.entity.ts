import { Exclude } from "class-transformer";
import { CreateDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";


export class BaseTable {
    @CreateDateColumn()
    @Exclude()
    reatedAt: Date;

    @UpdateDateColumn()
    @Exclude()
    updatedAt: Date;

    @VersionColumn()
    @Exclude() // 숨겨겨
    version: number; 
}
