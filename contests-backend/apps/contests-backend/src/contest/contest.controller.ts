import { Body, Controller, Delete, Get, Inject, Post } from '@nestjs/common';
import { ContestService } from '@lib/services';
import { Contest } from '@libs/domain';
import { NlpParsingService } from '@libs/nlp-parsing';

@Controller('contests')
export class ContestController {
    @Inject(NlpParsingService)
    private readonly nlpParsingService: NlpParsingService;

    constructor(private readonly contestService: ContestService) {}

    // @Get('test')
    // async test(): Promise<any> {
    //     return await this.nlpParsingService.parseHTML(
    //         'http://knvsh.gov.spb.ru/contests/view/375/',
    //     );
    // }

    @Get()
    async getContests(): Promise<Contest[]> {
        return await this.contestService.findAll();
    }

    @Post('parse')
    async createContest(@Body() body): Promise<Contest> {
        return await this.contestService.contestFromPage(body.path);
    }

    @Delete('delete')
    async deleteContest(@Body() body) {
        return await this.contestService.deleteById(body.id);
    }
}
