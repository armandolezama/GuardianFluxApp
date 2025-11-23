import { inject, Injectable } from '@angular/core';
import { INVITATION_PORT } from './ports/invitation.port';
import { Invitation } from '../domain/invitation.model';

@Injectable()
export class ListInvitationsUseCase {
  private port = inject(INVITATION_PORT); // ✅ token real

  async execute(): Promise<Invitation[]> {
    return this.port.list();
  }
}
