import { Module } from '@nestjs/common';
import { ContestService } from './contest';
import { DomainModule } from '@libs/domain';
import { NlpParsingModule } from '@libs/nlp-parsing';

@Module({
    imports: [DomainModule, NlpParsingModule],
    providers: [ContestService],
    exports: [ContestService],
})
export class ServicesModule {}
