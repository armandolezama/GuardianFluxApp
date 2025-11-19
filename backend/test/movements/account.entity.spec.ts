import { Account } from '../../src/modules/accounts/domain/account.entity';

describe('Account entity', () => {
  const baseProps = {
    id: 'acc-1',
    userId: 'user-1',
    accountNumber: 'ACC-TEST',
    currency: 'MXN',
    createdAt: new Date('2025-01-01T00:00:00Z'),
  };

  it('debería permitir canDebit si hay saldo suficiente', () => {
    const acc = new Account({
      ...baseProps,
      balance: 500,
    });

    expect(acc.canDebit(300)).toBe(true);
    expect(acc.canDebit(500)).toBe(true);
    expect(acc.canDebit(501)).toBe(false);
  });

  it('debería debitar y acreditar correctamente', () => {
    const acc = new Account({
      ...baseProps,
      balance: 1000,
    });

    acc.debit(200);
    expect(acc.balance).toBe(800);

    acc.credit(150);
    expect(acc.balance).toBe(950);
  });
});
