import { Injectable } from "@nestjs/common";
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
        const { order, take, id } = dto;

        if (id) {
            const direction = order === 'ASC' ? '>' : '<';

            // order -> ASC : movid.id > :id
            // :id
            qb.where(`${qb.alias}.id ${direction} :id`, {id});
        }

        qb.orderBy(`${qb.alias}.id`, order);
        qb.take(take);
    }
}