// backend/src/modules/accounts/infrastructure/accounts-http.module.ts
import { Module } from '@nestjs/common';
import { AccountsInfraModule } from './accounts-infra.module';
import { AccountsController } from './accounts.controller';
import { GetAccountsForUserUseCase } from '../application/get-accounts-for-user.usecase';
import { AccountRepository } from '../domain/account.repository';

@Module({
  imports: [AccountsInfraModule],
  controllers: [AccountsController],
  providers: [
    {
      provide: GetAccountsForUserUseCase,
      useFactory: (accountRepo: AccountRepository) =>
        new GetAccountsForUserUseCase(accountRepo),
      inject: ['AccountRepository'],
    },
  ],
  exports: [GetAccountsForUserUseCase],
})
export class AccountsHttpModule {}
