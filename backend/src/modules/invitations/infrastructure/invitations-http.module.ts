import { Module } from '@nestjs/common';
import { InvitationsController } from './invitations.controller';
import { InMemoryInvitationRepository } from './invitation-inmemory.repository';
import { ValidateInvitationUseCase } from '../application/validate-invitation.usecase';
import { InvitationRepository } from '../domain/invitation.repository';

@Module({
  controllers: [InvitationsController],
  providers: [
    {
      provide: 'InvitationRepository',
      useClass: InMemoryInvitationRepository,
    },
    {
      provide: ValidateInvitationUseCase,
      useFactory: (repo: InvitationRepository) =>
        new ValidateInvitationUseCase(repo),
      inject: ['InvitationRepository'],
    },
  ],
  exports: [
    'InvitationRepository',
    ValidateInvitationUseCase,
  ],
})
export class InvitationsHttpModule {}
