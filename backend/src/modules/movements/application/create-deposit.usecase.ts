import { AccountRepository } from '../../accounts/domain/account.repository';
import { MovementRepository } from '../domain/movement.repository';
import { Movement } from '../domain/movement.entity';
import { MovementType } from '../domain/movement-type.enum';
import {
  DestinationAccountNotFoundError,
  InsufficientFundsError,
} from '../domain/errors';

export interface IdGenerator {
  nextId(): string;
}

interface CreateDepositInput {
  originAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  description?: string;
}

interface CreateDepositOutput {
  originAccount: {
    accountNumber: string;
    balance: number;
  };
  destinationAccount: {
    accountNumber: string;
    balance: number;
  };
}

export class CreateDepositUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly movementRepository: MovementRepository,
    private readonly idGenerator: IdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: CreateDepositInput): Promise<CreateDepositOutput> {
    const { originAccountNumber, destinationAccountNumber, amount, description } =
      input;

    const origin = await this.accountRepository.findByAccountNumber(originAccountNumber);
    const dest = await this.accountRepository.findByAccountNumber(destinationAccountNumber);

    if (!origin || !dest) {
      throw new DestinationAccountNotFoundError();
    }

    if (!origin.canDebit(amount)) {
      throw new InsufficientFundsError();
    }

    const now = this.nowProvider();

    // actualizar saldos
    origin.debit(amount);
    dest.credit(amount);

    await this.accountRepository.save(origin);
    await this.accountRepository.save(dest);

    // crear movimientos vinculados
    const outId = this.idGenerator.nextId();
    const inId = this.idGenerator.nextId();

    const outMovement = new Movement({
      id: outId,
      accountId: origin.id,
      type: MovementType.DEPOSIT_OUT,
      amount,
      currency: origin.currency,
      description,
      createdAt: now,
      relatedMovementId: inId,
      counterpartyAccountId: dest.id,
    });

    const inMovement = new Movement({
      id: inId,
      accountId: dest.id,
      type: MovementType.DEPOSIT_IN,
      amount,
      currency: dest.currency,
      description,
      createdAt: now,
      relatedMovementId: outId,
      counterpartyAccountId: origin.id,
    });

    await this.movementRepository.save(outMovement);
    await this.movementRepository.save(inMovement);

    return {
      originAccount: {
        accountNumber: origin.accountNumber,
        balance: origin.balance,
      },
      destinationAccount: {
        accountNumber: dest.accountNumber,
        balance: dest.balance,
      },
    };
  }
}
