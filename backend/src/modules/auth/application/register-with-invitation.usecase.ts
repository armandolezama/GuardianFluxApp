// backend/src/modules/auth/application/register-with-invitation.usecase.ts

import { ValidateInvitationUseCase } from '../../invitations/application/validate-invitation.usecase';
import { InvitationRepository } from '../../invitations/domain/invitation.repository';
import { InvitationStatus } from '../../invitations/domain/invitation-status.enum';
import { UserRepository } from '../../users/domain/user.repository';
import { AccountRepository } from '../../accounts/domain/account.repository';
import { EmailAlreadyInUseError } from '../../users/domain/errors';
import { User } from '../../users/domain/user.entity';
import { Account } from '../../accounts/domain/account.entity';
import { PasswordHasher } from '../domain/password-hasher';

interface RegisterWithInvitationInput {
  code: string;
  name: string;
  email: string;
  password: string;
}

interface RegisterWithInvitationOutput {
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  };
  account: {
    id: string;
    userId: string;
    accountNumber: string;
    balance: number;
    currency: string;
  };
}

export interface IdGenerator {
  nextId(): string;
}

export interface AccountNumberGenerator {
  generate(): string;
}

export class RegisterWithInvitationUseCase {
  constructor(
    private readonly validateInvitation: ValidateInvitationUseCase,
    private readonly invitationRepository: InvitationRepository,
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly idGenerator: IdGenerator,
    private readonly accountNumberGenerator: AccountNumberGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: RegisterWithInvitationInput,
  ): Promise<RegisterWithInvitationOutput> {
    const { code, name, email, password } = input;

    // 1) Validar invitación
    const validated = await this.validateInvitation.execute({ code });

    // 2) Verificar que el email no esté en uso
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyInUseError(email);
    }

    const now = this.nowProvider();

    // 3) Crear usuario
    const userId = this.idGenerator.nextId();
    const passwordHash = await this.passwordHasher.hash(password);

    const user = new User({
      id: userId,
      name,
      email,
      passwordHash,
      roles: [validated.role], // 'CUSTOMER' por ahora
      createdAt: now,
    });

    await this.userRepository.save(user);

    // 4) Crear cuenta
    const accountId = this.idGenerator.nextId();
    const accountNumber = this.accountNumberGenerator.generate();

    const account = new Account({
      id: accountId,
      userId: user.id,
      accountNumber,
      balance: 10000,
      currency: 'MXN',
      createdAt: now,
    });

    await this.accountRepository.save(account);

    // 5) Marcar invitación como usada
    const invitation = await this.invitationRepository.findByCode(code);
    if (invitation) {
      // mutate status; podrías mover esto a un método de dominio tipo invitation.markUsed(now)
      (invitation as any).props.status = InvitationStatus.USED;
      (invitation as any).props.usedAt = now;
      await this.invitationRepository.save(invitation);
    }

    // 6) Devolver datos agregados
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      account: {
        id: account.id,
        userId: account.userId,
        accountNumber: account.accountNumber,
        balance: account.balance,
        currency: account.currency,
      },
    };
  }
}
