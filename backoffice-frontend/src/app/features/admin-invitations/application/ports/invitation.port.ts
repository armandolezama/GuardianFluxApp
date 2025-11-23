import { InjectionToken } from '@angular/core';
import { CreateInvitationCommand, Invitation } from '../../domain/invitation.model';

export interface InvitationPort {
  create(cmd: CreateInvitationCommand): Promise<Invitation>;
  list(): Promise<Invitation[]>;
}

// ✅ Token runtime para DI
export const INVITATION_PORT = new InjectionToken<InvitationPort>('INVITATION_PORT');
