// backend/src/modules/accounts/infrastructure/account.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'accounts' })
export class AccountDocument extends Document {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ required: true, unique: true })
  accountNumber!: string;

  @Prop({ required: true })
  balance!: number;

  @Prop({ required: true })
  currency!: string;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

export const AccountSchema = SchemaFactory.createForClass(AccountDocument);
