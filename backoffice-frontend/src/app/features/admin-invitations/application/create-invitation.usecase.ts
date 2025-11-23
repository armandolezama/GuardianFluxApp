import { inject, Injectable } from '@angular/core';
import { INVITATION_PORT } from './ports/invitation.port';
import { CreateInvitationCommand, Invitation, validateInvitation } from '../domain/invitation.model';

@Injectable()
export class CreateInvitationUseCase {
  private port = inject(INVITATION_PORT); // ✅ token real

  async execute(cmd: CreateInvitationCommand): Promise<Invitation> {
    validateInvitation(cmd);
    return this.port.create(cmd);
  }
}
