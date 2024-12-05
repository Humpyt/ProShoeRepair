import { create } from 'zustand';
import type { AuthState, User } from '../types';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@repairpro.com',
    password: 'admin123', // Added password
    name: 'Admin User',
    role: 'admin',
    permissions: ['all'],
    active: true,
    lastLogin: '2024-03-15T08:30:00Z'
  },
  {
    id: '2',
    email: 'manager@repairpro.com',
    password: 'manager123', // Added password
    name: 'Manager User',
    role: 'manager',
    permissions: ['manage_staff', 'manage_orders', 'view_reports'],
    active: true,
    lastLogin: '2024-03-15T09:15:00Z'
  },
  {
    id: '3',
    email: 'staff1@repairpro.com',
    password: 'staff123', // Added password
    name: 'Staff User',
    role: 'staff',
    permissions: ['process_orders'],
    active: true,
    lastLogin: '2024-03-15T08:45:00Z'
  }
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      set({ user: userWithoutPassword, isAuthenticated: true });
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Invalid credentials');
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('user');
  },

  checkAuth: async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      set({ user, isAuthenticated: true });
    }
  }
}));