import { Module } from '@nestjs/common';
import { InvitationRepository } from '../domain/invitation.repository';
import { InMemoryInvitationRepository } from './invitation-inmemory.repository';
import { ValidateInvitationUseCase } from '../application/validate-invitation.usecase';
import { AdminInvitationsController } from './admin-invitations.controller';
import { CreateInvitationUseCase } from '../application/create-invitation.usecase';
import { SimpleInvitationCodeGenerator } from './simple-invitation-code.generator';

class SimpleIdGenerator {
  private counter = 1;
  nextId(): string {
    return `inv-${this.counter++}`;
  }
}

@Module({
  controllers: [
    // tu controller público de validate si existe
    AdminInvitationsController,
  ],
  providers: [
    { provide: 'InvitationRepository', useClass: InMemoryInvitationRepository },

    {
      provide: ValidateInvitationUseCase,
      useFactory: (repo: InvitationRepository) =>
        new ValidateInvitationUseCase(repo, () => new Date()),
      inject: ['InvitationRepository'],
    },

    {
      provide: CreateInvitationUseCase,
      useFactory: (repo: InvitationRepository) =>
        new CreateInvitationUseCase(
          repo,
          new SimpleIdGenerator(),
          new SimpleInvitationCodeGenerator(),
          () => new Date(),
        ),
      inject: ['InvitationRepository'],
    },
  ],
  exports: ['InvitationRepository', ValidateInvitationUseCase],
})
export class InvitationsHttpModule {}
