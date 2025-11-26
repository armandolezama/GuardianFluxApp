// backend/test/invitations/validate-invitation.usecase.spec.ts

import { Invitation } from '../../src/modules/invitations/domain/invitation.entity';
import { InvitationStatus } from '../../src/modules/invitations/domain/invitation-status.enum';
import { InvitationRepository } from '../../src/modules/invitations/domain/invitation.repository';
import {
  InvitationAlreadyUsedError,
  InvitationExpiredError,
  InvitationNotFoundError,
} from '../../src/modules/invitations/domain/errors';
import { ValidateInvitationUseCase } from '../../src/modules/invitations/application/validate-invitation.usecase';
import { Role } from '../../src/modules/users/domain/role.enum';

class InMemoryInvitationRepository implements InvitationRepository {
  private invitations = new Map<string, Invitation>(); // key: code

  async findByCode(code: string): Promise<Invitation | null> {
    return this.invitations.get(code) ?? null;
  }

  async save(invitation: Invitation): Promise<void> {
    this.invitations.set(invitation.code, invitation);
  }

  async findAll(): Promise<Invitation[]> {
    return Array.from(this.invitations.values());
  }

  // helper para tests
  add(invitation: Invitation) {
    this.invitations.set(invitation.code, invitation);
  }
}

// backend/test/invitations/validate-invitation.usecase.spec.ts

describe('ValidateInvitationUseCase', () => {
  let repo: InMemoryInvitationRepository;
  let useCase: ValidateInvitationUseCase;
  const now = new Date('2025-01-01T12:00:00Z');

  beforeEach(() => {
    repo = new InMemoryInvitationRepository();
    useCase = new ValidateInvitationUseCase(repo, () => now); // inyectamos "clock" para test
  });

  it('debería validar una invitación PENDING no expirada', async () => {
    const expiresAt = new Date('2025-01-10T00:00:00Z');

    const invitation = new Invitation({
      id: 'inv-1',
      code: 'INV-123',
      email: 'user@example.com',
      role: Role .CUSTOMER,
      status: InvitationStatus.PENDING,
      expiresAt,
      usedAt: null,
      createdByUserId: 'admin-1',
      createdAt: new Date('2024-12-31T00:00:00Z'),
    });

    repo.add(invitation);

    const result = await useCase.execute({ code: 'INV-123' });

    expect(result.code).toBe('INV-123');
    expect(result.email).toBe('user@example.com');
    expect(result.role).toBe(Role.CUSTOMER);
    expect(result.status).toBe(InvitationStatus.PENDING);
    expect(result.expiresAt).toEqual(expiresAt);
  });

  it('debería fallar si la invitación no existe', async () => {
    await expect(
      useCase.execute({ code: 'INV-NOT-FOUND' }),
    ).rejects.toBeInstanceOf(InvitationNotFoundError);
  });

  it('debería fallar si la invitación está expirada', async () => {
    const expiresAt = new Date('2024-12-31T00:00:00Z'); // antes de "now"

    const invitation = new Invitation({
      id: 'inv-2',
      code: 'INV-EXP',
      email: 'exp@example.com',
      role: Role.CUSTOMER,
      status: InvitationStatus.PENDING,
      expiresAt,
      usedAt: null,
      createdByUserId: 'admin-1',
      createdAt: new Date('2024-12-01T00:00:00Z'),
    });

    repo.add(invitation);

    await expect(
      useCase.execute({ code: 'INV-EXP' }),
    ).rejects.toBeInstanceOf(InvitationExpiredError);
  });

  it('debería fallar si la invitación ya está usada', async () => {
    const expiresAt = new Date('2025-01-10T00:00:00Z');

    const invitation = new Invitation({
      id: 'inv-3',
      code: 'INV-USED',
      email: 'used@example.com',
      role: Role.CUSTOMER,
      status: InvitationStatus.USED,
      expiresAt,
      usedAt: new Date('2024-12-31T23:59:59Z'),
      createdByUserId: 'admin-1',
      createdAt: new Date('2024-12-01T00:00:00Z'),
    });

    repo.add(invitation);

    await expect(
      useCase.execute({ code: 'INV-USED' }),
    ).rejects.toBeInstanceOf(InvitationAlreadyUsedError);
  });
});

