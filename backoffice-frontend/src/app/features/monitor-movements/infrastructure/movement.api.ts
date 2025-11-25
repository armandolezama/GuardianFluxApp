import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MovementPort } from '../application/ports/movement.port';
import { Movement } from '../domain/movement.model';
import { MovementDto } from './movement.dto';
import { MovementMapper } from './movement.mapper';

@Injectable()
export class MovementApiAdapter implements MovementPort {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  async getAllForMonitor(): Promise<Movement[]> {
    const dtos = await firstValueFrom(
      this.http.get<MovementDto[]>(`${this.baseUrl}/movements/monitor`)
    );
    return MovementMapper.toDomainList(dtos);
  }
}
