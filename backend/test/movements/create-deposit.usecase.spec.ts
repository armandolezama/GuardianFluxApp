import { Account } from '../../src/modules/accounts/domain/account.entity';
import { AccountRepository } from '../../src/modules/accounts/domain/account.repository';
import { Movement } from '../../src/modules/movements/domain/movement.entity';
import { MovementRepository } from '../../src/modules/movements/domain/movement.repository';
import { MovementType } from '../../src/modules/movements/domain/movement-type.enum';
import {
  DestinationAccountNotFoundError,
  InsufficientFundsError,
} from '../../src/modules/movements/domain/errors';
import { CreateDepositUseCase } from '../../src/modules/movements/application/create-deposit.usecase';

// Repos in-memory

class InMemoryAccountRepository implements AccountRepository {
  private accounts: Account[] = [];

  async save(account: Account): Promise<void> {
    const idx = this.accounts.findIndex(a => a.id === account.id);
    if (idx === -1) this.accounts.push(account);
    else this.accounts[idx] = account;
  }

  async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    return this.accounts.find(a => a.accountNumber === accountNumber) ?? null;
  }

  add(account: Account) {
    this.accounts.push(account);
  }

  getByNumber(accountNumber: string) {
    return this.accounts.find(a => a.accountNumber === accountNumber);
  }
}

class InMemoryMovementRepository implements MovementRepository {
  public movements: Movement[] = [];

  async save(movement: Movement): Promise<void> {
    this.movements.push(movement);
  }
}

// Generadores fake

class FakeIdGenerator {
  private counter = 1;
  nextId(): string {
    return `mov-${this.counter++}`;
  }
}

describe('CreateDepositUseCase', () => {
  let accountRepo: InMemoryAccountRepository;
  let movementRepo: InMemoryMovementRepository;
  let useCase: CreateDepositUseCase;
  const now = new Date('2025-01-01T12:00:00Z');

  beforeEach(() => {
    accountRepo = new InMemoryAccountRepository();
    movementRepo = new InMemoryMovementRepository();
    useCase = new CreateDepositUseCase(
      accountRepo,
      movementRepo,
      new FakeIdGenerator(),
      () => now,
    );
  });

  it('debería realizar un depósito exitoso entre cuentas', async () => {
    const origin = new Account({
      id: 'acc-1',
      userId: 'user-1',
      accountNumber: 'ACC-ORIG',
      balance: 1000,
      currency: 'MXN',
      createdAt: now,
    });
    const dest = new Account({
      id: 'acc-2',
      userId: 'user-2',
      accountNumber: 'ACC-DEST',
      balance: 300,
      currency: 'MXN',
      createdAt: now,
    });

    accountRepo.add(origin);
    accountRepo.add(dest);

    const result = await useCase.execute({
      originAccountNumber: 'ACC-ORIG',
      destinationAccountNumber: 'ACC-DEST',
      amount: 200,
      description: 'Pago renta',
    });

    const updatedOrigin = accountRepo.getByNumber('ACC-ORIG')!;
    const updatedDest = accountRepo.getByNumber('ACC-DEST')!;

    expect(updatedOrigin.balance).toBe(800);
    expect(updatedDest.balance).toBe(500);

    expect(movementRepo.movements).toHaveLength(2);
    const [outMov, inMov] = movementRepo.movements;

    expect(outMov.type).toBe(MovementType.DEPOSIT_OUT);
    expect(inMov.type).toBe(MovementType.DEPOSIT_IN);
    expect(outMov.amount).toBe(200);
    expect(inMov.amount).toBe(200);
    expect(outMov.relatedMovementId).toBe(inMov.id);
    expect(inMov.relatedMovementId).toBe(outMov.id);

    expect(result.originAccount.balance).toBe(800);
    expect(result.destinationAccount.balance).toBe(500);
  });

  it('debería fallar si la cuenta destino no existe', async () => {
    const origin = new Account({
      id: 'acc-1',
      userId: 'user-1',
      accountNumber: 'ACC-ORIG',
      balance: 1000,
      currency: 'MXN',
      createdAt: now,
    });
    accountRepo.add(origin);

    await expect(
      useCase.execute({
        originAccountNumber: 'ACC-ORIG',
        destinationAccountNumber: 'ACC-NO-EXISTS',
        amount: 200,
      }),
    ).rejects.toBeInstanceOf(DestinationAccountNotFoundError);
  });

  it('debería fallar si no hay saldo suficiente', async () => {
    const origin = new Account({
      id: 'acc-1',
      userId: 'user-1',
      accountNumber: 'ACC-ORIG',
      balance: 100,
      currency: 'MXN',
      createdAt: now,
    });
    const dest = new Account({
      id: 'acc-2',
      userId: 'user-2',
      accountNumber: 'ACC-DEST',
      balance: 300,
      currency: 'MXN',
      createdAt: now,
    });

    accountRepo.add(origin);
    accountRepo.add(dest);

    await expect(
      useCase.execute({
        originAccountNumber: 'ACC-ORIG',
        destinationAccountNumber: 'ACC-DEST',
        amount: 200,
      }),
    ).rejects.toBeInstanceOf(InsufficientFundsError);
  });
});
