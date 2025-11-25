import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GetMonitorMovementsUseCase } from '../application/get-monitor-movements.usecase';
import { Movement } from '../domain/movement.model';

@Component({
  selector: 'app-movements-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './movements.page.html',
  styleUrl: './movements.page.scss',
})
export class MovementsPage {
  private fb = inject(FormBuilder);
  private getMovementsUC = inject(GetMonitorMovementsUseCase);
  private snack = inject(MatSnackBar);

  loading = signal(false);
  movements = signal<Movement[]>([]);

  // filtros ligeros
  form = this.fb.nonNullable.group({
    type: ['ALL'],
    status: ['ALL'],
    q: [''], // búsqueda simple por id o masked customer
  });

  displayedColumns = ['id', 'customerMasked', 'type', 'amount', 'currency', 'status', 'createdAt'];

  // valores simples (si luego quieres enums reales, los traemos del backend)
  types = ['ALL', 'DEPOSIT', 'WITHDRAW', 'TRANSFER'];
  statuses = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

  filteredMovements = computed(() => {
    const { type, status, q } = this.form.getRawValue();
    const query = q.trim().toLowerCase();

    return this.movements().filter(m => {
      const okType = type === 'ALL' || m.type === type;
      const okStatus = status === 'ALL' || m.status === status;
      const okQ =
        !query ||
        m.id.toLowerCase().includes(query) ||
        (m.customerMasked ?? '').toLowerCase().includes(query);

      return okType && okStatus && okQ;
    });
  });

  constructor() {
    this.refresh();
  }

  async refresh() {
    try {
      this.loading.set(true);
      const data = await this.getMovementsUC.execute();
      this.movements.set(data);
    } catch (e: any) {
      this.snack.open(e?.message ?? 'Error loading movements', 'OK', { duration: 3000 });
    } finally {
      this.loading.set(false);
    }
  }

  clearFilters() {
    this.form.reset({ type: 'ALL', status: 'ALL', q: '' });
  }
}
