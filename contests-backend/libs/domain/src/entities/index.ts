import { Contest, ContestSchema } from './contest.schema';
import { Model } from 'mongoose';

export * from './contest.schema';

export const entities = [
    { name: Contest.name, schema: ContestSchema, model: Model<Contest> },
];
