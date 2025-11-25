import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateDepositUseCase } from '../application/create-deposit.usecase';
import { CreateWithdrawalUseCase } from '../application/create-withdrawal.usecase';
import {
  DestinationAccountNotFoundError,
  InsufficientFundsError,
  AccountNotFoundError,
  UnauthorizedAccountAccessError
} from '../domain/errors';
import { Request as ExpressRequest } from 'express';
import { ListMovementsForMonitorUseCase } from '../application/list-movements-for-monitor.usecase';
import { Roles } from '../../auth/infrastructure/roles.decorator';
import { Role } from '../../users/domain/role.enum';
import { RolesGuard } from '../../auth/infrastructure/roles.guard';

export class CreateDepositDto {
  originAccountNumber!: string;
  destinationAccountNumber!: string;
  amount!: number;
  description?: string;
}

export class CreateWithdrawalDto {
  accountId!: string;
  amount!: number;
  description?: string;
}

interface AuthRequest extends ExpressRequest {
  user: {
    userId: string;
    email: string;
    roles: string[];
  };
}

@UseGuards(AuthGuard('jwt'), RolesGuard) // Todos los endpoints requieren token
@Controller('movements')
export class MovementsController {
  constructor(
    private readonly createDepositUseCase: CreateDepositUseCase,
    private readonly createWithdrawalUseCase: CreateWithdrawalUseCase,
    private readonly listMovementsForMonitorUseCase: ListMovementsForMonitorUseCase,
  ) {}

  @Roles(Role.CUSTOMER, Role.CUSTOMER_DEMO)
  @Post('deposit')
  async deposit(
    @Body() body: CreateDepositDto,
    @Req() req: AuthRequest,
  ) {
    const { originAccountNumber, destinationAccountNumber, amount, description } =
      body;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const user = req.user as { userId: string; roles: string[] };

    try {
      const result = await this.createDepositUseCase.execute({
        originAccountNumber,
        destinationAccountNumber,
        amount,
        description,
        requestedByUserId: user.userId,
      });

      return {
        originAccount: result.originAccount,
        destinationAccount: result.destinationAccount,
      };
    } catch (err) {
      if (err instanceof DestinationAccountNotFoundError) {
        throw new BadRequestException('Destination account not found');
      }
      if (err instanceof InsufficientFundsError) {
        throw new BadRequestException('Insufficient funds');
      }
      if (err instanceof UnauthorizedAccountAccessError) {
        throw new BadRequestException('You are not allowed to use this account');
      }
      throw err;
    }
  }

  @Roles(Role.CUSTOMER, Role.CUSTOMER_DEMO)
  @Post('withdraw')
  async withdraw(
    @Body() body: CreateWithdrawalDto,
    @Req() req: AuthRequest,
  ) {
    const { accountId, amount, description } = body;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const user = req.user as { userId: string; roles: string[] };

    try {
      const result = await this.createWithdrawalUseCase.execute({
        accountId,
        amount,
        description,
        requestedByUserId: user.userId,
      });

      return {
        account: result.account,
      };
    } catch (err) {
      if (err instanceof AccountNotFoundError) {
        throw new BadRequestException('Account not found');
      }
      if (err instanceof InsufficientFundsError) {
        throw new BadRequestException('Insufficient funds');
      }
      if (err instanceof UnauthorizedAccountAccessError) {
        throw new BadRequestException('You are not allowed to use this account');
      }
      throw err;
    }
  }

  @Roles(Role.MONITOR)
  @Get('monitor')
  async getMovements() {
    return this.listMovementsForMonitorUseCase.execute();
  }
}
