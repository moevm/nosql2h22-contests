import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { entities } from './entities';

@Module({
    imports: [MongooseModule.forFeature(entities)],
    providers: [],
    exports: [],
})
export class DomainModule {}
