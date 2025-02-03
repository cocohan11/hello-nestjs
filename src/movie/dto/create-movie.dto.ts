import { IsNotEmpty } from "class-validator";

export class CreateMovieDto {

     @IsNotEmpty()
     title: string;

     @IsNotEmpty()
     genreId: number;
     
     @IsNotEmpty()
     detail: string;

     @IsNotEmpty()
     directorId: number;
}