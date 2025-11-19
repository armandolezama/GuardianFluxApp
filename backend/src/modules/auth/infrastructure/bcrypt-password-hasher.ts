import * as bcrypt from 'bcrypt';
import { PasswordHasher } from '../domain/password-hasher';

export class BcryptPasswordHasher implements PasswordHasher {
  constructor(private readonly saltRounds = 10) {}

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
