
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
}

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
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  NOTIFIED = 'NOTIFIED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED'
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
}

export interface SystemHealth {
  serviceName: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  latency: number;
  version: string;
}

export interface SystemMetrics {
  totalEvents: number;
  totalReservations: number;
  revenue: number;
  activeUsers: number;
}
