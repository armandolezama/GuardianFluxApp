import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { InvitationsHttpModule } from '../../invitations/infrastructure/invitations-http.module';
import { InMemoryUserRepository } from '../../users/infrastructure/user-inmemory.repository';
import { AccountsInfraModule } from '../../accounts/infrastructure/accounts-infra.module';
import { ValidateInvitationUseCase } from '../../invitations/application/validate-invitation.usecase';
import { InvitationRepository } from '../../invitations/domain/invitation.repository';
import { UserRepository } from '../../users/domain/user.repository';
import { AccountRepository } from '../../accounts/domain/account.repository';
import { RegisterWithInvitationUseCase } from '../application/register-with-invitation.usecase';

class SimplePasswordHasher {
  async hash(password: string): Promise<string> {
    // NO usar en producción, solo demo
    return `hashed-${password}`;
  }
}

class SimpleIdGenerator {
  private counter = 1;
  nextId(): string {
    return `id-${this.counter++}`;
  }
}

class SimpleAccountNumberGenerator {
  private counter = 1000;
  generate(): string {
    return `ACC-${this.counter++}`;
  }
}

@Module({
  imports: [InvitationsHttpModule, AccountsInfraModule],
  controllers: [AuthController],
  providers: [
    { provide: 'UserRepository', useClass: InMemoryUserRepository },

    {
      provide: RegisterWithInvitationUseCase,
      useFactory: (
        validateInvitation: ValidateInvitationUseCase,
        invitationRepo: InvitationRepository,
        userRepo: UserRepository,
        accountRepo: AccountRepository,
      ) =>
        new RegisterWithInvitationUseCase(
          validateInvitation,
          invitationRepo,
          userRepo,
          accountRepo,
          new SimplePasswordHasher(),
          new SimpleIdGenerator(),
          new SimpleAccountNumberGenerator(),
          () => new Date(),
        ),
      inject: [
        ValidateInvitationUseCase,
        'InvitationRepository',
        'UserRepository',
        'AccountRepository',
      ],
    },
  ],
})
export class AuthHttpModule {}
