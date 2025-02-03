import { PartialType } from '@nestjs/mapped-types';
import { CreateGenreDto } from './create-genre.dto';
import { IsOptional } from 'class-validator';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {

    @IsOptional()
    name?: string;

}
