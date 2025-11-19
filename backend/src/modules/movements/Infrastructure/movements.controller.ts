import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { CreateDepositUseCase } from '../application/create-deposit.usecase';
import {
  DestinationAccountNotFoundError,
  InsufficientFundsError,
} from '../domain/errors';

export class CreateDepositDto {
  originAccountNumber!: string;
  destinationAccountNumber!: string;
  amount!: number;
  description?: string;
}

@Controller('movements')
export class MovementsController {
  constructor(
    private readonly createDepositUseCase: CreateDepositUseCase,
  ) {}

  @Post('deposit')
  async deposit(@Body() body: CreateDepositDto) {
    const { originAccountNumber, destinationAccountNumber, amount, description } = body;

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
}
