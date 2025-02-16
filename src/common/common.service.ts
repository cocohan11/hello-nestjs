import { BadRequestException, Injectable } from "@nestjs/common";
import { SelectQueryBuilder } from "typeorm";
import { PagePaginationDto } from "./dto/page-pagination.dto";
import { CursorPaginationDto } from "src/common/dto/cursor-pagination.dto";

@Injectable()
export class CommonService {
    constructor(){}

    applyPagePaginationParamsToQb<T>(qb: SelectQueryBuilder<T>, dto: PagePaginationDto) {
        const { page, take } = dto;
        const skip = (page - 1) * take;

        qb.take(take);
        qb.skip(skip);
    }

    async applyCursorPaginationParamsToQbk<T>(qb: SelectQueryBuilder<T>, dto: CursorPaginationDto) {
        let { cursor, order, take } = dto;

        // 다음 페이지 요청
        if (cursor) { // cursor로 덮어씌울거임 
            // {
            //     value: {
            //         id: 27
            //     },
            //     order: ['id_DESC']
            // }
            const decodedCursor = Buffer.from(cursor, 'base64').toString('utf-8'); // decode해서 보낸거 다시 해석
            const cursorObj = JSON.parse(decodedCursor);
            order = cursorObj.order;
            const { values } = cursorObj;

            // WHERE (column1 > value1)
            // OR   (column1 = value1 and column2 < value2)
            // OR   (column1 = value1 and column2 < value2 and column3 > value3)
            // ------------------------------------------------------
            // (column1, column2, column3) > (Value1, Value2, Value3)
            const columns = Object.keys(values);
            const comparisonOperator = order.some((o) => o.endsWith('DESC')) ? '<' : '>';
            const whereConditions = columns.map(c => `${qb.alias}.${c}`).join(',');
            const whereParams = columns.map(c => `:${c}`).join(',')

            // 쿼리빌더 -> (movie.likeCount, movie.id)< (:likeCount, :id)  
            qb.where(`(${whereConditions}) ${comparisonOperator} (${whereParams})`, values); 
        }

        // 첫 페이지 요청
        // ["likeCount_DESC", "id_DESC"]
        for (let i = 0; i < order.length; i++) {
            const [ column, directon ] = order[i].split('_');

            if (directon !== 'ASC' && directon !== 'DESC') {
                throw new BadRequestException('Order는 ASC / DESC 으로 입력해주세요!')
            }

            if (i === 0) {
                qb.orderBy(`${qb.alias}.${column}`, directon)
            } else {
                qb.addOrderBy(`${qb.alias}.${column}`, directon) // OR
            }
        }

        qb.take(take);

        // 우리도 커서를 가지고있어야 함
        const results = await qb.getMany();
        const nextCursor = this.generateNextCursor(results, order);
        
        return {qb, nextCursor}; // 프론트가 가짐 
    }

    
    generateNextCursor<T>(results: T[], order: string[]): string | null { // 응답받은 데이터 리스트 
        if (results.length === 0) return null;

        // {
        //     value: {
        //         id: 27
        //     },
        //     order: ['id_DESC']
        // }

        const lastItem = results[results.length - 1]; // 마지막값
        const values = {}

        order.forEach((columnOrder) => {
            const [column] = columnOrder.split('_') // id_DESC
            values[column] = lastItem[column];
        });

        const cursorObj = {values, order};
        const nextCursor = Buffer.from(JSON.stringify(cursorObj)).toString('base64');

        return nextCursor; // 한 줄 반환환
    }
}