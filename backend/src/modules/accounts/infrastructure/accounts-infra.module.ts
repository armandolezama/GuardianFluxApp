import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { GetAccountsForUserUseCase } from '../application/get-accounts-for-user.usecase';
import { AccountRepository } from '../domain/account.repository';
import { InMemoryAccountRepository } from './account-inmemory.repository';

@Module({
  controllers: [AccountsController],
  providers: [
    { provide: 'AccountRepository', useClass: InMemoryAccountRepository },
    {
      provide: GetAccountsForUserUseCase,
      useFactory: (repo: AccountRepository) =>
        new GetAccountsForUserUseCase(repo),
      inject: ['AccountRepository'],
    },
  ],
  exports: ['AccountRepository'],
})
export class AccountsInfraModule {}
