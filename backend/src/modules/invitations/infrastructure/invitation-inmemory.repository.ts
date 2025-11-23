import { Injectable } from '@nestjs/common';
import { InvitationRepository } from '../domain/invitation.repository';
import { Invitation } from '../domain/invitation.entity';
import { InvitationStatus } from '../domain/invitation-status.enum';
import { Role } from '../../users/domain/role.enum';

const initialInvitations = [
  {
    id: 'inv-1',
    code: 'INV-USER1',
    email: 'admin-1@example.com',
    role: Role.ADMIN,
    status: InvitationStatus.PENDING,
    // expiresAt: () => {},// Insert future result,
    usedAt: null,
    createdByUserId: 'admin-1',
    // createdAt: () => {},// Insert future result,,
  },
  {
    id: 'inv-2',
    code: 'INV-USER2',
    email: 'costumer-1@example.com',
    role: Role.CUSTOMER,
    status: InvitationStatus.PENDING,
    // expiresAt: future,
    usedAt: null,
    createdByUserId: 'admin-1',
    // createdAt: now,
  },
    {
    id: 'inv-3',
    code: 'INV-USER3',
    email: 'monitor-1@example.com',
    role: Role.MONITOR,
    status: InvitationStatus.PENDING,
    // expiresAt: future,
    usedAt: null,
    createdByUserId: 'admin-1',
    // createdAt: now,
  },

];

@Injectable()
export class InMemoryInvitationRepository implements InvitationRepository {
  private invitations = new Map<string, Invitation>();

  constructor() {
  const now = new Date();
  const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 días

  const invs = initialInvitations.map((inv) => {
    return new Invitation({
      id: inv.id,
      code: inv.code,
      email: inv.email,
      role: inv.role,
      status: inv.status,
      expiresAt: future,
      usedAt: inv.usedAt,
      createdByUserId: inv.createdByUserId,
      createdAt: now,
    });
  });

  for(const inv of invs) {
    this.invitations.set(inv.code, inv);
  }
}


  async findByCode(code: string): Promise<Invitation | null> {
    return this.invitations.get(code) ?? null;
  }

  async save(invitation: Invitation): Promise<void> {
    this.invitations.set(invitation.code, invitation);
  }
}
