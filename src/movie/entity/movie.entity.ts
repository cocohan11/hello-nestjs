import { Exclude, Expose } from "class-transformer";

@Exclude()
export class Moive {

    @Expose()
    id: number;
    
    @Expose()
    title: string;

    // @Exclude() // 직렬화, 역직렬화할 때 노출X // 보안에 민감할 때 
    genre: string;

    @Expose()
    get description() {
        return '영화존잼';
    }
}