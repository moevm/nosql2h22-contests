import { Module } from '@nestjs/common';
import { ContestController } from './contest';
import { MongooseModule } from '@nestjs/mongoose';
import { ContestService } from '@lib/services';

@Module({
    imports: [MongooseModule.forRoot('mongodb://root:root@localhost:27017')],
    controllers: [ContestController],
    providers: [ContestService],
})
export class ContestsBackendModule {}
