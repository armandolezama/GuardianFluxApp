import { InjectionToken } from '@angular/core';
import { Movement } from '../../domain/movement.model';

export interface MovementPort {
  getAllForMonitor(): Promise<Movement[]>;
}

export const MOVEMENT_PORT = new InjectionToken<MovementPort>('MOVEMENT_PORT');
