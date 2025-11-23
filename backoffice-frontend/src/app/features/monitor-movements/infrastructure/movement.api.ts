import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MovementPort } from '../application/ports/movement.port';
import { Movement } from '../domain/movement.model';

@Injectable()
export class MovementApiAdapter implements MovementPort {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  async getAllForMonitor(): Promise<Movement[]> {
    const dto = await firstValueFrom(
      this.http.get<any[]>(`${this.baseUrl}/monitor/movements`)
    );
    return dto as Movement[];
  }
}
