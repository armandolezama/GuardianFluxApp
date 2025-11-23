import { inject, Injectable } from '@angular/core';
import { MOVEMENT_PORT } from './ports/movement.port';
import { Movement } from '../domain/movement.model';

@Injectable()
export class GetMonitorMovementsUseCase {
  private port = inject(MOVEMENT_PORT);

  async execute(): Promise<Movement[]> {
    return this.port.getAllForMonitor();
  }
}
