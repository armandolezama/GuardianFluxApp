// backend/src/modules/users/infrastructure/user-mongo.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';
import { UserDocument } from './user.schema';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  private toDomain(doc: UserDocument): User {
    return new User({
      id: doc.id,
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      roles: doc.roles,
      createdAt: doc.createdAt,
    });
  }

  private toPersistence(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      roles: user.roles,
      createdAt: user.createdAt,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async save(user: User): Promise<void> {
    const data = this.toPersistence(user);
    await this.userModel
      .updateOne({ id: data.id }, { $set: data }, { upsert: true })
      .exec();
  }
}
