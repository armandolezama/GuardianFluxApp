import { Movement } from '../domain/movement.model';
import { MovementDto } from './movement.dto';

export const MovementMapper = {
  toDomain(dto: MovementDto): Movement {
    return {
      id: dto.id,
      amount: dto.amount,
      currency: dto.currency,
      type: dto.type as any,
      status: dto.status as any,
      createdAt: dto.createdAt ?? dto.created_at ?? '',
    };
  },

  toDomainList(dtos: MovementDto[]): Movement[] {
    return dtos.map(this.toDomain);
  },
};
