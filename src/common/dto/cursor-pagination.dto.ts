import { IsIn, IsInt, IsOptional } from "class-validator";

export class CursorPaginationDto {

    @IsInt()
    @IsOptional()
    id?: number;

    @IsIn(['ASC', 'DESC'])
    @IsOptional()
    order: 'ASC' | 'DESC' = 'DESC' // 기본값이 디센딩이다. 

    @IsInt()
    @IsOptional()
    take: number = 5; // 디폴트 갯수
}