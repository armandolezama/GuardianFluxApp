import { Role } from "../../users/domain/role.enum";

// src/modules/auth/domain/jwt-payload.ts
export interface JwtPayload {
  sub: string;      // user id
  email: string;
  roles: Role[];
}
