import { Module } from '@nestjs/common';
import { InvitationsController } from './invitations.controller';
import { InMemoryInvitationRepository } from './invitation-inmemory.repository';
import { ValidateInvitationUseCase } from '../application/validate-invitation.usecase';
import { InvitationRepository } from '../domain/invitation.repository';

@Module({
  controllers: [InvitationsController],
  providers: [
    // Binding del puerto (InvitationRepository) al adaptador in-memory
    {
      provide: 'InvitationRepository', // token de Nest
      useClass: InMemoryInvitationRepository,
    },
    // Caso de uso como servicio de aplicación
    {
      provide: ValidateInvitationUseCase,
      useFactory: (repo: InvitationRepository) =>
        new ValidateInvitationUseCase(repo),
      inject: ['InvitationRepository'],
    },
  ],
})
export class InvitationsHttpModule {}
