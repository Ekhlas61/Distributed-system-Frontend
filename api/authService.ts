
import { User, UserRole } from '../types';
import { sleep } from './client';

/**
 * SERVICE: Auth Service
 * RESPONSIBILITY: User identity, JWT issuance, and RBAC roles.
 */
export const authService = {
  login: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    // Simulate API Call
    await sleep(800);
    
    // Demo Logic
    const role = username.toLowerCase().includes('admin') ? UserRole.ADMIN : UserRole.USER;
    const user: User = { id: 'u-' + Math.random().toString(36).substr(2, 9), username, role };
    const token = 'mock-jwt-token-' + Date.now();
    
    return { user, token };
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  }
};
