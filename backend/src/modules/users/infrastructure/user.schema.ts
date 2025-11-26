// backend/src/modules/users/infrastructure/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../domain/role.enum';

@Schema({ collection: 'users' })
export class UserDocument extends Document {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, index: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ type: [String], enum: Role, default: [] })
  roles!: Role[];

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
