import { Role } from '../../users/domain/role.enum';
import { UserRepository } from '../../users/domain/user.repository';
import { PasswordHasher } from '../domain/password-hasher';

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

interface LoginInput {
  email: string;
  password: string;
}

interface LoginOutput {
  user: {
    id: string;
    email: string;
    name: string;
    roles: string[];
  };
}

export class LoginWithEmailAndPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const { email, password } = input;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const ok = await this.passwordHasher.compare(password, user.passwordHash);
    if (!ok) {
      throw new InvalidCredentialsError();
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles as Role[],
      },
    };
  }
}
