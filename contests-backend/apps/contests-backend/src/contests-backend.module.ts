import { Module } from '@nestjs/common';
import { ContestController } from './contest';
import { ContestService, ServicesModule } from '@lib/services';
import { NlpParsingModule } from '@libs/nlp-parsing';
import { DomainModule } from '@libs/domain';

@Module({
    imports: [NlpParsingModule, ServicesModule, DomainModule],
    controllers: [ContestController],
    providers: [ContestService],
})
export class ContestsBackendModule {}
