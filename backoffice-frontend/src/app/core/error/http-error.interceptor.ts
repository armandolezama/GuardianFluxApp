import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { AppError } from './app-error.model';

// Si usas MatSnackBar, inyecta aquí. Si no, por ahora console + luego UI.
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private auth = inject(AuthService);
  private router = inject(Router);
  // private snack = inject(MatSnackBar);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: unknown) => {
        if (!(err instanceof HttpErrorResponse)) {
          return throwError(() => err);
        }

        const appErr: AppError = {
          status: err.status,
          code: (err.error && (err.error.code || err.error.errorCode)) ?? undefined,
          message:
            (err.error && (err.error.message || err.error.error)) ||
            err.message ||
            'Unexpected error',
          details: err.error,
          url: err.url ?? req.url,
        };

        // Reglas globales
        if (appErr.status === 401 || appErr.status === 403) {
          this.auth.logout();
          this.router.navigateByUrl('/login');
        } else if (appErr.status >= 500) {
          // this.snack.open('Server error. Try again later.', 'OK', { duration: 3500 });
          console.error('[Server error]', appErr);
        } else {
          // this.snack.open(appErr.message, 'OK', { duration: 3500 });
          console.warn('[Client error]', appErr);
        }

        return throwError(() => appErr);
      })
    );
  }
}
