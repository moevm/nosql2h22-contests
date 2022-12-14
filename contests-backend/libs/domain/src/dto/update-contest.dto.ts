import { Link } from '@libs/nlp-parsing';
import { FORMAT, Requirements } from '../entities/contest.schema';

export class UpdateContestDto {
    link: string;
    name?: string;
    dateFrom?: Date;
    dateTo?: Date;
    prize?: string;
    reporting?: string;
    format?: FORMAT;
    requirements?: string;
    city?: string;
    links?: string;
}
