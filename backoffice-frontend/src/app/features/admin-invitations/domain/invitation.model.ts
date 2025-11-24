import { BackofficeRole } from '../../shared/domain/role.enum';

export type InvitationId = string;

export interface Invitation {
  id: InvitationId;
  email: string;
  code: string;
  role: BackofficeRole;
  expiresAt: string; // ISO
  createdAt: string; // ISO
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
}

// comando para crear (dominio de entrada)
export interface CreateInvitationCommand {
  email: string;
  role: BackofficeRole;
  expiresAt: string; // ISO
}

// reglas mínimas dominio (pueden crecer)
export function validateInvitation(cmd: CreateInvitationCommand) {
  if (!cmd.email.includes('@')) throw new Error('Invalid email');
  const exp = new Date(cmd.expiresAt).getTime();
  if (Number.isNaN(exp) || exp <= Date.now()) {
    throw new Error('expiresAt must be in the future');
  }
}
