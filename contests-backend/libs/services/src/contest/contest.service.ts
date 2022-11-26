import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contest, ContestDocument } from '@libs/domain';
import { NlpParsingService, ParsedContent } from '@libs/nlp-parsing';

@Injectable()
export class ContestService {
    constructor(
        @InjectModel(Contest.name, 'contests')
        private contestModel: Model<ContestDocument>,
        @Inject(NlpParsingService)
        private readonly nlpParsingService: NlpParsingService,
    ) {}

    async findAll(): Promise<Contest[]> {
        return await this.contestModel.find().exec();
    }

    async deleteById(id: string): Promise<boolean> {
        await this.contestModel.deleteOne({ _id: id });
        return true;
    }

    async contestFromPage(path: string): Promise<Contest> {
        const { content, links, time, name } =
            await this.nlpParsingService.parseHTML(path);
        const parsedContent: ParsedContent =
            await this.nlpParsingService.parseContent(content);
        const contest = new this.contestModel({
            name,
            time,
            links,
            ...parsedContent,
        });
        return contest.save();
    }
}
