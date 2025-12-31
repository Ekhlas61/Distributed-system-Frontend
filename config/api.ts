// API Configuration for Distributed Systems Project
// Based on Backend Team API Specification

export const API_CONFIG = {
  // Base URLs for different microservices
  // Defaults mapped to backend docker-compose published ports
  API_GATEWAY: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000',
  CATALOG_SERVICE: import.meta.env.VITE_CATALOG_SERVICE_URL || 'http://localhost:8002',
  INVENTORY_SERVICE: import.meta.env.VITE_INVENTORY_SERVICE_URL || 'http://localhost:8003',
  BOOKING_SERVICE: import.meta.env.VITE_BOOKING_SERVICE_URL || 'http://localhost:8001',
  PAYMENT_SERVICE: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8004',
  NOTIFICATION_SERVICE: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
  
  // API Endpoints (as specified by backend team)
  ENDPOINTS: {
    // Authentication Endpoints (match gateway routes)
    AUTH: {
      REGISTER: '/register/',
      LOGIN: '/login/',
    },
    
    // Public Events Endpoints (via API Gateway)
    EVENTS: {
      LIST: '/api/v1/events/',
      DETAIL: '/api/v1/events/:id/',
      CREATE: '/api/v1/events/',
      UPDATE: '/api/v1/events/:id/',
      DELETE: '/api/v1/events/:id/',
    },
    
    // Reservation Endpoints (via API Gateway)
    RESERVATIONS: {
      LIST: '/api/v1/reservations/',
      DETAIL: '/api/v1/reservations/:id/',
      CREATE: '/api/v1/reservations/',
      CANCEL: '/api/v1/reservations/:id/cancel/',
      CONFIRM: '/api/v1/reservations/:id/confirm/',
    },
    
    // Payment Endpoints (via API Gateway)
    PAYMENTS: {
      CREATE: '/api/v1/payments/',
      WEBHOOK: '/api/v1/payments/webhook',
    },
    
    // Internal Service Endpoints
    INVENTORY: {
      HOLD: '/inventory/hold',
      RELEASE: '/inventory/release',
      SELL: '/inventory/sell',
    },
    
    // Health Check Endpoints
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
  
  // Stripe Configuration
  STRIPE: {
    PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
    WEBHOOK_SECRET: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || ''
  }
};

// Export individual service URLs for convenience
export const API_GATEWAY_URL = API_CONFIG.API_GATEWAY;
export const CATALOG_SERVICE_URL = API_CONFIG.CATALOG_SERVICE;
export const INVENTORY_SERVICE_URL = API_CONFIG.INVENTORY_SERVICE;
export const BOOKING_SERVICE_URL = API_CONFIG.BOOKING_SERVICE;
export const PAYMENT_SERVICE_URL = API_CONFIG.PAYMENT_SERVICE;
export const NOTIFICATION_SERVICE_URL = API_CONFIG.NOTIFICATION_SERVICE;
