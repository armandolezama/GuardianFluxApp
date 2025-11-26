// backend/src/modules/invitations/infrastructure/invitation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../users/domain/role.enum';
import { InvitationStatus } from '../domain/invitation-status.enum';

@Schema({ collection: 'invitations' })
export class InvitationDocument extends Document {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true, unique: true })
  code!: string;

  @Prop()
  email!: string;

  @Prop({ type: String, enum: Role, required: true })
  role!: Role;

  @Prop({ type: String, enum: InvitationStatus, default: InvitationStatus.PENDING })
  status!: InvitationStatus;

  @Prop({ type: Date, required: true })
  expiresAt!: Date;

  @Prop({ type: Date, default: null })
  usedAt!: Date | null;

  @Prop({ required: true })
  createdByUserId!: string;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(InvitationDocument);
