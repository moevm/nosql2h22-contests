import { Module } from '@nestjs/common';
import { ContestController } from './contest/contest.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContestService } from './contest/contest.service';
import { Contest, ContestSchema } from './contest/contest.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:root@localhost:27017'),
    MongooseModule.forFeature([{ name: Contest.name, schema: ContestSchema }]),
  ],
  controllers: [ContestController],
  providers: [ContestService],
})
export class ContestsBackendModule {}
