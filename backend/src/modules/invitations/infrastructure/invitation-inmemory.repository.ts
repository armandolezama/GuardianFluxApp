import { Injectable } from '@nestjs/common';
import { InvitationRepository } from '../domain/invitation.repository';
import { Invitation } from '../domain/invitation.entity';
import { InvitationStatus } from '../domain/invitation-status.enum';

@Injectable()
export class InMemoryInvitationRepository implements InvitationRepository {
  private invitations = new Map<string, Invitation>();

  constructor() {
  const now = new Date();
  const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 días

  const inv1 = new Invitation({
    id: 'inv-1',
    code: 'INV-USER1',
    email: 'user1@example.com',
    role: 'CUSTOMER',
    status: InvitationStatus.PENDING,
    expiresAt: future,
    usedAt: null,
    createdByUserId: 'admin-1',
    createdAt: now,
  });

  const inv2 = new Invitation({
    id: 'inv-2',
    code: 'INV-USER2',
    email: 'user2@example.com',
    role: 'CUSTOMER',
    status: InvitationStatus.PENDING,
    expiresAt: future,
    usedAt: null,
    createdByUserId: 'admin-1',
    createdAt: now,
  });

  this.invitations.set(inv1.code, inv1);
  this.invitations.set(inv2.code, inv2);
}


  async findByCode(code: string): Promise<Invitation | null> {
    return this.invitations.get(code) ?? null;
  }

  async save(invitation: Invitation): Promise<void> {
    this.invitations.set(invitation.code, invitation);
  }
}
