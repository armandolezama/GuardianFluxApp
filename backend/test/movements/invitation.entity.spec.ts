import { Invitation } from '../../src/modules/invitations/domain/invitation.entity';
import { InvitationStatus } from '../../src/modules/invitations/domain/invitation-status.enum';

describe('Invitation entity', () => {
  const baseProps = {
    id: 'inv-1',
    code: 'INV-TEST',
    email: 'test@example.com',
    role: 'CUSTOMER',
    createdByUserId: 'admin-1',
    createdAt: new Date('2024-12-31T00:00:00Z'),
  };

  it('debería detectar invitación expirada', () => {
    const expiresAt = new Date('2024-12-31T23:59:59Z');
    const now = new Date('2025-01-01T00:00:00Z');

    const invitation = new Invitation({
      ...baseProps,
      status: InvitationStatus.PENDING,
      expiresAt,
      usedAt: null,
    });

    expect(invitation.isExpired(now)).toBe(true);
  });

  it('debería detectar invitación no expirada', () => {
    const expiresAt = new Date('2025-01-10T00:00:00Z');
    const now = new Date('2025-01-01T00:00:00Z');

    const invitation = new Invitation({
      ...baseProps,
      status: InvitationStatus.PENDING,
      expiresAt,
      usedAt: null,
    });

    expect(invitation.isExpired(now)).toBe(false);
  });

  it('debería detectar invitación usada', () => {
    const expiresAt = new Date('2025-01-10T00:00:00Z');

    const invitation = new Invitation({
      ...baseProps,
      status: InvitationStatus.USED,
      expiresAt,
      usedAt: new Date('2025-01-01T00:00:00Z'),
    });

    expect(invitation.isUsed()).toBe(true);
  });
});
