import { IsNotEmpty, isNotEmpty } from "class-validator";

export class CreateMovieDto {

     @IsNotEmpty()
     title: string;

     @IsNotEmpty()
     genre: string;
}