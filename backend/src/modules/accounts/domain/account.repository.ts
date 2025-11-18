// backend/src/modules/accounts/domain/account.repository.ts

import { Account } from './account.entity';

export interface AccountRepository {
  save(account: Account): Promise<void>;
}
