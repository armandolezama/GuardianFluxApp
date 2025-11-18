import { Controller, Get, Param } from '@nestjs/common';
import { ValidateInvitationUseCase } from '../application/validate-invitation.usecase';
import {
  InvitationAlreadyUsedError,
  InvitationExpiredError,
  InvitationNotFoundError,
} from '../domain/errors';

@Controller('auth/invitations')
export class InvitationsController {
  constructor(
    private readonly validateInvitationUseCase: ValidateInvitationUseCase,
  ) {}

  @Get(':code')
  async validate(@Param('code') code: string) {
    try {
      const result = await this.validateInvitationUseCase.execute({ code });

      // Por ahora devolvemos directamente el resultado del caso de uso
      return {
        code: result.code,
        email: result.email,
        role: result.role,
        status: result.status,
        expiresAt: result.expiresAt.toISOString(),
      };
    } catch (err) {
      if (err instanceof InvitationNotFoundError) {
        // Nest lo convertirá en 404
        throw new (require('@nestjs/common').NotFoundException)(
          err.message,
        );
      }
      if (err instanceof InvitationExpiredError) {
        throw new (require('@nestjs/common').BadRequestException)(
          err.message,
        );
      }
      if (err instanceof InvitationAlreadyUsedError) {
        throw new (require('@nestjs/common').BadRequestException)(
          err.message,
        );
      }

      // cualquier otro error → 500 genérico
      throw err;
    }
  }
}
