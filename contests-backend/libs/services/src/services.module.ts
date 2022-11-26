import { Module } from '@nestjs/common';
import { ContestService } from './contest';
import { NlpParsingModule } from '@libs/nlp-parsing';
import { DomainModule } from '@libs/domain';

@Module({
    imports: [NlpParsingModule, DomainModule],
    providers: [ContestService],
    exports: [ContestService],
})
export class ServicesModule {}
