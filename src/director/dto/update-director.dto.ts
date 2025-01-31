import { PartialType } from '@nestjs/mapped-types';
import { CreateDirectorDto } from './create-director.dto';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDirectorDto {

    @IsOptional()
    name?: string;

    @IsDateString()
    @IsOptional()
    dob?: Date;

    @IsOptional()
    nationality?: string;
}
