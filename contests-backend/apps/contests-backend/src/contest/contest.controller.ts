import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ContestService } from '@lib/services';
import { Contest } from '@libs/domain';

@Controller('contests')
export class ContestController {
    constructor(private readonly contestService: ContestService) {}

    @Get()
    async getContests(): Promise<Contest[]> {
        return await this.contestService.findAll();
    }

    @Post('create')
    async createContest(@Body() createContestDto): Promise<Contest> {
        return await this.contestService.create(createContestDto);
    }

    @Delete('delete')
    async deleteContest(@Body() body) {
        return await this.contestService.deleteById(body.id);
    }
}
