
import { User, UserRole } from '../types';
import { sleep } from './client';

// Helper functions for user storage
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
 */
export const authService = {
  login: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    // Simulate API Call
    await sleep(800);
    
    // Check if user exists in registered users
    const existingUser = findUser(username);
    if (!existingUser) {
      throw new Error('User not found. Please sign up first.');
    }
    
    // In a real app, you'd validate password here. For demo, we'll accept any password.
    const token = 'mock-jwt-token-' + Date.now();
    
    return { user: existingUser, token };
  },

  signup: async (username: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    // Simulate API Call
    await sleep(1000);
    
    // Check if username already exists
    const existingUser = findUser(username);
    if (existingUser) {
      throw new Error('Username already exists. Please choose a different username.');
    }
    
    // Demo Logic with admin detection based on username or email containing 'admin'
    const isAdmin = username.toLowerCase().includes('admin') || email.toLowerCase().includes('admin');
    const role = isAdmin ? UserRole.ADMIN : UserRole.USER;
    const user: User = { 
      id: 'u-' + Math.random().toString(36).substr(2, 9), 
      username, 
      role,
      email
    };
    
    // Save user to localStorage
    saveUser(user);
    
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
