import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UuidIdGenerator } from '../../../shared/utils/id.generators';
import { AuthController } from './auth.controller';
import { InvitationsHttpModule } from '../../invitations/infrastructure/invitations-http.module';
import { AccountsInfraModule } from '../../accounts/infrastructure/accounts-infra.module';
import { UsersInfraModule } from '../../users/infrastructure/users-infra.module';
import { ValidateInvitationUseCase } from '../../invitations/application/validate-invitation.usecase';
import { InvitationRepository } from '../../invitations/domain/invitation.repository';
import { UserRepository } from '../../users/domain/user.repository';
import { AccountRepository } from '../../accounts/domain/account.repository';
import { AccountNumberGenerator, RegisterWithInvitationUseCase } from '../application/register-with-invitation.usecase';
import { BcryptPasswordHasher } from './bcrypt-password-hasher';
import { PasswordHasher } from '../domain/password-hasher';
import { LoginWithEmailAndPasswordUseCase } from '../application/login-with-email-and-password.usecase';
import { JwtStrategy } from './jwt.strategy';

class SimpleAccountNumberGenerator implements AccountNumberGenerator {
  generate(): string {
    // 9 dígitos pseudo-aleatorios
    const random = Math.floor(Math.random() * 1_000_000_000)
      .toString()
      .padStart(9, '0');

    return `ACC-${random}`;
  }
}

const jwtExpiresIn: number | undefined =
  process.env.JWT_EXPIRES_IN !== undefined
    ? Number(process.env.JWT_EXPIRES_IN)
    : 3600; // 3600 segundos = 1 hora

@Module({
  imports: [
    InvitationsHttpModule,
    AccountsInfraModule,
    UsersInfraModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'guardianflux-dev-secret',
      signOptions: {
        expiresIn: jwtExpiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Hasher
    {
      provide: 'PasswordHasher',
      useFactory: () =>
        new BcryptPasswordHasher(
          Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
        ),
    },

    // Casos de uso
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
          new UuidIdGenerator('user'),
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

    // Strategy JWT
    JwtStrategy,

    // Opcional: RolesGuard global
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AuthHttpModule {}
