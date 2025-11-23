import { InvitationRepository } from '../domain/invitation.repository';
import { Invitation } from '../domain/invitation.entity';
import { InvitationStatus } from '../domain/invitation-status.enum';
import { InvalidInvitationExpirationError } from '../domain/errors';
import { Role } from '../../users/domain/role.enum';

interface CreateInvitationInput {
  email?: string | null;
  role: Role;
  expiresAt: Date;
  createdByUserId: string;   // viene del JWT del admin
}

interface CreateInvitationOutput {
  invitation: Invitation;
}

export class CreateInvitationUseCase {
  constructor(
    private readonly invitationRepo: InvitationRepository,
    private readonly idGenerator: { nextId(): string },
    private readonly codeGenerator: { generate(): string },
    private readonly now: () => Date,
  ) {}

  async execute(input: CreateInvitationInput): Promise<CreateInvitationOutput> {
    const { email, role, expiresAt, createdByUserId } = input;

    if (expiresAt.getTime() <= this.now().getTime()) {
      throw new InvalidInvitationExpirationError();
    }

    const invitation = new Invitation({
      id: this.idGenerator.nextId(),
      code: this.codeGenerator.generate(),
      email: email ?? undefined,
      role,
      status: InvitationStatus.PENDING,
      expiresAt,
      usedAt: null,
      createdByUserId,
      createdAt: this.now(),
    });

    await this.invitationRepo.save(invitation);

    return { invitation };
  }
}
