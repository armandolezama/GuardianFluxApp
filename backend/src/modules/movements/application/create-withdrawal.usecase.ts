import { AccountRepository } from '../../accounts/domain/account.repository';
import { MovementRepository } from '../domain/movement.repository';
import { Movement } from '../domain/movement.entity';
import { MovementType } from '../domain/movement-type.enum';
import { InsufficientFundsError, AccountNotFoundError, UnauthorizedAccountAccessError } from '../domain/errors';

export interface IdGenerator {
  nextId(): string;
}

interface CreateWithdrawalInput {
  accountId: string;
  amount: number;
  description?: string;
  requestedByUserId: string;
}


interface CreateWithdrawalOutput {
  account: {
    id: string;
    balance: number;
    currency: string;
  };
}

export class CreateWithdrawalUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly movementRepository: MovementRepository,
    private readonly idGenerator: IdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: CreateWithdrawalInput): Promise<CreateWithdrawalOutput> {
    const { accountId, amount, description, requestedByUserId } = input;

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new AccountNotFoundError();
    }

    if (account.userId !== requestedByUserId) {
      throw new UnauthorizedAccountAccessError();
    }

    if (!account.canDebit(amount)) {
      throw new InsufficientFundsError();
    }

    const now = this.nowProvider();

    account.debit(amount);
    await this.accountRepository.save(account);

    const movement = new Movement({
      id: this.idGenerator.nextId(),
      accountId: account.id,
      type: MovementType.WITHDRAW,
      amount,
      currency: account.currency,
      description,
      createdAt: now,
    });

    await this.movementRepository.save(movement);

    return {
      account: {
        id: account.id,
        balance: account.balance,
        currency: account.currency,
      },
    };
  }
}
