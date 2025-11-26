import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class MovementsService {
  private readonly baseUrl = `${API_BASE_URL}/api`; // o directamente /movements, etc.

  constructor(private http: HttpClient) {}

  getAllMovements() {
    return this.http.get(`${this.baseUrl}/movements`);
  }

  // otros métodos...
}
