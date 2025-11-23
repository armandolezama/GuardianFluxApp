import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private router = inject(Router);
  // private snack = inject(MatSnackBar);

  handleError(error: any) {
    console.error('[GlobalError]', error);

    // Opcional: si quieres filtrar errores conocidos y no spamear
    // this.snack.open('Something went wrong.', 'OK', { duration: 3500 });

    // No hagas navigate aquí salvo casos súper claros
    // porque podrías tapar errores útiles durante dev.
  }
}
