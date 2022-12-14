import {
    Body,
    Controller,
    Delete,
    Get,
    Header, HttpCode,
    HttpException,
    HttpStatus,
    Inject,
    ParseIntPipe,
    Post, Put,
    Query,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ContestService } from '@lib/services';
import { Contest } from '@libs/domain';
import { NlpParsingService } from '@libs/nlp-parsing';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { SortOrder } from 'mongoose';
import { UpdateContestDto } from '../../../../libs/domain/src/dto/update-contest.dto';

@Controller('contests')
export class ContestController {
    @Inject(NlpParsingService)
    private readonly nlpParsingService: NlpParsingService;
    @Inject(ContestService) private readonly contestService: ContestService;

    @Post('import')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('file'))
    async import(@UploadedFile() file: Express.Multer.File): Promise<boolean> {
        if (file.mimetype !== 'application/json')
            throw new HttpException(
                'Файл должен быть типа json',
                HttpStatus.BAD_REQUEST,
            );
        const data = JSON.parse(file.buffer.toString()).map((x) => {
            delete x.__v;
            delete x._id;
            return x;
        });
        await this.contestService.saveAll(data);
        return true;
    }

    @Header('Content-Type', 'application/json')
    @Header('Content-Disposition', 'attachment; filename="data.json"')
    @Get('export')
    @HttpCode(HttpStatus.OK)
    async getFile(): Promise<StreamableFile> {
        return new StreamableFile(
            Buffer.from(
                JSON.stringify(await this.contestService.findAll(0, 0)),
            ),
        );
    }

    @Get('cityCount')
    @HttpCode(HttpStatus.OK)
    async fieldCount(
        @Query('count', ParseIntPipe) count: number,
        @Query('sort') sort: SortOrder,
    ) {
        return await this.contestService.popularCities(count, sort);
    }

    @Get('formatStat')
    @HttpCode(HttpStatus.OK)
    async formatStat(@Query('sort') sort: SortOrder) {
        return await this.contestService.formatStat(sort);
    }

    @Put('upsert')
    @HttpCode(HttpStatus.OK)
    async updateContest(@Body() dto: UpdateContestDto): Promise<void>{
        await this.contestService.upsertContest(dto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getContests(
        @Query('count', ParseIntPipe) count: number,
        @Query('page', ParseIntPipe) page: number,
        @Query('filter') filter?: string,
    ): Promise<Contest[]> {
        return await this.contestService.findAll(page, count, filter);
    }

    @Get('count')
    @HttpCode(HttpStatus.OK)
    async contestsCount(): Promise<number> {
        return await this.contestService.count();
    }

    @Post('parse')
    @HttpCode(HttpStatus.OK)
    async createContest(@Body('link') link: string): Promise<Contest> {
        if (!link.match(/http:\/\/knvsh.gov.spb.ru\/contests\/view\/.*/g))
            throw new HttpException(
                'Ссылка должна начинаться с: http://knvsh.gov.spb.ru/contests/view/',
                HttpStatus.BAD_REQUEST,
            );
        return await this.contestService.contestFromPage(link);
    }

    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    async deleteContest(@Body('id') id) {
        return await this.contestService.deleteById(id);
    }

    @Delete('deleteAll')
    @HttpCode(HttpStatus.OK)
    async deleteAll() {
        return await this.contestService.deleteAll();
    }
}
