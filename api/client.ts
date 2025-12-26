
import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API Response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

// Request interceptor for adding auth token
const addAuthHeader = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Response interceptor for error handling
const handleErrorResponse = (error: AxiosError): Promise<ApiError> => {
  if (error.response) {
    const { status, data } = error.response;
    const responseData = data as any;
    const message = responseData?.message || responseData?.error || 'Request failed';
    return Promise.reject(new ApiError(message, status, responseData?.code, data));
  } else if (error.request) {
    return Promise.reject(new ApiError('Network error. Please check your connection.'));
  } else {
    return Promise.reject(new ApiError('Request configuration error.'));
  }
};

// Create axios instance with default configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.API_GATEWAY,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    addAuthHeader,
    (error) => Promise.reject(error)
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    handleErrorResponse
  );

  return client;
};

// Export configured axios instance
export const apiClient = createApiClient();

// Utility functions for common API operations
export const api = {
  get: <T>(url: string, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.get(url, config).then(response => ({
      data: response.data,
      status: response.status,
      success: true
    })),

  post: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.post(url, data, config).then(response => ({
      data: response.data,
      status: response.status,
      success: true
    })),

  put: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.put(url, data, config).then(response => ({
      data: response.data,
      status: response.status,
      success: true
    })),

  patch: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.patch(url, data, config).then(response => ({
      data: response.data,
      status: response.status,
      success: true
    })),

  delete: <T>(url: string, config?: InternalAxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.delete(url, config).then(response => ({
      data: response.data,
      status: response.status,
      success: true
    }))
};

// Health check utility
export const healthCheck = async (serviceUrl?: string): Promise<boolean> => {
  try {
    const url = serviceUrl ? `${serviceUrl}/health` : '/health';
    await apiClient.get(url);
    return true;
  } catch {
    return false;
  }
};

// SIMULATION LAYER: 
// For demo purposes, we'll intercept calls to simulate a backend if one doesn't exist.
// This allows the demo to be functional out-of-the-box.
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
