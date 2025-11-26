import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitationRepository } from '../domain/invitation.repository';
import { ValidateInvitationUseCase } from '../application/validate-invitation.usecase';
import { ListInvitationsUseCase } from '../application/list-invitations.usecase';
import { AdminInvitationsController } from './admin-invitations.controller';
import { CreateInvitationUseCase } from '../application/create-invitation.usecase';
import { SimpleInvitationCodeGenerator } from './simple-invitation-code.generator';
import { MongoInvitationRepository } from './invitation-mongo.repository';
import { InvitationDocument, InvitationSchema } from './invitation.schema';
import { UuidIdGenerator } from '../../../shared/utils/id.generators';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InvitationDocument.name, schema: InvitationSchema },
    ]),
  ],
  controllers: [AdminInvitationsController],
  providers: [
    { provide: 'InvitationRepository', useClass: MongoInvitationRepository },

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
          new UuidIdGenerator('inv'),         // 👈 aquí usamos la utilidad
          new SimpleInvitationCodeGenerator(),
          () => new Date(),
        ),
      inject: ['InvitationRepository'],
    },

    {
      provide: ListInvitationsUseCase,
      useFactory: (repo: InvitationRepository) =>
        new ListInvitationsUseCase(repo),
      inject: ['InvitationRepository'],
    },
  ],
  exports: ['InvitationRepository', ValidateInvitationUseCase, ListInvitationsUseCase],
})
export class InvitationsHttpModule {}
