import { Injectable, Inject } from '@nestjs/common';
import { InvitationRepository } from '../domain/invitation.repository';

export type ListInvitationsOutput = Array<{
  id: string;
  code: string;
  email: string;
  role: string;
  status: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdByUserId: string;
  createdAt: Date;
}>;

@Injectable()
export class ListInvitationsUseCase {
  constructor(
    @Inject('InvitationRepository')
    private readonly invitationRepo: InvitationRepository,
  ) {}

  async execute(): Promise<ListInvitationsOutput> {
    const invitations = await this.invitationRepo.findAll();

    return invitations.map(inv => ({
      id: inv.id,
      code: inv.code,
      email: inv.email,
      role: inv.role,
      status: inv.status,
      expiresAt: inv.expiresAt,
      usedAt: inv.usedAt,
      createdByUserId: inv.createdByUserId,
      createdAt: inv.createdAt,
    }));
  }
}
