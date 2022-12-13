import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from './entities';
import { generateTestData } from '../../../scripts/generate-test-data';
import * as process from 'process';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGODB_URL, {
            connectionName: 'contests',
        }),
        MongooseModule.forFeature(
            entities.map((entity) => ({
                name: entity.name,
                schema: entity.schema,
            })),
            'contests',
        ),
    ],
    providers: [],
    exports: [
        MongooseModule.forRoot(process.env.MONGODB_URL, {
            connectionName: 'contests',
        }),
        MongooseModule.forFeature(
            entities.map((entity) => ({
                name: entity.name,
                schema: entity.schema,
            })),
            'contests',
        ),
    ],
})
export class DomainModule {
    constructor() {
        if (process.env.RUN_SCRIPT) generateTestData();
    }
}
