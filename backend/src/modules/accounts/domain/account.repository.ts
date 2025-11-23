import { Account } from './account.entity';

export interface AccountRepository {
  save(account: Account): Promise<void>;
  findByAccountNumber(accountNumber: string): Promise<Account | null>;
  findById(id: string): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account[]>;
}
