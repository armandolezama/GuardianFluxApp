import { Module } from '@nestjs/common';
import { InvitationsHttpModule } from './modules/invitations/infrastructure/invitations-http.module';
import { AuthHttpModule } from './modules/auth/infrastructure/auth-http.module';
import { MovementsHttpModule } from './modules/movements/Infrastructure/movements-http.module';

@Module({
  imports: [InvitationsHttpModule, AuthHttpModule, MovementsHttpModule],
})
export class AppModule {}
