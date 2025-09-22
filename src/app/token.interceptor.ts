import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, switchMap } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // inject service
  const token = authService.getToken();

  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

 return next(clonedReq).pipe(
  catchError((err: HttpErrorResponse) => {
    if (err.status === 403 || err.status === 401) {
      console.log('➡️ Access token expired, calling refreshToken...');
      return authService.refreshToken().pipe(
        tap(() => console.log('➡️ refreshToken() called and completed')),
        switchMap(() => {
          const newToken = authService.getToken();
          console.log('➡️ New access token:', newToken);
          const newReq = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          });
          return next(newReq); // Retry original request
        }),
        catchError(refreshErr => {
          console.error(' Refresh token failed:', refreshErr);
          authService.logout();
          return throwError(() => refreshErr);
        })
      );
    }
    return throwError(() => err);
  })
);

};

