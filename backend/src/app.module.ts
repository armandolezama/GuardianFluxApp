import { Module } from '@nestjs/common';
import { InvitationsHttpModule } from './modules/invitations/infrastructure/invitations-http.module';

@Module({
  imports: [InvitationsHttpModule],
})
export class AppModule {}
