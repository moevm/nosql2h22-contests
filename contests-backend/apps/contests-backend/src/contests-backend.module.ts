import { Module } from '@nestjs/common';
import { ContestController } from './contest';
import { ServicesModule } from '@lib/services';
import { NlpParsingModule } from '@libs/nlp-parsing';
import { DomainModule } from '@libs/domain';

@Module({
    imports: [ServicesModule, NlpParsingModule, DomainModule],
    controllers: [ContestController],
    providers: [],
})
export class ContestsBackendModule {}
