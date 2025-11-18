import { MovementType } from './movement-type.enum';

export interface MovementProps {
  id: string;
  accountId: string;
  type: MovementType;
  amount: number;
  currency: string;
  description?: string;
  createdAt: Date;
  relatedMovementId?: string;
  counterpartyAccountId?: string;
}

export class Movement {
  constructor(private props: MovementProps) {}

  get id() { return this.props.id; }
  get accountId() { return this.props.accountId; }
  get type() { return this.props.type; }
  get amount() { return this.props.amount; }
  get currency() { return this.props.currency; }
  get description() { return this.props.description; }
  get createdAt() { return this.props.createdAt; }
  get relatedMovementId() { return this.props.relatedMovementId; }
  get counterpartyAccountId() { return this.props.counterpartyAccountId; }
}
