import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthStore } from "@app/auth.store";
import { catchError, switchMap, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Skip auth routes
  if (
    req.url.includes("/refresh") ||
    req.url.includes("/verify-2fa") ||
    req.url.includes("/logout") ||
    req.url.includes("/login")
  ) {
    return next(req);
  }

  const token = authStore.accessToken();

  if (!token && !req.url.includes("/public")) {
    router.navigate(["/login"]);
    return throwError(() => new Error("No authentication token"));
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshTokenObservable = authStore.refreshTokenRequest();
        if (!refreshTokenObservable) {
          return throwError(() => new Error("No refresh token available"));
        }

        return refreshTokenObservable.pipe(
          switchMap((success) => {
            if (success) {
              const newToken = authStore.accessToken();
              if (!newToken) {
                authStore.logout();
                router.navigate(["/login"]);
                return throwError(
                  () => new Error("No access token after refresh"),
                );
              }

              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return next(newReq);
            }
            authStore.logout();
            router.navigate(["/login"]);
            return throwError(() => new Error("Token refresh failed"));
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
