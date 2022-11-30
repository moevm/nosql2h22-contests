import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from './entities';

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
export class DomainModule {}
