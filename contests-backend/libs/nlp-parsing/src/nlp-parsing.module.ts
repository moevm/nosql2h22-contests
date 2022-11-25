import { Module } from '@nestjs/common';
import { NlpParsingService } from './nlp-parsing.service';

@Module({
    providers: [NlpParsingService],
    exports: [NlpParsingService],
})
export class NlpParsingModule {}
