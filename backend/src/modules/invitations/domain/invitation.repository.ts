// backend/src/modules/invitations/domain/invitation.repository.ts

import { Invitation } from './invitation.entity';

export interface InvitationRepository {
  findByCode(code: string): Promise<Invitation | null>;
  save(invitation: Invitation): Promise<void>;
  findAll(): Promise<Invitation[]>;
}
