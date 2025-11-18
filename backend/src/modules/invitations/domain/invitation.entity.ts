// backend/src/modules/invitations/domain/invitation.entity.ts

import { InvitationStatus } from './invitation-status.enum';

export interface InvitationProps {
  id: string;
  code: string;
  email?: string;
  role: string; // 'CUSTOMER' por ahora
  status: InvitationStatus;
  expiresAt: Date;
  usedAt?: Date | null;
  createdByUserId: string;
  createdAt: Date;
}

export class Invitation {
  private props: InvitationProps;

  constructor(props: InvitationProps) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  get code() {
    return this.props.code;
  }

  get email() {
    return this.props.email;
  }

  get role() {
    return this.props.role;
  }

  get status() {
    return this.props.status;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get usedAt() {
    return this.props.usedAt;
  }

  get createdByUserId() {
    return this.props.createdByUserId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  // Métodos de dominio útiles para otros casos de uso
  isExpired(now: Date = new Date()): boolean {
    return this.props.expiresAt.getTime() <= now.getTime();
  }

  isUsed(): boolean {
    return this.props.status === InvitationStatus.USED;
  }
}
