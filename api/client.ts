
import axios from 'axios';

// In a real app, this comes from process.env.VITE_API_BASE_URL
const API_BASE_URL = 'https://api.eventtick-demo.com/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor for JWT tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// SIMULATION LAYER: 
// For demo purposes, we'll intercept calls to simulate a backend if one doesn't exist.
// This allows the demo to be functional out-of-the-box.
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
