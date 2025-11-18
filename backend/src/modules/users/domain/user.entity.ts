// backend/src/modules/users/domain/user.entity.ts

export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  roles: string[]; // ['CUSTOMER'], ['MONITOR'], etc.
  createdAt: Date;
}

export class User {
  constructor(private props: UserProps) {}

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get roles() {
    return this.props.roles;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
