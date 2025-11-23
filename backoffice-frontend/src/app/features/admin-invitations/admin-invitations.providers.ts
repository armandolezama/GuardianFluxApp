import { Provider } from '@angular/core';
import { InvitationApiAdapter } from './infrastructure/invitation.api';
import { CreateInvitationUseCase } from './application/create-invitation.usecase';
import { ListInvitationsUseCase } from './application/list-invitations.usecase';
import { INVITATION_PORT } from './application/ports/invitation.port';

export const ADMIN_INVITATIONS_PROVIDERS: Provider[] = [
  InvitationApiAdapter,
  CreateInvitationUseCase,
  ListInvitationsUseCase,
  { provide: INVITATION_PORT, useExisting: InvitationApiAdapter }, // ✅ token real
];
