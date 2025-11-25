import {
  Body,
  Controller,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterWithInvitationUseCase } from '../application/register-with-invitation.usecase';
import {
  InvitationExpiredError,
  InvitationAlreadyUsedError,
  InvitationNotFoundError,
} from '../../invitations/domain/errors';
import { EmailAlreadyInUseError } from '../../users/domain/errors';
import {
  LoginWithEmailAndPasswordUseCase,
  InvalidCredentialsError,
} from '../application/login-with-email-and-password.usecase';
import { Role } from '../../users/domain/role.enum';

class RegisterWithInvitationDto {
  code!: string;
  name!: string;
  email!: string;
  password!: string;
}

class LoginDto {
  email!: string;
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerWithInvitationUseCase: RegisterWithInvitationUseCase,
    private readonly loginWithEmailAndPasswordUseCase: LoginWithEmailAndPasswordUseCase,
    private readonly jwtService: JwtService,
  ) { }

  @Post('register-with-invitation')
  async register(@Body() body: RegisterWithInvitationDto) {
    const { code, name, email, password } = body;

    try {
      const result = await this.registerWithInvitationUseCase.execute({
        code,
        name,
        email,
        password,
      });

      // Opcional: emitir token también aquí.
      const payload = {
        sub: result.user.id,
        email: result.user.email,
        roles: result.user.roles as Role[],
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        user: result.user,
        ...('account' in result ? { account: result.account } : {}),
      };
    } catch (err) {
      if (
        err instanceof InvitationExpiredError ||
        err instanceof InvitationAlreadyUsedError ||
        err instanceof EmailAlreadyInUseError ||
        err instanceof InvitationNotFoundError
      ) {
        throw new BadRequestException(err.message);
      }

      throw err;
    }
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;

    try {
      const result = await this.loginWithEmailAndPasswordUseCase.execute({
        email,
        password,
      });

      const payload = {
        sub: result.user.id,
        email: result.user.email,
        roles: result.user.roles as Role[],
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        user: result.user,
      };
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        throw new BadRequestException('Credenciales inválidas');
      }
      throw err;
    }
  }
}
