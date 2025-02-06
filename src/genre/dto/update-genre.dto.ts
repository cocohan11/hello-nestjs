import { PartialType } from '@nestjs/mapped-types';
import { CreateGenreDto } from './create-genre.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {

    // @IsOptional()
    // @IsString()
    // name?: string;

}
