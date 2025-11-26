// backend/src/modules/movements/infrastructure/movement.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MovementType } from '../domain/movement-type.enum';

@Schema({ collection: 'movements' })
export class MovementDocument extends Document {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true, index: true })
  accountId!: string;

  @Prop({ type: String, enum: MovementType, required: true })
  type!: MovementType;

  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true })
  currency!: string;

  @Prop()
  description?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;

  @Prop()
  relatedMovementId?: string;

  @Prop()
  counterpartyAccountId?: string;
}

export const MovementSchema = SchemaFactory.createForClass(MovementDocument);
