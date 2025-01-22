import { Exclude, Expose, Transform } from "class-transformer";

export class Moive {
    id: number;
    title: string;
    @Transform(
        ({value}) => value.toString().toUpperCase(),
    )
    genre: string;
}