import { Contest, ContestSchema } from './contest.schema';

export * from './contest.schema';

export const entities = [{ name: Contest.name, schema: ContestSchema }];
