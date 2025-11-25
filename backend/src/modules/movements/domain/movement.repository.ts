import { Movement } from './movement.entity';

/**
 * Port (interface) for Movements persistence.
 * Note: if you already have a MovementRepository interface, merge the new method
 * findAll() into yours instead of duplicating.
 */
export interface MovementRepository {
  save(movement: Movement): Promise<void>;

  // other methods you may already have:
  // findById(id: string): Promise<Movement | null>;
  // findByAccountId(accountId: string): Promise<Movement[]>;

  /**
   * NEW: return all movements for monitor view.
   * In DB adapter you can later add pagination / filters.
   */
  findAll(): Promise<Movement[]>;
}