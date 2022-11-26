import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from './entities';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://root:root@localhost:27017', {
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
        MongooseModule.forFeature(
            entities.map((entity) => ({
                name: entity.name,
                schema: entity.schema,
            })),
            'contests',
        ),
        MongooseModule.forRoot('mongodb://root:root@localhost:27017', {
            connectionName: 'contests',
        }),
    ],
})
export class DomainModule {}

// ...entities.map((entity) => ({
//     provide: getModelToken(entity.name),
//     useValue: entity.model,
// })),
