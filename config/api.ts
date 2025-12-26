// API Configuration for Distributed Systems Project
// Based on SWENG5111 Mini Project Requirements

export const API_CONFIG = {
  // Base URLs for different microservices
  AUTH_SERVICE: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3001',
  EVENT_SERVICE: import.meta.env.VITE_EVENT_SERVICE_URL || 'http://localhost:3002',
  RESERVATION_SERVICE: import.meta.env.VITE_RESERVATION_SERVICE_URL || 'http://localhost:3003',
  NOTIFICATION_SERVICE: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:3004',
  API_GATEWAY: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000',
  
  // API Endpoints
  ENDPOINTS: {
    // Auth Service Endpoints
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
      HEALTH: '/auth/health'
    },
    
    // Event Service Endpoints
    EVENTS: {
      LIST: '/events',
      DETAIL: '/events/:id',
      CREATE: '/events',
      UPDATE: '/events/:id',
      DELETE: '/events/:id',
      HEALTH: '/events/health'
    },
    
    // Reservation Service Endpoints
    RESERVATIONS: {
      LIST: '/reservations',
      USER_RESERVATIONS: '/reservations/user/:userId',
      CREATE: '/reservations',
      UPDATE: '/reservations/:id',
      CANCEL: '/reservations/:id/cancel',
      HEALTH: '/reservations/health'
    },
    
    // Notification Service Endpoints
    NOTIFICATIONS: {
      SEND: '/notifications/send',
      LIST: '/notifications',
      HEALTH: '/notifications/health'
    },
    
    // System Health Endpoints
    HEALTH: {
      ALL: '/health',
      SERVICES: '/health/services'
    }
  },
  
  // Request Configuration
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // WebSocket/Real-time configuration
  WEBSOCKET: {
    URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3005',
    RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 2000
  }
};

// Export individual service URLs for convenience
export const AUTH_SERVICE_URL = API_CONFIG.AUTH_SERVICE;
export const EVENT_SERVICE_URL = API_CONFIG.EVENT_SERVICE;
export const RESERVATION_SERVICE_URL = API_CONFIG.RESERVATION_SERVICE;
export const NOTIFICATION_SERVICE_URL = API_CONFIG.NOTIFICATION_SERVICE;
export const API_GATEWAY_URL = API_CONFIG.API_GATEWAY;
