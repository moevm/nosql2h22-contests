import { Module } from '@nestjs/common';
import { ContestService } from './contest';

@Module({
    providers: [ContestService],
    exports: [ContestService],
})
export class ServicesModule {}
