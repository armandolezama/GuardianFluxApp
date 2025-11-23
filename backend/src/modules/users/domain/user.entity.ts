// backend/src/modules/users/domain/user.entity.ts

import { Role } from "./role.enum";

export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  roles: Role[];
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
