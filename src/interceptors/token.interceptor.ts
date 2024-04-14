import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const TokenResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('token');
  // Clone the request and add the authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return next(authReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
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
