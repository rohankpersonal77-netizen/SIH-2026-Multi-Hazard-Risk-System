import { create } from 'zustand';
import type { User } from '../types';
import { mockUsers } from '../services/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userId?: string) => void;
  logout: () => void;
  setRole: (role: User['role']) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUsers[0],
  isAuthenticated: true,
  login: (userId?: string) => {
    const selectedUser = mockUsers.find(u => u.id === userId) || mockUsers[0];
    set({ user: selectedUser, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  setRole: (role: User['role']) => set((state) => ({
    user: state.user ? { ...state.user, role } : null
  }))
}));
