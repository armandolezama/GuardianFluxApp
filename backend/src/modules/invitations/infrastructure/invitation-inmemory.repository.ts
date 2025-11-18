import { Injectable } from '@nestjs/common';
import { InvitationRepository } from '../domain/invitation.repository';
import { Invitation } from '../domain/invitation.entity';
import { InvitationStatus } from '../domain/invitation-status.enum';

@Injectable()
export class InMemoryInvitationRepository implements InvitationRepository {
  private invitations = new Map<string, Invitation>();

  constructor() {
    // Semilla de ejemplo para probar la API
    const now = new Date();
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 días

    const demo = new Invitation({
      id: 'inv-demo',
      code: 'INV-DEMO',
      email: 'demo@example.com',
      role: 'CUSTOMER',
      status: InvitationStatus.PENDING,
      expiresAt: future,
      usedAt: null,
      createdByUserId: 'admin-1',
      createdAt: now,
    });

    this.invitations.set(demo.code, demo);
  }

  async findByCode(code: string): Promise<Invitation | null> {
    return this.invitations.get(code) ?? null;
  }

  async save(invitation: Invitation): Promise<void> {
    this.invitations.set(invitation.code, invitation);
  }
}
