import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../auth/infrastructure/roles.decorator';
import { RolesGuard } from '../../auth/infrastructure/roles.guard';
import { Role } from '../../users/domain/role.enum';
import { GetAccountsForUserUseCase } from '../application/get-accounts-for-user.usecase';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.CUSTOMER, Role.CUSTOMER_DEMO)
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly getAccountsForUser: GetAccountsForUserUseCase,
  ) {}

  @Get('me')
  async me(@Req() req: Request) {

    const user = req.user as any;
    const result = await this.getAccountsForUser.execute({
      userId: user.userId,
    });

    return result;
  }
}
