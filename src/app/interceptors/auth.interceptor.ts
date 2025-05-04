import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthStore } from "@app/auth.store";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);

  const token = authStore.accessToken();
  console.log(
    "authInterceptor: Request URL:",
    req.url,
    "Token:",
    token ? "Present" : "Missing",
  );
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`),
    });
    return next(authReq);
  }

  return next(req);
};

/*
 *
 
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
 * */
