import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type AuthUser = SupabaseUser;

export interface AuthSession extends Session {
  user: AuthUser;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  initialized: boolean;
}

export interface AuthError {
  message: string;
  status?: number;
}

// Types pour les formulaires d'authentification
export interface SignUpData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdatePasswordData {
  password: string;
  confirmPassword: string;
} 