import {
    Body,
    Controller,
    Delete,
    Get,
    Header,
    HttpException,
    HttpStatus,
    Inject,
    ParseIntPipe,
    Post,
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

@Controller('contests')
export class ContestController {
    @Inject(NlpParsingService)
    private readonly nlpParsingService: NlpParsingService;
    @Inject(ContestService) private readonly contestService: ContestService;

    @Post('import')
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
    async getFile(): Promise<StreamableFile> {
        return new StreamableFile(
            Buffer.from(
                JSON.stringify(await this.contestService.findAll(0, 0)),
            ),
        );
    }

    @Get()
    async getContests(
        @Query('count', ParseIntPipe) count: number,
        @Query('page', ParseIntPipe) page: number,
        @Query('filter') filter?: string,
    ): Promise<Contest[]> {
        return await this.contestService.findAll(page, count, filter);
    }

    @Post('parse')
    async createContest(@Body('link') link: string): Promise<Contest> {
        if (!link.match(/http:\/\/knvsh.gov.spb.ru\/contests\/view\/.*/g))
            throw new HttpException(
                'Ссылка должна начинаться с: http://knvsh.gov.spb.ru/contests/view/',
                HttpStatus.BAD_REQUEST,
            );
        return await this.contestService.contestFromPage(link);
    }

    @Delete('delete')
    async deleteContest(@Body('id') id) {
        return await this.contestService.deleteById(id);
    }

    @Delete('deleteAll')
    async deleteAll() {
        return await this.contestService.deleteAll();
    }
}
