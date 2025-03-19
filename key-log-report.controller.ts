import { Controller, Get, HttpCode, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { KeyLogListFilterDto } from '@packages/dto/care/key-log/key-log-list-filter.dto';
import { ApiErrorResponseType } from '@packages/dto/core';
import { PaginationDto } from '@packages/dto/core/pagination.dto';

import { Pagination } from '@packages/decorators/pagination.decorator';
import { ENUMS } from '@packages/enums';
import { ResponseService } from '@packages/services';

import { KeyLogReportService } from './key-log-report.service';
import ApiOperationSummaryEnum = ENUMS.ApiOperationDescEnum;
import { FastifyReply } from 'fastify';
import { PuppeteerClusterService } from '@packages/services/puppeteer-cluster.service';

@ApiTags('Medication: key-log-report')
@ApiResponse({ type: ApiErrorResponseType, description: 'Centralized error response with various error codes' })
@ApiBearerAuth()
@Controller('key-log-report')
export class KeyLogReportController {
    constructor(
        private readonly keyLogReportService: KeyLogReportService,
        private readonly responseService: ResponseService,
        private readonly puppeteerClusterService: PuppeteerClusterService,
    ) {}

    @ApiOperation({ description: ApiOperationSummaryEnum.AT_AUTHENTICATED, summary: 'Find key log report' })
    @HttpCode(HttpStatus.OK)
    @Get('')
    find(@Query() paginationFilter: KeyLogListFilterDto, @Pagination() pagination: PaginationDto) {
        const res = this.keyLogReportService.find(paginationFilter, pagination);
        return this.responseService.toPosfResponse(HttpStatus.OK, 'Fetch success', paginationFilter.page, paginationFilter.limit, res);
    }
    @ApiOperation({ description: ApiOperationSummaryEnum.HR_AUTHENTICATED, summary: 'Download key-log report' })
    @HttpCode(HttpStatus.OK)
    @Get('download')
    async downloadKeyLogReport(
        @Query() paginationFilter: KeyLogListFilterDto,
        @Pagination() pagination: PaginationDto,
        @Res() res: FastifyReply,
    ) {
        const html = await this.keyLogReportService.downloadKeyLogReport(paginationFilter,pagination);
        const pdfBuffer = await this.puppeteerClusterService.generatePdf(html);
        await this.puppeteerClusterService.closeWhenFinished();

        res.headers({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=`key-log-report.pdf`',
            'Content-Length': pdfBuffer.length,
        }).send(pdfBuffer);
    }
}
