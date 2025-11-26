// backend/src/modules/movements/infrastructure/movement-mongo.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovementRepository } from '../domain/movement.repository';
import { Movement } from '../domain/movement.entity';
import { MovementDocument } from './movement.schema';

@Injectable()
export class MongoMovementRepository implements MovementRepository {
  constructor(
    @InjectModel(MovementDocument.name)
    private readonly movementModel: Model<MovementDocument>,
  ) {}

  private toDomain(doc: MovementDocument): Movement {
    return new Movement({
      id: doc.id,
      accountId: doc.accountId,
      type: doc.type,
      amount: doc.amount,
      currency: doc.currency,
      description: doc.description,
      createdAt: doc.createdAt,
      relatedMovementId: doc.relatedMovementId,
      counterpartyAccountId: doc.counterpartyAccountId,
    });
  }

  private toPersistence(m: Movement) {
    return {
      id: m.id,
      accountId: m.accountId,
      type: m.type,
      amount: m.amount,
      currency: m.currency,
      description: m.description,
      createdAt: m.createdAt,
      relatedMovementId: m.relatedMovementId,
      counterpartyAccountId: m.counterpartyAccountId,
    };
  }

  async save(movement: Movement): Promise<void> {
    const data = this.toPersistence(movement);
    await this.movementModel
      .updateOne({ id: data.id }, { $set: data }, { upsert: true })
      .exec();
  }

  async findAll(): Promise<Movement[]> {
    const docs = await this.movementModel.find().exec();
    return docs.map((d) => this.toDomain(d));
  }

  // opcional, por si luego completas la interfaz
  async findByAccountId?(accountId: string): Promise<Movement[]> {
    const docs = await this.movementModel.find({ accountId }).exec();
    return docs.map((d) => this.toDomain(d));
  }
}
