
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// API Request/Response Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  category: string;
  image: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  venue: string;
  price: number;
  totalTickets: number;
  category: string;
  image?: string;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  status?: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
}

// Reservation Types
export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  NOTIFIED = 'NOTIFIED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface Reservation {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  status: ReservationStatus;
  ticketQuantity: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  paymentId?: string;
}

export interface CreateReservationRequest {
  eventId: string;
  ticketQuantity: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'RESERVATION_CONFIRMED' | 'RESERVATION_CANCELLED' | 'EVENT_REMINDER' | 'PAYMENT_REQUIRED';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SendNotificationRequest {
  userId: string;
  type: 'RESERVATION_CONFIRMED' | 'RESERVATION_CANCELLED' | 'EVENT_REMINDER' | 'PAYMENT_REQUIRED';
  title: string;
  message: string;
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
