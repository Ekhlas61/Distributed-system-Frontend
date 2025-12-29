
import { User, UserRole, RegisterRequest, LoginRequest, AuthResponse } from '../types';
import { api, ApiError } from './client';
import { API_CONFIG } from '../config/api';

// Helper functions for user storage (localStorage fallback for demo)
const getUsers = (): User[] => {
  const users = localStorage.getItem('registeredUsers');
  return users ? JSON.parse(users) : [];
};

const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};

const findUser = (username: string): User | null => {
  const users = getUsers();
  return users.find(user => user.username === username) || null;
};

/**
 * SERVICE: Auth Service
 * RESPONSIBILITY: User identity, JWT issuance, and RBAC roles.
 * INTEGRATION: Backend team's auth endpoints
 */
export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        { username, password } as LoginRequest
      );
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        user_id: response.data.user_id,
        username: response.data.username,
        role: username.toLowerCase().includes('admin') ? UserRole.ADMIN : UserRole.USER
      }));
      
      return response.data;
    } catch (error) {
      // Fallback to demo mode if backend is not available
      if (error instanceof ApiError) {
        console.warn('Backend auth not available, using demo mode');
        
        // Simulate API Call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if user exists in registered users
        const existingUser = findUser(username);
        if (!existingUser) {
          throw new Error('User not found. Please sign up first.');
        }
        
        const token = 'mock-jwt-token-' + Date.now();
        const authResponse: AuthResponse = {
          user_id: existingUser.user_id,
          username: existingUser.username,
          token
        };
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(existingUser));
        
        return authResponse;
      }
      throw error;
    }
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        userData
      );
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        user_id: response.data.user_id,
        username: response.data.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.username.toLowerCase().includes('admin') ? UserRole.ADMIN : UserRole.USER
      }));
      
      return response.data;
    } catch (error) {
      // Fallback to demo mode if backend is not available
      if (error instanceof ApiError) {
        console.warn('Backend auth not available, using demo mode');
        
        // Simulate API Call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if username already exists
        const existingUser = findUser(userData.username);
        if (existingUser) {
          throw new Error('Username already exists. Please choose a different username.');
        }
        
        // Demo Logic with admin detection
        const isAdmin = userData.username.toLowerCase().includes('admin');
        const role = isAdmin ? UserRole.ADMIN : UserRole.USER;
        const user: User = { 
          user_id: 'u-' + Math.random().toString(36).substr(2, 9),
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role
        };
        
        // Save user to localStorage
        saveUser(user);
        
        const token = 'mock-jwt-token-' + Date.now();
        const authResponse: AuthResponse = {
          user_id: user.user_id,
          username: user.username,
          token
        };
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return authResponse;
      }
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAdmin: (): boolean => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return false;
    
    const user = JSON.parse(savedUser);
    return user.role === UserRole.ADMIN;
  }
};
