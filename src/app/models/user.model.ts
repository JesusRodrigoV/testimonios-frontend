export interface User {
  id: number;
  email: string;
  nombre: string;
  biografia?: string;
  id_rol?: number;
  role: number;
  two_factor_enabled?: boolean;
  profile_image?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TwoFactorResponse {
  message: string;
  requires2FA?: boolean;
  requiresSetup?: boolean;
  setupData?: {
    secret: string;
    qrCode: string;
  };
  tempToken?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  requires2FA: boolean;
  requiresSetup: boolean;
  tempToken: string | null;
  setupData: TwoFactorResponse["setupData"] | null;
}
