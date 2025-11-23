import { Provider } from '@angular/core';
import { MovementApiAdapter } from './infrastructure/movement.api';
import { GetMonitorMovementsUseCase } from './application/get-monitor-movements.usecase';
import { MOVEMENT_PORT } from './application/ports/movement.port';

export const MONITOR_MOVEMENTS_PROVIDERS: Provider[] = [
    MovementApiAdapter,
    GetMonitorMovementsUseCase,
    { provide: MOVEMENT_PORT, useExisting: MovementApiAdapter },
];
