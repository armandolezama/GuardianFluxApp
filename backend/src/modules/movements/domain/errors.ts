export class InsufficientFundsError extends Error {
  constructor() {
    super('Insufficient funds');
    this.name = 'InsufficientFundsError';
  }
}

export class DestinationAccountNotFoundError extends Error {
  constructor() {
    super('Destination account not found');
    this.name = 'DestinationAccountNotFoundError';
  }
}

export class AccountNotFoundError extends Error {
  constructor() {
    super('Account not found');
    this.name = 'AccountNotFoundError';
  }
}

export class UnauthorizedAccountAccessError extends Error {
  constructor() {
    super('You are not allowed to operate on this account');
    this.name = 'UnauthorizedAccountAccessError';
  }
}
