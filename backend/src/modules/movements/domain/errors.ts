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
