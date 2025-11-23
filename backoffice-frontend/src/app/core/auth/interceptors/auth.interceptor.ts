import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  if (!auth.isTokenValid()) return next(req);

  const token = auth.getToken();
  return next(req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }));
};
