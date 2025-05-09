import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReportDocument = HydratedDocument<Report>;

@Schema()
export class Report {
  @Prop({ required: true })
  report: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
