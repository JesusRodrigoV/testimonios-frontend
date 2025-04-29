import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthStore } from "@app/auth.store";
import { catchError, switchMap, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const publicRoutes = [
    "/refresh",
    "/logout",
    "/login",
    "/forgot-password",
    "/reset-password",
    "/register",
  ];

  if (publicRoutes.some((route) => req.url.includes(route))) {
    return next(req);
  }

  if (req.url.includes("/verify-2fa")) {
    const tempToken = authStore.tempToken();
    if (tempToken) {
      const authReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${tempToken}`),
      });
      return next(authReq);
    }
  }

  const token = authStore.accessToken();

  if (!token) {
    router.navigate(["/login"]);
    return throwError(() => new Error("No authentication token"));
  }

  // Add token to request
  const authReq = req.clone({
    headers: req.headers.set("Authorization", `Bearer ${token}`),
  });

  return next(authReq);

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
