import { Module } from '@nestjs/common';
import { InMemoryAccountRepository } from './account-inmemory.repository';

@Module({
  providers: [
    {
      provide: 'AccountRepository',
      useClass: InMemoryAccountRepository,
    },
  ],
  exports: ['AccountRepository'],
})
export class AccountsInfraModule {}
