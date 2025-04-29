import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  LoginCredentials,
  AuthResponse,
  TwoFactorResponse,
  User,
} from "@app/models/user.model";
import { Observable, catchError, throwError, tap, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_URL = "http://localhost:4000/auth";

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/profile`).pipe(
      catchError((error) => {
        console.error("Error fetching user profile:", error);
        return throwError(
          () =>
            new Error(
              error.error?.message || "Error al obtener perfil de usuario",
            ),
        );
      }),
    );
  }

  register(data: {
    email: string;
    password: string;
    nombre: string;
    biografia?: string;
  }): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, data);
  }

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
    console.log("Setting up 2FA with temp token:", tempToken);
    return this.http
      .post<AuthResponse>(
        `${this.API_URL}/verify-2fa`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
            "Content-Type": "application/json",
          },
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
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return of(void 0);
    }

    return this.http
      .post<void>(
        `${this.API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .pipe(
        tap(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          this.router.navigate(["/login"]);
        }),
        catchError((error) => {
          console.error("Error en logout:", error);
          // Even if the server request fails, we want to clear local storage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          return of(void 0);
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
