import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { RegisterWithInvitationUseCase } from '../application/register-with-invitation.usecase';
import { InvitationExpiredError, InvitationAlreadyUsedError } from '../../invitations/domain/errors';
import { EmailAlreadyInUseError } from '../../users/domain/errors';

class RegisterWithInvitationDto {
  code!: string;
  name!: string;
  email!: string;
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerWithInvitationUseCase: RegisterWithInvitationUseCase,
  ) {}

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

      return {
        user: result.user,
        account: result.account,
      };
    } catch (err) {
      if (
        err instanceof InvitationExpiredError ||
        err instanceof InvitationAlreadyUsedError ||
        err instanceof EmailAlreadyInUseError
      ) {
        throw new BadRequestException(err.message);
      }

      throw err;
    }
  }
}
