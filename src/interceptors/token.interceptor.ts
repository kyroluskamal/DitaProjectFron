import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationsService } from '../services/notifications.service';

export const TokenResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const PlatForm_ID = inject(PLATFORM_ID);
  const authToken = isPlatformBrowser(PlatForm_ID)
    ? localStorage.getItem('token')
    : '';
  const notifications = inject(NotificationsService);

  // Clone the request and add the authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return next(authReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status > 0) notifications.error(err.error.message, 'Close');
        // Handle HTTP errors
        if (err.status === 401) {
          // Specific handling for unauthorized errors
          console.error('Unauthorized request:', err);
          // You might trigger a re-authentication flow or redirect the user here
        } else {
          // Handle other HTTP error codes
          console.error('HTTP error:', err);
        }
      } else {
        // Handle non-HTTP errors
        console.error('An error occurred:', err);
      }

      // Re-throw the error to propagate it further
      return throwError(() => err);
    })
  );
};
