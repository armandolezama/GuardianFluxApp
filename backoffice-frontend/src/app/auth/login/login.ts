import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  loading = false;
  error: string | null = null;

  async submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const { email, password } = this.form.getRawValue();

    try {
      const result = await this.auth.login(email!, password!);

      if (result.roles.includes('ADMIN')) {
        this.router.navigate(['/admin']);
        return;
      }

      if (result.roles.includes('MONITOR')) {
        this.router.navigate(['/monitor']);
        return;
      }

      // Si es customer, NO puede entrar a backoffice
      this.auth.logout();
      this.error = 'This portal is only for ADMIN or MONITOR.';
      this.router.navigate(['/login']);
    } catch (e: any) {
      this.error =
        e?.error?.message ??
        e?.message ??
        'Login failed. Check credentials.';
    } finally {
      this.loading = false;
    }
  }
}
