import { Injectable } from '@nestjs/common';
import { MovementRepository } from '../domain/movement.repository';
import { Movement } from '../domain/movement.entity';

@Injectable()
export class InMemoryMovementRepository implements MovementRepository {
  private movements: Movement[] = [];

  async save(movement: Movement): Promise<void> {
    this.movements.push(movement);
  }

  // helper para futuro monitor: listar movimientos
  async findAll(): Promise<Movement[]> {
    return this.movements;
  }
}
