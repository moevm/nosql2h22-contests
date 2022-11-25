import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contest, ContestDocument } from '@libs/domain';

@Injectable()
export class ContestService {
    constructor(
        @InjectModel(Contest.name) private contestModel: Model<ContestDocument>,
    ) {}

    async create(createCatDto): Promise<Contest> {
        const createdContest = new this.contestModel(createCatDto);
        return createdContest.save();
    }

    async findAll(): Promise<Contest[]> {
        return await this.contestModel.find().exec();
    }

    async deleteById(id: string): Promise<boolean> {
        await this.contestModel.deleteOne({ _id: id });
        return true;
    }
}
