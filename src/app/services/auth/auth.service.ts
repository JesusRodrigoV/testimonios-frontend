import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  LoginCredentials,
  AuthResponse,
  TwoFactorResponse,
} from "@app/models/user.model";
import { Observable, catchError, throwError, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_URL = "http://localhost:4000/auth";

  login(
    credentials: LoginCredentials,
  ): Observable<AuthResponse | TwoFactorResponse> {
    return this.http
      .post<
        AuthResponse | TwoFactorResponse
      >(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response) => console.log("Raw API response:", response)),
        catchError((error) => {
          // Log the complete error object for debugging
          console.error("Login error details:", {
            status: error.status,
            statusText: error.statusText,
            message: error.error?.message || error.message,
            error: error.error,
          });

          // If it's a 401, it means invalid credentials
          if (error.status === 401) {
            return throwError(() => new Error("Credenciales inválidas"));
          }

          // For other errors, return the server message or a generic one
          return throwError(
            () => new Error(error.error?.message || "Error en el servidor"),
          );
        }),
      );
  }

  verify2FA(token: string, tempToken: string): Observable<AuthResponse> {
    console.log("Enviando verificación 2FA con tempToken:", tempToken);
    console.log("Body del request:", { token: token });
    return this.http
      .post<AuthResponse>(
        `${this.API_URL}/verify-2fa`,
        { token: token }, // Asegurándonos que el body tiene la propiedad 'token'
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
            "Content-Type": "application/json",
          },
        },
      )
      .pipe(
        catchError((error) => {
          console.error("Error en verificación 2FA:", error);
          return throwError(
            () =>
              new Error(error.error.message || "Error en la verificación 2FA"),
          );
        }),
      );
  }

  setup2FA(
    secret: string,
    token: string,
    tempToken: string,
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.API_URL}/setup-2fa`,
        { secret, token },
        {
          headers: { Authorization: `Bearer ${tempToken}` },
        },
      )
      .pipe(
        catchError((error) => {
          console.error("Error en configuración 2FA:", error);
          return throwError(
            () =>
              new Error(error.error.message || "Error en la configuración 2FA"),
          );
        }),
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/logout`, {}).pipe(
      tap(() => {
        this.router.navigate(["/login"]);
      }),
      catchError((error) => {
        console.error("Error en logout:", error);
        return throwError(
          () => new Error(error.error.message || "Error al cerrar sesión"),
        );
      }),
    );
  }

  refreshToken(token: string): Observable<{ accessToken: string }> {
    return this.http
      .post<{
        accessToken: string;
      }>(`${this.API_URL}/refresh`, { refreshToken: token })
      .pipe(
        tap((response) => {
          if (response.accessToken) {
            localStorage.setItem("accessToken", response.accessToken);
          }
        }),
        catchError((error) => {
          console.error("Error al refrescar token:", error);
          // Si hay error en el refresh, limpiamos el storage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          return throwError(
            () => new Error(error.error?.message || "Error al refrescar token"),
          );
        }),
      );
  }

  requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.API_URL}/forgot-password`, { email })
      .pipe(
        catchError((error) => {
          console.error("Error al solicitar reset de password:", error);
          return throwError(
            () => new Error(error.error.message || "Error al solicitar reset"),
          );
        }),
      );
  }

  resetPassword(
    token: string,
    newPassword: string,
  ): Observable<{ message: string }> {
    return this.http
      .post<{
        message: string;
      }>(`${this.API_URL}/reset-password`, { token, newPassword })
      .pipe(
        catchError((error) => {
          console.error("Error al resetear password:", error);
          return throwError(
            () =>
              new Error(error.error.message || "Error al resetear password"),
          );
        }),
      );
  }
}
