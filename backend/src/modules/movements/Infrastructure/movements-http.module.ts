import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UuidIdGenerator } from '../../../shared/utils/id.generators';
import { MovementsController } from './movements.controller';
import { AccountsInfraModule } from '../../accounts/infrastructure/accounts-infra.module';
import { AccountRepository } from '../../accounts/domain/account.repository';
import { MovementRepository } from '../domain/movement.repository';
import { CreateDepositUseCase } from '../application/create-deposit.usecase';
import { CreateWithdrawalUseCase } from '../application/create-withdrawal.usecase';
import { ListMovementsForMonitorUseCase } from '../application/list-movements-for-monitor.usecase';
import { MongoMovementRepository } from './movement-mongo.repository';
import { MovementDocument, MovementSchema } from './movement.schema';

@Module({
  imports: [
    AccountsInfraModule,
    MongooseModule.forFeature([
      { name: MovementDocument.name, schema: MovementSchema },
    ]),
  ],
  controllers: [MovementsController],
  providers: [
    { provide: 'MovementRepository', useClass: MongoMovementRepository },

    {
      provide: CreateDepositUseCase,
      useFactory: (
        accountRepo: AccountRepository,
        movementRepo: MovementRepository,
      ) =>
        new CreateDepositUseCase(
          accountRepo,
          movementRepo,
          new UuidIdGenerator('mov'),
          () => new Date(),
        ),
      inject: ['AccountRepository', 'MovementRepository'],
    },

    {
      provide: CreateWithdrawalUseCase,
      useFactory: (
        accountRepo: AccountRepository,
        movementRepo: MovementRepository,
      ) =>
        new CreateWithdrawalUseCase(
          accountRepo,
          movementRepo,
          new UuidIdGenerator('mov'),
          () => new Date(),
        ),
      inject: ['AccountRepository', 'MovementRepository'],
    },

    {
      provide: ListMovementsForMonitorUseCase,
      useFactory: (repo: MovementRepository) =>
        new ListMovementsForMonitorUseCase(repo),
      inject: ['MovementRepository'],
    },
  ],
  exports: ['MovementRepository'],
})
export class MovementsHttpModule {}
