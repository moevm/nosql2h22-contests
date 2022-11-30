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

    async deleteAll() {
        await this.contestModel.collection.deleteMany({});
    }

    async findAll(
        page: number,
        count: number,
        filter?: string,
    ): Promise<Contest[]> {
        return await this.contestModel
            .find({ name: { $regex: new RegExp(`.*${filter || ''}.*`, 'i') } })
            .skip(page * count)
            .limit(count)
            .exec();
    }

    async deleteById(id: string): Promise<boolean> {
        await this.contestModel.deleteOne({ _id: id });
        return true;
    }

    async count(): Promise<number> {
        return await this.contestModel.collection.count();
    }

    async saveAll(contests: Contest[]): Promise<boolean> {
        for (const contest of contests) {
            await this.contestModel.collection.updateOne(
                { link: contest.link },
                { $set: contest },
                {
                    upsert: true,
                },
            );
        }
        return true;
    }

    async contestFromPage(path: string): Promise<any> {
        const contest = await this.contestModel.collection.findOne({
            link: path,
        });
        if (contest) return contest;
        const { content, links, time, name } =
            await this.nlpParsingService.parseHTML(path);
        const parsedContent: ParsedContent =
            await this.nlpParsingService.parseContent(content);
        return new this.contestModel({
            link: path,
            city: 'Санкт-Петербург',
            name,
            time,
            links,
            ...parsedContent,
        }).save();
        //return contest.save();
    }
}
