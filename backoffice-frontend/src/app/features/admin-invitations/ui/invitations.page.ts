import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { CreateInvitationUseCase } from '../application/create-invitation.usecase';
import { ListInvitationsUseCase } from '../application/list-invitations.usecase';
import { Invitation } from '../domain/invitation.model';
import { BackofficeRole } from '../../shared/domain/role.enum';

@Component({
  selector: 'app-invitations-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './invitations.page.html',
  styleUrl: './invitations.page.scss',
})
export class InvitationsPage {
  private fb = inject(FormBuilder);
  private createUC = inject(CreateInvitationUseCase);
  private listUC = inject(ListInvitationsUseCase);
  private snack = inject(MatSnackBar);

  invitations = signal<Invitation[]>([]);
  loadingList = signal(false);
  creating = signal(false);

  roles: BackofficeRole[] = ['ADMIN', 'MONITOR', 'CUSTOMER', 'CUSTOMER_DEMO'];

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['CUSTOMER_DEMO' as BackofficeRole, Validators.required],
    expiresAt: [null as Date | null, Validators.required],
  });

  displayedColumns = ['email', 'role', 'expiresAt', 'status', 'createdAt'];

  constructor() {
    this.refresh();
  }

  async refresh() {
    try {
      this.loadingList.set(true);
      const data = await this.listUC.execute();
      this.invitations.set(data);
    } catch (e: any) {
      this.snack.open(e?.message ?? 'Error loading invitations', 'OK', { duration: 3000 });
    } finally {
      this.loadingList.set(false);
    }
  }

  async submit() {
    if (this.form.invalid || this.creating()) return;

    const { email, role, expiresAt } = this.form.getRawValue();

    try {
      this.creating.set(true);

      const created = await this.createUC.execute({
        email,
        role,
        expiresAt: expiresAt!.toISOString(),
      });

      // prepend optimista
      this.invitations.set([created, ...this.invitations()]);
      this.form.reset({ email: '', role: 'MONITOR', expiresAt: null });

      this.snack.open('Invitation created', 'OK', { duration: 2500 });
    } catch (e: any) {
      this.snack.open(e?.message ?? 'Error creating invitation', 'OK', { duration: 3000 });
    } finally {
      this.creating.set(false);
    }
  }
}
