import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, User, UserRole } from '../types';
import { currentPatient, currentPsychologist } from '../mocks/data';
import * as authService from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  /** Login simulado por papel (modo mock — sem backend). */
  login: (role: UserRole) => void;
  /** Login real via API (usado quando VITE_USE_MOCKS=false). Retorna o papel. */
  signIn: (email: string, password: string) => Promise<UserRole>;
  logout: () => void;
}

/** Converte o papel da API (maiúsculo) para o papel do frontend. */
function toFrontRole(role: AuthUser['role']): UserRole {
  return role === 'PATIENT' ? 'patient' : 'psychologist';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: currentPatient,
      isAuthenticated: true,
      login: (role) =>
        set({
          user: role === 'patient' ? currentPatient : currentPsychologist,
          isAuthenticated: true,
        }),
      signIn: async (email, password) => {
        const res = await authService.login({ email, password });
        const role = toFrontRole(res.user.role);
        set({
          user: {
            id: res.user.id,
            name: res.user.name,
            email: res.user.email,
            role,
          },
          isAuthenticated: true,
        });
        return role;
      },
      logout: () => {
        authService.logout();
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: 'psiapp-auth' }
  )
);
