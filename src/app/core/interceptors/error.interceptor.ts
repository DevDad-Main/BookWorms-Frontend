import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const body = error.error;

      if (body?.validationErrors && Array.isArray(body.validationErrors)) {
        body.validationErrors.forEach((msg: string) => toast.error(msg));
      } else if (body?.error) {
        toast.error(body.error);
      } else if (body?.businessErrorDescription) {
        toast.error(body.businessErrorDescription);
      } else if (body?.message) {
        toast.error(body.message);
      } else if (error.status === 0) {
        toast.error('Network error. Please check your connection.');
      } else if (error.status === 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.status === 403) {
        toast.error('You do not have permission to perform this action.');
      }

      return throwError(() => error);
    })
  );
};
