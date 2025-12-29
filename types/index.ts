
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  user_id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

// API Request/Response Types (matching backend specification)
export interface RegisterRequest {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user_id: string;
  username: string;
  token: string;
}

// Event Types (matching database schema)
export interface Event {
  id: string;
  name: string; // Changed from 'title' to 'name' to match backend
  start_at: string; // Changed from 'date' to 'start_at'
  price_cents: number; // Changed from 'price' to 'price_cents'
  total_tickets: number;
  tickets_sold: number;
  tickets_held: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CreateEventRequest {
  name: string;
  start_at: string;
  price_cents: number;
  total_tickets: number;
  metadata?: Record<string, any>;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

// Reservation Types (matching database schema)
export enum ReservationStatus {
  PENDING = 'PENDING',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  PAID = 'PAID',
  CONFIRMED = 'CONFIRMED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface Reservation {
  id: string;
  user_id: string;
  event_id: string;
  quantity: number;
  status: ReservationStatus;
  amount_cents: number;
  expires_at?: string;
  payment_intent_id?: string;
  created_at: string;
}

export interface CreateReservationRequest {
  event_id: string;
  quantity: number;
  user_id?: string; // Optional, will be extracted from token
}

export interface ReservationResponse {
  reservation_id: string;
  amount_cents: number;
  expires_at: string;
  payment: {
    client_secret?: string;
    checkout_url?: string;
  };
}

// Payment Types
export interface Payment {
  id: string;
  reservation_id: string;
  stripe_payment_intent: string;
  status: string;
  amount_cents: number;
  provider_payload?: Record<string, any>;
  created_at: string;
}

export interface CreatePaymentRequest {
  reservation_id: string;
}

export interface PaymentIntentResponse {
  client_secret?: string;
  checkout_url?: string;
}

// Inventory Types (Internal Service)
export interface HoldRequest {
  event_id: string;
  quantity: number;
  reservation_id: string;
  hold_ttl_secs: number;
}

export interface ReleaseRequest {
  event_id: string;
  quantity: number;
  reservation_id: string;
}

export interface SellRequest {
  event_id: string;
  quantity: number;
  reservation_id: string;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: 'RESERVATION_CREATED' | 'PAYMENT_SUCCEEDED' | 'RESERVATION_EXPIRED' | 'RESERVATION_CANCELLED';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

// System Health Types
export interface SystemHealth {
  serviceName: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  latency: number;
  version: string;
  lastCheck: string;
  dependencies?: string[];
}

export interface SystemMetrics {
  totalEvents: number;
  totalReservations: number;
  revenue: number;
  activeUsers: number;
  systemHealth: SystemHealth[];
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Error Types
export interface ApiErrorResponse {
  error: string;
  message: string;
  code?: string;
  timestamp: string;
  path: string;
}

// Stripe Types
export interface StripeWebhookEvent {
  type: string;
  data: {
    object: {
      id: string;
      metadata?: {
        reservation_id?: string;
      };
    };
  };
}
