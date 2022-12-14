import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Contest, ContestDocument } from '@libs/domain';
import { NlpParsingService, ParsedContent } from '@libs/nlp-parsing';
import * as moment from 'moment/moment';
import { UpdateContestDto } from '../../../domain/src/dto/update-contest.dto';

const MONTHS = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
];

export class PopularCity {
    city: string;

    count: number;
}

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

    async formatStat(sort: SortOrder = 'desc'): Promise<any> {
        const pipelines: any[] = [
            { $match: { format: { $exists: true } } },
            {
                $group: {
                    _id: { format: '$format' },
                    count: { $count: {} },
                },
            },
        ];
        const data = await this.contestModel
            .aggregate(pipelines)
            .sort({ count: sort })
            .exec();
        return data.map((x) => ({ format: x._id.format, count: x.count }));
    }

    async popularCities(
        count: number,
        sort: SortOrder = 'desc',
    ): Promise<PopularCity[]> {
        const data = this.contestModel
            .aggregate([
                { $match: { city: { $exists: true } } },
                {
                    $group: {
                        _id: { city: '$city' },
                        count: { $count: {} },
                    },
                },
            ])
            .sort({ count: sort });
        if (count > 0) data.limit(count);
        return (await data.exec()).map((x) => ({
            city: x._id.city,
            count: x.count,
        }));
    }

    async upsertContest(dto: UpdateContestDto): Promise<void> {
        await this.contestModel.collection.updateOne(
            { link: dto.link },
            { $set: dto },
            {
                upsert: true,
            },
        );
    }

    async saveAll(contests: Contest[]): Promise<boolean> {
        for (const contest of contests)
            await this.upsertContest(contest);
        return true;
    }

    async contestFromPage(path: string): Promise<any> {
        const contest = await this.contestModel.collection.findOne({
            link: path,
        });
        if (contest) return contest;
        const { content, links, time, name } =
            await this.nlpParsingService.parseHTML(path);
        // const parsedContent: ParsedContent =
        //     await this.nlpParsingService.parseContent(content);
        const dateData = time
            .matchAll(
                /с (\d\d?) ([а-яА-Я]+) (\d{4}) г\. до (\d\d?) ([а-яА-Я]+) (\d{4}) г\. \(включительно\)/g,
            )
            .next().value;
        return new this.contestModel({
            link: path,
            city: 'Санкт-Петербург',
            name,
            dateFrom: moment
                .utc(
                    `${dateData[1]} ${
                        MONTHS.findIndex((x) => x === dateData[2]) + 1
                    } ${dateData[3]}`,
                    'DD MM YYYY',
                )
                .toDate(),
            dateTo: moment
                .utc(
                    `${dateData[4]} ${
                        MONTHS.findIndex((x) => x === dateData[5]) + 1
                    } ${dateData[6]}`,
                    'DD MM YYYY',
                )
                .toDate(),
            links,
            // ...parsedContent,
        }).save();
        //return contest.save();
    }
}
