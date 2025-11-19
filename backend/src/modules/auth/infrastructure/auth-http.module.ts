import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { InvitationsHttpModule } from '../../invitations/infrastructure/invitations-http.module';
import { InMemoryUserRepository } from '../../users/infrastructure/user-inmemory.repository';
import { AccountsInfraModule } from '../../accounts/infrastructure/accounts-infra.module';
import { ValidateInvitationUseCase } from '../../invitations/application/validate-invitation.usecase';
import { InvitationRepository } from '../../invitations/domain/invitation.repository';
import { UserRepository } from '../../users/domain/user.repository';
import { AccountRepository } from '../../accounts/domain/account.repository';
import { RegisterWithInvitationUseCase } from '../application/register-with-invitation.usecase';
import { BcryptPasswordHasher } from './bcrypt-password-hasher';
import { PasswordHasher } from '../domain/password-hasher';
import { LoginWithEmailAndPasswordUseCase } from '../application/login-with-email-and-password.usecase';

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
  imports: [
    InvitationsHttpModule,
    AccountsInfraModule,
    JwtModule.register({
      secret: 'guardianflux-dev-secret', // TODO: mover a env en el futuro
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Repos
    { provide: 'UserRepository', useClass: InMemoryUserRepository },

    // Hasher real
    {
      provide: 'PasswordHasher',
      useFactory: () => new BcryptPasswordHasher(10),
    },

    // Caso de uso de registro con invitación
    {
      provide: RegisterWithInvitationUseCase,
      useFactory: (
        validateInvitation: ValidateInvitationUseCase,
        invitationRepo: InvitationRepository,
        userRepo: UserRepository,
        accountRepo: AccountRepository,
        passwordHasher: PasswordHasher,
      ) =>
        new RegisterWithInvitationUseCase(
          validateInvitation,
          invitationRepo,
          userRepo,
          accountRepo,
          passwordHasher,
          new SimpleIdGenerator(),
          new SimpleAccountNumberGenerator(),
          () => new Date(),
        ),
      inject: [
        ValidateInvitationUseCase,
        'InvitationRepository',
        'UserRepository',
        'AccountRepository',
        'PasswordHasher',
      ],
    },

    // Caso de uso de login
    {
      provide: LoginWithEmailAndPasswordUseCase,
      useFactory: (
        userRepo: UserRepository,
        passwordHasher: PasswordHasher,
      ) =>
        new LoginWithEmailAndPasswordUseCase(
          userRepo,
          passwordHasher,
        ),
      inject: ['UserRepository', 'PasswordHasher'],
    },
  ],
})
export class AuthHttpModule {}
