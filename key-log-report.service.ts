import { Injectable } from '@nestjs/common';

import { Brackets } from 'typeorm';

import { KeyLogEntity } from '@packages/entities/public';

import { KeyLogListFilterDto } from '@packages/dto/care/key-log/key-log-list-filter.dto';
import { PaginationDto } from '@packages/dto/core/pagination.dto';

import { SystemException } from '@packages/exceptions';
import { getPostgreSort } from '@packages/postgre';
import { JwtRequestService, PublicDatabaseService } from '@packages/services';
import { generateKeylogReportPdf } from '@packages/pdf-templates/key-log-report/generate-key-log-pdf';

@Injectable()
export class KeyLogReportService {
    constructor(
        private readonly jwtRequestService: JwtRequestService,
        private readonly publicDatabaseService: PublicDatabaseService,
    ) {}

    async find(paginationFilter: KeyLogListFilterDto, pagination: PaginationDto): Promise<[KeyLogEntity[], number]> {
        try {
            const clientId = this.jwtRequestService.clientId(true);
            const branchId = this.jwtRequestService.branchId;
            const wingId = this.jwtRequestService.wingId;

            const query = this.publicDatabaseService.keyLogRepo
                .createQueryBuilder('key')
                .where('key.clientId = :clientId', { clientId })
                .andWhere(branchId ? 'key.branchId = :branchId' : '1 = 1', { wingId })
                .andWhere(wingId ? 'key.wingId = :wingId' : '1 = 1', { wingId })
                .leftJoinAndSelect('key.userInfo', 'userInfo')
                .leftJoinAndSelect('userInfo.profileInfo', 'profileInfo');

            const orderDto = getPostgreSort(paginationFilter.sort, paginationFilter.order);
            const [column, order] = Object.entries(orderDto)[0];
            query.addOrderBy(`key.${column}`, order.toUpperCase() as 'ASC' | 'DESC');

            if (paginationFilter.search) {
                const keyword = `%${paginationFilter.search.toLowerCase()}%`;
                query.andWhere(
                    new Brackets(qb => {
                        qb.where('userInfo.firstName ILIKE :keyword OR userInfo.lastName ILIKE :keyword', { keyword })
                            .orWhere("CONCAT(userInfo.firstName, ' ', userInfo.lastName) ILIKE :keyword", { keyword })
                            .orWhere('key.keyNumber ILIKE :keyword', { keyword });
                    }),
                );
            }

            return await Promise.all([query.clone().skip(pagination.skip).take(pagination.limit).getMany(), query.clone().getCount()]);
        } catch (error) {
            throw new SystemException(error);
        }
    }

    async downloadKeyLogReport(filterDto: KeyLogListFilterDto, pagination: PaginationDto): Promise<string> {
        try {
            const timeZone = this.jwtRequestService?.jwt?.timeZone || 'Europe/London';
            const data = await this.find(filterDto, pagination);

            return generateKeylogReportPdf(data[0], timeZone);
        } catch (e) {
            throw new SystemException(e);
        }
    }
}
