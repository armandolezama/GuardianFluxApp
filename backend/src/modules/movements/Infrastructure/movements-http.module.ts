import { Module } from '@nestjs/common';
import { MovementsController } from './movements.controller';
import { AccountsInfraModule } from '../../accounts/infrastructure/accounts-infra.module';
import { InMemoryMovementRepository } from './movement-inmemory.repository';
import { AccountRepository } from '../../accounts/domain/account.repository';
import { MovementRepository } from '../domain/movement.repository';
import { CreateDepositUseCase } from '../application/create-deposit.usecase';

class SimpleIdGenerator {
  private counter = 1;
  nextId(): string {
    return `mov-${this.counter++}`;
  }
}

@Module({
  imports: [AccountsInfraModule],
  controllers: [MovementsController],
  providers: [
    { provide: 'MovementRepository', useClass: InMemoryMovementRepository },

    {
      provide: CreateDepositUseCase,
      useFactory: (
        accountRepo: AccountRepository,
        movementRepo: MovementRepository,
      ) =>
        new CreateDepositUseCase(
          accountRepo,
          movementRepo,
          new SimpleIdGenerator(),
          () => new Date(),
        ),
      inject: ['AccountRepository', 'MovementRepository'],
    },
  ],
})
export class MovementsHttpModule {}
