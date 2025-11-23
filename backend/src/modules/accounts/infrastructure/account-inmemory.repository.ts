import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../domain/account.repository';
import { Account } from '../domain/account.entity';

@Injectable()
export class InMemoryAccountRepository implements AccountRepository {
  private accounts: Account[] = [];

  async save(account: Account): Promise<void> {
    const idx = this.accounts.findIndex(a => a.id === account.id);
    if (idx === -1) this.accounts.push(account);
    else this.accounts[idx] = account;
  }

  async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    return this.accounts.find(a => a.accountNumber === accountNumber) ?? null;
  }

  async findById(id: string): Promise<Account | null> {
    return this.accounts.find(a => a.id === id) ?? null;
  }

  async findByUserId(userId: string): Promise<Account[]> {
    return this.accounts.filter(a => a.userId === userId);
  }
}
