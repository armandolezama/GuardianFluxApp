// backend/src/modules/invitations/application/validate-invitation.usecase.ts

import { InvitationRepository } from '../domain/invitation.repository';
import { InvitationStatus } from '../domain/invitation-status.enum';
import {
  InvitationAlreadyUsedError,
  InvitationExpiredError,
  InvitationNotFoundError,
} from '../domain/errors';

interface ValidateInvitationInput {
  code: string;
}

interface ValidateInvitationOutput {
  code: string;
  email?: string;
  role: string;
  status: InvitationStatus;
  expiresAt: Date;
}

export class ValidateInvitationUseCase {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly nowProvider: () => Date = () => new Date(), // inyectable para tests
  ) {}

  async execute(input: ValidateInvitationInput): Promise<ValidateInvitationOutput> {
    const { code } = input;

    const invitation = await this.invitationRepository.findByCode(code);

    if (!invitation) {
      throw new InvitationNotFoundError(code);
    }

    const now = this.nowProvider();

    if (invitation.isExpired(now)) {
      throw new InvitationExpiredError(code);
    }

    if (invitation.isUsed()) {
      throw new InvitationAlreadyUsedError(code);
    }

    // Si pasa todas las validaciones, devolvemos los datos necesarios
    return {
      code: invitation.code,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
    };
  }
}
