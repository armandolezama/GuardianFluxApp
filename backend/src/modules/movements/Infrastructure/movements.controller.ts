import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateDepositUseCase } from '../application/create-deposit.usecase';
import { CreateWithdrawalUseCase } from '../application/create-withdrawal.usecase';
import {
  DestinationAccountNotFoundError,
  InsufficientFundsError,
  AccountNotFoundError,
} from '../domain/errors';
// import { Roles } from '../../auth/infrastructure/roles.decorator';
// import { RolesGuard } from '../../auth/infrastructure/roles.guard';

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

@UseGuards(AuthGuard('jwt')) // Todos los endpoints requieren token
@Controller('movements')
export class MovementsController {
  constructor(
    private readonly createDepositUseCase: CreateDepositUseCase,
    private readonly createWithdrawalUseCase: CreateWithdrawalUseCase,
  ) {}

  @Post('deposit')
  async deposit(@Body() body: CreateDepositDto) {
    const { originAccountNumber, destinationAccountNumber, amount, description } =
      body;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    try {
      const result = await this.createDepositUseCase.execute({
        originAccountNumber,
        destinationAccountNumber,
        amount,
        description,
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
      throw err;
    }
  }

  @Post('withdraw')
  async withdraw(@Body() body: CreateWithdrawalDto) {
    const { accountId, amount, description } = body;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    try {
      const result = await this.createWithdrawalUseCase.execute({
        accountId,
        amount,
        description,
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
      throw err;
    }
  }
}
