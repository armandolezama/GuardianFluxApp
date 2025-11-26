// backend/src/modules/accounts/infrastructure/account-mongo.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountRepository } from '../domain/account.repository';
import { Account } from '../domain/account.entity';
import { AccountDocument } from './account.schema';

@Injectable()
export class MongoAccountRepository implements AccountRepository {
  constructor(
    @InjectModel(AccountDocument.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  private toDomain(doc: AccountDocument): Account {
    return new Account({
      id: doc.id,
      userId: doc.userId,
      accountNumber: doc.accountNumber,
      balance: doc.balance,
      currency: doc.currency,
      createdAt: doc.createdAt,
    });
  }

  private toPersistence(account: Account) {
    return {
      id: account.id,
      userId: account.userId,
      accountNumber: account.accountNumber,
      balance: account.balance,
      currency: account.currency,
      createdAt: account.createdAt,
    };
  }

  async save(account: Account): Promise<void> {
    const data = this.toPersistence(account);
    await this.accountModel
      .updateOne({ id: data.id }, { $set: data }, { upsert: true })
      .exec();
  }

  async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    const doc = await this.accountModel.findOne({ accountNumber }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findById(id: string): Promise<Account | null> {
    const doc = await this.accountModel.findOne({ id }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByUserId(userId: string): Promise<Account[]> {
    const docs = await this.accountModel.find({ userId }).exec();
    return docs.map((d) => this.toDomain(d));
  }
}
