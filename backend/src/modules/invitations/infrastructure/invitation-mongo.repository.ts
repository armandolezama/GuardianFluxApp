// backend/src/modules/invitations/infrastructure/invitation-mongo.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvitationRepository } from '../domain/invitation.repository';
import { Invitation } from '../domain/invitation.entity';
import { InvitationDocument } from './invitation.schema';

@Injectable()
export class MongoInvitationRepository implements InvitationRepository {
  constructor(
    @InjectModel(InvitationDocument.name)
    private readonly invitationModel: Model<InvitationDocument>,
  ) {}

  private toDomain(doc: InvitationDocument): Invitation {
    return new Invitation({
      id: doc.id,
      code: doc.code,
      email: doc.email,
      role: doc.role,
      status: doc.status,
      expiresAt: doc.expiresAt,
      usedAt: doc.usedAt,
      createdByUserId: doc.createdByUserId,
      createdAt: doc.createdAt,
    });
  }

  private toPersistence(inv: Invitation) {
    return {
      id: inv.id,
      code: inv.code,
      email: inv.email,
      role: inv.role,
      status: inv.status,
      expiresAt: inv.expiresAt,
      usedAt: inv.usedAt,
      createdByUserId: inv.createdByUserId,
      createdAt: inv.createdAt,
    };
  }

  async findByCode(code: string): Promise<Invitation | null> {
    const doc = await this.invitationModel.findOne({ code }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async save(invitation: Invitation): Promise<void> {
    const data = this.toPersistence(invitation);
    await this.invitationModel
      .updateOne({ id: data.id }, { $set: data }, { upsert: true })
      .exec();
  }

  async findAll(): Promise<Invitation[]> {
    const docs = await this.invitationModel.find().exec();
    return docs.map((d) => this.toDomain(d));
  }
}
