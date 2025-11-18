import { Account } from '../../src/modules/accounts/domain/account.entity';
import { AccountRepository } from '../../src/modules/accounts/domain/account.repository';
import { Movement } from '../../src/modules/movements/domain/movement.entity';
import { MovementRepository } from '../../src/modules/movements/domain/movement.repository';
import { MovementType } from '../../src/modules/movements/domain/movement-type.enum';
import { InsufficientFundsError } from '../../src/modules/movements/domain/errors';
import { CreateWithdrawalUseCase } from '../../src/modules/movements/application/create-withdrawal.usecase';

class InMemoryAccountRepository implements AccountRepository {
  private accounts: Account[] = [];

  async save(account: Account): Promise<void> {
    const idx = this.accounts.findIndex(a => a.id === account.id);
    if (idx === -1) this.accounts.push(account);
    else this.accounts[idx] = account;
  }

  async findByAccountNumber(): Promise<Account | null> {
    // retiro se hará por accountId o por algo que tú elijas;
    // aquí no lo usamos, así que puedes lanzar error si se llama.
    throw new Error('Not implemented for this test');
  }

  add(account: Account) {
    this.accounts.push(account);
  }

  getById(id: string) {
    return this.accounts.find(a => a.id === id);
  }
}

class InMemoryMovementRepository implements MovementRepository {
  public movements: Movement[] = [];
  async save(movement: Movement): Promise<void> {
    this.movements.push(movement);
  }
}

class FakeIdGenerator {
  private counter = 1;
  nextId(): string {
    return `mov-${this.counter++}`;
  }
}

describe('CreateWithdrawalUseCase', () => {
  let accountRepo: InMemoryAccountRepository;
  let movementRepo: InMemoryMovementRepository;
  let useCase: CreateWithdrawalUseCase;
  const now = new Date('2025-01-01T12:00:00Z');

  beforeEach(() => {
    accountRepo = new InMemoryAccountRepository();
    movementRepo = new InMemoryMovementRepository();
    useCase = new CreateWithdrawalUseCase(
      accountRepo,
      movementRepo,
      new FakeIdGenerator(),
      () => now,
    );
  });

  it('debería registrar un retiro exitoso', async () => {
    const acc = new Account({
      id: 'acc-1',
      userId: 'user-1',
      accountNumber: 'ACC-USER',
      balance: 500,
      currency: 'MXN',
      createdAt: now,
    });
    accountRepo.add(acc);

    const result = await useCase.execute({
      accountId: 'acc-1',
      amount: 200,
      description: 'Retiro cajero',
    });

    const updated = accountRepo.getById('acc-1')!;
    expect(updated.balance).toBe(300);

    expect(movementRepo.movements).toHaveLength(1);
    const mov = movementRepo.movements[0];
    expect(mov.type).toBe(MovementType.WITHDRAW);
    expect(mov.amount).toBe(200);

    expect(result.account.balance).toBe(300);
  });

  it('debería fallar si no hay saldo suficiente', async () => {
    const acc = new Account({
      id: 'acc-1',
      userId: 'user-1',
      accountNumber: 'ACC-USER',
      balance: 100,
      currency: 'MXN',
      createdAt: now,
    });
    accountRepo.add(acc);

    await expect(
      useCase.execute({
        accountId: 'acc-1',
        amount: 200,
      }),
    ).rejects.toBeInstanceOf(InsufficientFundsError);
  });
});
