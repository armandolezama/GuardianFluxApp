import { Invitation } from '../domain/invitation.model';
import { InvitationDto } from './invitation.dto';

export const InvitationMapper = {
  toDomain(dto: InvitationDto): Invitation {
    return {
      id: dto.id,
      email: dto.email,
      role: dto.role as any,
      status: (dto.status ?? 'PENDING').toUpperCase() as any,
      expiresAt: dto.expiresAt ?? dto.expires_at ?? '',
      createdAt: dto.createdAt ?? dto.created_at ?? '',
    };
  },

  toDomainList(dtos: InvitationDto[]): Invitation[] {
    return dtos.map(this.toDomain);
  },
};
