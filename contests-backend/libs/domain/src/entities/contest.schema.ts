import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Link } from '@libs/nlp-parsing';

export type ContestDocument = Contest & Document;

export enum FORMAT {
    ONLINE = 'Онлайн',
    OFFLINE = 'Оффлайн',
}

export class Requirements {
    ageMax: number;

    ageMin: number;

    citizenship: string[];

    academicDegree: string[];
}

@Schema()
export class Contest {
    constructor(data: Partial<Contest>) {
        Object.assign(this, data);
    }

    @Prop({ required: true, unique: true })
    link: string;

    @Prop({ required: false })
    name: string;

    @Prop({ required: false })
    dateFrom: Date;

    @Prop({ required: false })
    dateTo: Date;

    @Prop({ required: false })
    prize: string[];

    @Prop({ required: false })
    reporting: string[];

    @Prop({ required: false })
    format: FORMAT;

    @Prop({ required: false })
    requirements: Requirements[];

    @Prop({ required: false })
    city: string;

    @Prop({ required: false })
    links: Link[];
}

export const ContestSchema = SchemaFactory.createForClass(Contest);
