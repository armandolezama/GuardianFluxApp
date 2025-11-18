// backend/src/modules/accounts/domain/account.entity.ts

export interface AccountProps {
  id: string;
  userId: string;
  accountNumber: string;
  balance: number;
  currency: string; // 'MXN'
  createdAt: Date;
}

export class Account {
  constructor(private props: AccountProps) { }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get accountNumber() {
    return this.props.accountNumber;
  }

  get balance() {
    return this.props.balance;
  }

  get currency() {
    return this.props.currency;
  }

  get createdAt() {
    return this.props.createdAt;
  }
  canDebit(amount: number): boolean {
    return this.props.balance >= amount;
  }

  debit(amount: number) {
    this.props.balance -= amount;
  }

  credit(amount: number) {
    this.props.balance += amount;
  }
}
