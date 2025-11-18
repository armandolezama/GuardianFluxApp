// backend/src/modules/invitations/domain/errors.ts

export class InvitationNotFoundError extends Error {
  constructor(code: string) {
    super(`Invitation with code "${code}" not found`);
    this.name = 'InvitationNotFoundError';
  }
}

export class InvitationExpiredError extends Error {
  constructor(code: string) {
    super(`Invitation with code "${code}" is expired`);
    this.name = 'InvitationExpiredError';
  }
}

export class InvitationAlreadyUsedError extends Error {
  constructor(code: string) {
    super(`Invitation with code "${code}" is already used`);
    this.name = 'InvitationAlreadyUsedError';
  }
}
