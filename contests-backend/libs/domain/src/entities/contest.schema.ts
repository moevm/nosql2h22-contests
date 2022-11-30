import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Link } from '@libs/nlp-parsing';

export type ContestDocument = Contest & Document;

@Schema()
export class Contest {
    constructor(data: Partial<Contest>) {
        Object.assign(this, data);
    }

    @Prop({ required: true, unique: true })
    link: string;
    @Prop({ required: true })
    name: string;
    @Prop({ required: false })
    documents: string;
    @Prop({ required: true })
    city: string;
    @Prop({ required: false })
    contacts?: string;
    @Prop({ required: false })
    format?: string;
    @Prop({ required: false })
    participants?: string;
    @Prop({ required: false })
    prizes?: string;
    @Prop({ required: false })
    purposes?: string;
    @Prop({ required: false })
    time?: string;
    @Prop({ required: false })
    links?: Link[];
}

export const ContestSchema = SchemaFactory.createForClass(Contest);
