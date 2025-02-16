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

    applyCursorPaginationParamsToQbk<T>(qb: SelectQueryBuilder<T>, dto: CursorPaginationDto) {
        const { cursor, order, take } = dto;

        // 다음 페이지 요청
        if (cursor) {
            
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
    }
}