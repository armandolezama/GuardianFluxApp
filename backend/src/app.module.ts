// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { InvitationsHttpModule } from './modules/invitations/infrastructure/invitations-http.module';
import { AuthHttpModule } from './modules/auth/infrastructure/auth-http.module';
import { MovementsHttpModule } from './modules/movements/Infrastructure/movements-http.module';
import { DatabaseModule } from './database/database.module';
import { AccountsHttpModule } from './modules/accounts/infrastructure/accounts-http.module';

@Module({
  imports: [
    DatabaseModule,           // Conexión global a Mongo
    InvitationsHttpModule,
    AuthHttpModule,
    MovementsHttpModule,
    AccountsHttpModule,
  ],
})
export class AppModule {}
