// backend/src/modules/accounts/infrastructure/accounts-infra.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountDocument, AccountSchema } from './account.schema';
import { MongoAccountRepository } from './account-mongo.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountDocument.name, schema: AccountSchema },
    ]),
  ],
  providers: [
    { provide: 'AccountRepository', useClass: MongoAccountRepository },
  ],
  exports: ['AccountRepository'],
})
export class AccountsInfraModule {}
