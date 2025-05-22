import { computed } from '@angular/core';
import {
  signalStore,
  withComputed,
  withMethods,
  withState,
  patchState,
} from '@ngrx/signals';
import { AuthService } from './features/auth/services/auth';
import { LoginCredentials, AuthState } from '@app/features/auth/models/user.model';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { interval, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

function getInitialState(): AuthState {
  const accessToken = localStorage.getItem('accessToken');
  let user = null;

  if (accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      user = {
        id_usuario: payload.id_usuario,
        email: payload.email,
        role: payload.id_rol,
        nombre: payload.nombre,
        biografia: payload.biografia,
      };
    } catch (e) {
      console.warn('Error decoding token:', e);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  return {
    user,
    accessToken,
    refreshToken: localStorage.getItem('refreshToken'),
    loading: false,
    error: null,
    requires2FA: false,
    requiresSetup: false,
    tempToken: null,
    setupData: null,
  };
}

const initialState: AuthState = getInitialState();

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user }) => ({
    isAuthenticated: computed(() => !!user()),
    userRole: computed(() => user()?.role),
    user: computed(() => user()),
  })),
  withMethods(
    (
      { ...store },
      authService = inject(AuthService),
      router = inject(Router)
    ) => {
      const destroy$ = new Subject<void>();

      return {
        async loadUserProfile() {
          if (!store.accessToken()) return;

          try {
            const response = await firstValueFrom(authService.getUserProfile());
            patchState(store, { user: response });
          } catch (error) {
            console.error('Error loading user profile:', error);
            this.logout();
          }
        },

        async login(credentials: LoginCredentials) {
          patchState(store, {
            loading: true,
            error: null,
            accessToken: null,
            refreshToken: null,
            requires2FA: false,
            requiresSetup: false,
            tempToken: null,
            setupData: null,
          });

          try {
            const response = await firstValueFrom(authService.login(credentials));
            console.log('Login response:', response);

            if ('requires2FA' in response) {
              if (!response.tempToken) {
                throw new Error('No se recibió el token temporal para 2FA');
              }
              patchState(store, {
                requires2FA: true,
                tempToken: response.tempToken,
                loading: false,
              });
              router.navigate(['/2fa-verify']);
              return;
            }

            if ('requiresSetup' in response) {
              if (!response.tempToken || !response.setupData) {
                throw new Error('Datos incompletos para configuración 2FA');
              }
              patchState(store, {
                requiresSetup: true,
                tempToken: response.tempToken,
                setupData: response.setupData,
                loading: false,
              });
              router.navigate(['/2fa-setup']);
              return;
            }

            if ('accessToken' in response) {
              localStorage.setItem('accessToken', response.accessToken);
              localStorage.setItem('refreshToken', response.refreshToken);

              patchState(store, {
                user: response.user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
                loading: false,
              });

              this.startTokenRefresh();

              router.navigate(['/home']);
            }
          } catch (error: any) {
            console.error('Login error:', error);
            patchState(store, {
              error: error.error?.message || error.message || 'Error en el inicio de sesión',
              loading: false,
              accessToken: null,
              refreshToken: null,
              requires2FA: false,
              requiresSetup: false,
              tempToken: null,
              setupData: null,
            });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        },

        async verify2FA(token: string) {
          const currentTempToken = store.tempToken();
          if (!currentTempToken) {
            console.error('No hay tempToken disponible para la verificación 2FA');
            return;
          }

          patchState(store, { loading: true, error: null });

          try {
            const response = await firstValueFrom(authService.verify2FA(token, currentTempToken));

            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            patchState(store, {
              user: response.user,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              requires2FA: false,
              tempToken: null,
              loading: false,
            });

            this.startTokenRefresh();

            router.navigate(['/home']);
          } catch (error: any) {
            console.error('Error completo:', error);
            patchState(store, {
              error: error.error?.message || error.message || 'Error en verificación 2FA',
              loading: false,
            });
          }
        },

        async setup2FA(secret: string, token: string) {
          const currentTempToken = store.tempToken();
          if (!currentTempToken) {
            console.error('No hay token temporal disponible para la configuración 2FA');
            patchState(store, {
              error: 'No hay token temporal disponible para la configuración 2FA',
              loading: false,
            });
            return;
          }

          patchState(store, { loading: true, error: null });

          try {
            const response = await firstValueFrom(authService.setup2FA(secret, token, currentTempToken));

            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            patchState(store, {
              user: response.user,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              requiresSetup: false,
              tempToken: null,
              setupData: null,
              loading: false,
            });

            this.startTokenRefresh();

            router.navigate(['/home']);
          } catch (error) {
            patchState(store, {
              error: error instanceof Error ? error.message : 'Error en configuración 2FA',
              loading: false,
            });
          }
        },

        async logout() {
          patchState(store, { loading: true, error: null });

          try {
            authService.logout().subscribe({
              error: (error) => console.warn('Error en logout del servidor:', error),
            });
          } finally {
            this.stopTokenRefresh();

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            patchState(store, {
              user: null,
              accessToken: null,
              refreshToken: null,
              loading: false,
              error: null,
              requires2FA: false,
              requiresSetup: false,
              tempToken: null,
              setupData: null,
            });

            router.navigate(['/login']);
          }
        },

        refreshTokenRequest() {
          const currentRefreshToken = store.refreshToken();
          if (!currentRefreshToken) {
            console.warn('No refresh token available');
            return of(false);
          }

          return authService.refreshToken(currentRefreshToken).pipe(
            map((response) => {
              localStorage.setItem('accessToken', response.accessToken);
              patchState(store, {
                accessToken: response.accessToken,
              });
              return true;
            }),
            catchError((error) => {
              console.error('Error refreshing token:', error);
              this.logout();
              return of(false);
            })
          );
        },

        startTokenRefresh() {
          const refreshToken = store.refreshToken();
          if (!refreshToken) return;

          interval(5000000)
            .pipe(
              takeUntil(destroy$),
              switchMap(() => authService.refreshToken(refreshToken))
            )
            .subscribe({
              next: (response) => {
                patchState(store, { accessToken: response.accessToken });
                localStorage.setItem('accessToken', response.accessToken);
              },
              error: () => {
                this.logout();
              },
            });
        },

        stopTokenRefresh() {
          destroy$.next();
          destroy$.complete();
        },
      };
    }
  )
);