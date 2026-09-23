import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SurveyDocument = Survey & Document;

@Schema({ _id: false })
export class SurveyScores {
  @Prop({ required: true })
  exhaustion: number;

  @Prop({ required: true })
  cynicism: number;

  @Prop({ required: true })
  efficacy: number;
}

@Schema({ timestamps: true })
export class Survey {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  birthYear: number;

  @Prop({ type: [Number], required: true })
  answers: number[];

  @Prop({ type: SurveyScores, required: true })
  scores: SurveyScores;

  @Prop({ required: true })
  level: number; // 0: Normal, 1: Moderate Risk, 2: High Burnout

  @Prop()
  adviceTitle?: string;

  @Prop()
  adviceBody?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);

// Index cho truy vấn aggregation thống kê nhanh hơn
SurveySchema.index({ createdAt: -1 });
SurveySchema.index({ level: 1 });
