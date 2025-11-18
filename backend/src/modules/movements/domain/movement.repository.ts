import { Movement } from './movement.entity';

export interface MovementRepository {
  save(movement: Movement): Promise<void>;
  // luego podremos añadir métodos para listar, etc.
}
