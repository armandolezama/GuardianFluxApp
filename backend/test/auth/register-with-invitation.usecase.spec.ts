// backend/test/auth/register-with-invitation.usecase.spec.ts

import { Invitation } from '../../src/modules/invitations/domain/invitation.entity';
import { InvitationStatus } from '../../src/modules/invitations/domain/invitation-status.enum';
import { InvitationRepository } from '../../src/modules/invitations/domain/invitation.repository';
import {
  InvitationAlreadyUsedError,
  InvitationExpiredError,
} from '../../src/modules/invitations/domain/errors';
import { User } from '../../src/modules/users/domain/user.entity';
import { UserRepository } from '../../src/modules/users/domain/user.repository';
import { EmailAlreadyInUseError } from '../../src/modules/users/domain/errors';
import { Account } from '../../src/modules/accounts/domain/account.entity';
import { AccountRepository } from '../../src/modules/accounts/domain/account.repository';
import { RegisterWithInvitationUseCase } from '../../src/modules/auth/application/register-with-invitation.usecase';
import { ValidateInvitationUseCase } from '../../src/modules/invitations/application/validate-invitation.usecase';

// Repos in-memory para TDD

class InMemoryInvitationRepository implements InvitationRepository {
  private map = new Map<string, Invitation>();

  async findByCode(code: string): Promise<Invitation | null> {
    return this.map.get(code) ?? null;
  }

  async save(invitation: Invitation): Promise<void> {
    this.map.set(invitation.code, invitation);
  }

  add(invitation: Invitation) {
    this.map.set(invitation.code, invitation);
  }
}

class InMemoryUserRepository implements UserRepository {
  private byEmail = new Map<string, User>();

  async findByEmail(email: string): Promise<User | null> {
    return this.byEmail.get(email) ?? null;
  }

  async save(user: User): Promise<void> {
    this.byEmail.set(user.email, user);
  }

  getByEmail(email: string) {
    return this.byEmail.get(email) ?? null;
  }
}

class InMemoryAccountRepository implements AccountRepository {
  public accounts: Account[] = [];

  async save(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  findByUserId(userId: string): Account | undefined {
    return this.accounts.find((a) => a.userId === userId);
  }
}

// “Servicios” auxiliares

class FakePasswordHasher {
  async hash(password: string): Promise<string> {
    return `hashed-${password}`;
  }
}

class FakeIdGenerator {
  private counter = 1;
  nextId(): string {
    return `id-${this.counter++}`;
  }
}

class FakeAccountNumberGenerator {
  private counter = 1000;
  generate(): string {
    return `ACC-${this.counter++}`;
  }
}

describe('RegisterWithInvitationUseCase', () => {
  let invitationRepo: InMemoryInvitationRepository;
  let userRepo: InMemoryUserRepository;
  let accountRepo: InMemoryAccountRepository;
  let validateInvitation: ValidateInvitationUseCase;
  let useCase: RegisterWithInvitationUseCase;
  const now = new Date('2025-01-01T12:00:00Z');

  beforeEach(() => {
    invitationRepo = new InMemoryInvitationRepository();
    userRepo = new InMemoryUserRepository();
    accountRepo = new InMemoryAccountRepository();

    validateInvitation = new ValidateInvitationUseCase(
      invitationRepo,
      () => now,
    );

    useCase = new RegisterWithInvitationUseCase(
      validateInvitation,
      invitationRepo,
      userRepo,
      accountRepo,
      new FakePasswordHasher(),
      new FakeIdGenerator(),
      new FakeAccountNumberGenerator(),
      () => now,
    );
  });

  it('debería registrar usuario y cuenta con invitación válida', async () => {
    const expiresAt = new Date('2025-01-10T00:00:00Z');

    const invitation = new Invitation({
      id: 'inv-1',
      code: 'INV-OK',
      email: 'armando@example.com',
      role: 'CUSTOMER',
      status: InvitationStatus.PENDING,
      expiresAt,
      usedAt: null,
      createdByUserId: 'admin-1',
      createdAt: new Date('2024-12-31T00:00:00Z'),
    });

    invitationRepo.add(invitation);

    const result = await useCase.execute({
      code: 'INV-OK',
      name: 'Armando',
      email: 'armando@example.com',
      password: 'secret123',
    });

    expect(result.user.email).toBe('armando@example.com');
    expect(result.user.roles).toContain('CUSTOMER');
    expect(result.account.balance).toBe(0);
    expect(result.account.currency).toBe('MXN');

    const storedUser = userRepo.getByEmail('armando@example.com');
    expect(storedUser).toBeTruthy();
    expect(storedUser?.passwordHash).toBe('hashed-secret123');

    const account = accountRepo.findByUserId(result.user.id);
    expect(account).toBeTruthy();

    const updatedInvitation = await invitationRepo.findByCode('INV-OK');
    expect(updatedInvitation?.status).toBe(InvitationStatus.USED);
  });

  it('debería fallar si la invitación está expirada', async () => {
    const expiresAt = new Date('2024-12-31T00:00:00Z');

    const invitation = new Invitation({
      id: 'inv-2',
      code: 'INV-EXP',
      email: 'laura@example.com',
      role: 'CUSTOMER',
      status: InvitationStatus.PENDING,
      expiresAt,
      usedAt: null,
      createdByUserId: 'admin-1',
      createdAt: new Date('2024-12-01T00:00:00Z'),
    });

    invitationRepo.add(invitation);

    await expect(
      useCase.execute({
        code: 'INV-EXP',
        name: 'Laura',
        email: 'laura@example.com',
        password: 'secret',
      }),
    ).rejects.toBeInstanceOf(InvitationExpiredError);
  });

  it('debería fallar si la invitación ya está usada', async () => {
    const expiresAt = new Date('2025-01-10T00:00:00Z');

    const invitation = new Invitation({
      id: 'inv-3',
      code: 'INV-USED',
      email: 'used@example.com',
      role: 'CUSTOMER',
      status: InvitationStatus.USED,
      expiresAt,
      usedAt: new Date('2024-12-31T23:59:59Z'),
      createdByUserId: 'admin-1',
      createdAt: new Date('2024-12-01T00:00:00Z'),
    });

    invitationRepo.add(invitation);

    await expect(
      useCase.execute({
        code: 'INV-USED',
        name: 'Pepe',
        email: 'used@example.com',
        password: 'secret',
      }),
    ).rejects.toBeInstanceOf(InvitationAlreadyUsedError);
  });

  it('debería fallar si el email ya existe', async () => {
    // Usuario existente
    const existingUser = new User({
      id: 'user-1',
      name: 'Someone',
      email: 'exists@example.com',
      passwordHash: 'hashed-pass',
      roles: ['CUSTOMER'],
      createdAt: new Date('2024-12-01T00:00:00Z'),
    });
    await userRepo.save(existingUser);

    const expiresAt = new Date('2025-01-10T00:00:00Z');

    const invitation = new Invitation({
      id: 'inv-4',
      code: 'INV-EMAIL',
      email: 'exists@example.com',
      role: 'CUSTOMER',
      status: InvitationStatus.PENDING,
      expiresAt,
      usedAt: null,
      createdByUserId: 'admin-1',
      createdAt: new Date('2024-12-31T00:00:00Z'),
    });

    invitationRepo.add(invitation);

    await expect(
      useCase.execute({
        code: 'INV-EMAIL',
        name: 'New User',
        email: 'exists@example.com',
        password: 'secret',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });
});
