import { AccountRepository } from '../../accounts/domain/account.repository';
import { MovementRepository } from '../domain/movement.repository';
import { Movement } from '../domain/movement.entity';
import { MovementType } from '../domain/movement-type.enum';
import { InsufficientFundsError } from '../domain/errors';

export interface IdGenerator {
  nextId(): string;
}

interface CreateWithdrawalInput {
  accountId: string;
  amount: number;
  description?: string;
}

interface CreateWithdrawalOutput {
  account: {
    id: string;
    balance: number;
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
    const { accountId, amount, description } = input;

    // Para este UC, asumimos que ya tienes cargada la cuenta por fuera
    // o que extenderás AccountRepository con findById para producción.
    // En pruebas usamos directamente el helper del in-memory repo.
    // En producción: añadir método findById y usarlo aquí.

    // @ts-expect-error: en tests usamos un repo con método auxiliar
    const account = this.accountRepository.getById
      ? await (this.accountRepository as any).getById(accountId)
      : null;

    if (!account) {
      throw new Error('Account not found'); // si quieres puedes crear error específico
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
      },
    };
  }
}
