import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContestDocument = Contest & Document;

@Schema()
export class Contest {
  @Prop()
  name: string;
}

export const ContestSchema = SchemaFactory.createForClass(Contest);
