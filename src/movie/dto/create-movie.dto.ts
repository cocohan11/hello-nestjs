import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMovieDto {

     @IsNotEmpty()
     @IsString()
     title: string;
     
     @IsNotEmpty()
     @IsString()
     detail: string;

     @IsNotEmpty()
     @IsNumber()  
     directorId: number;

     @IsNotEmpty()
     @IsArray()
     @IsNumber({},{each: true}) // 각각의 모든 요소가 number여야된다. 
     genreIds: number[];
}