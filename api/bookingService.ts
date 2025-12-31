import { 
  Reservation, 
  ReservationStatus,
  CreateReservationRequest, 
  ReservationResponse, 
  PaginatedResponse, 
  PaginationParams 
} from '../types';
import { api, ApiError } from './client';
import { demoStore } from './demoStore';
import { API_CONFIG } from '../config/api';

/**
 * SERVICE: Booking Service
 * RESPONSIBILITY: Reservation management and orchestration
 * INTEGRATION: Backend team's booking endpoints
 */
export const bookingService = {
  // Create a new reservation
  createReservation: async (reservationData: CreateReservationRequest): Promise<ReservationResponse> => {
    try {
      const response = await api.post<{
        id: string;
        amount_cents: number;
        expires_at: string;
        status: string;
      }>(
        API_CONFIG.ENDPOINTS.RESERVATIONS.CREATE,
        reservationData
      );
      
      // Map backend response to frontend expected format
      return {
        reservation_id: response.data.id,
        amount_cents: response.data.amount_cents,
        expires_at: response.data.expires_at,
        payment: {
          // Payment info will be populated by payment service
        }
      };
    } catch (error) {
      // Fallback to demo mode if backend is not available
      if (error instanceof ApiError) {
        console.warn('Backend booking not available, using demo mode');

        // Simulate API Call
        await new Promise(resolve => setTimeout(resolve, 400));

        // Demo Logic
        const reservationId = 'res-' + Math.random().toString(36).substr(2, 9);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes from now

        const demoReservation: any = {
          id: reservationId,
          reservation_id: reservationId,
          user_id: reservationData.user_id || 'demo-user',
          event_id: reservationData.event_id,
          quantity: reservationData.quantity,
          status: 'AWAITING_PAYMENT',
          amount_cents: 0,
          expires_at: expiresAt,
          created_at: new Date().toISOString()
        };

        // Persist demo reservation so it shows up in listing and can be confirmed
        try {
          demoStore.addReservation(demoReservation as any);
        } catch (e) {
          // ignore
        }

        return {
          reservation_id: reservationId,
          amount_cents: 0, // Will be calculated by payment service
          expires_at: expiresAt,
          payment: {
            // Payment info will be populated by payment service
          }
        };
      }
      throw error;
    }
  },

  // List user's reservations
  getUserReservations: async (params?: PaginationParams): Promise<PaginatedResponse<Reservation>> => {
    // Use the by-user endpoint which allows non-admin users to see their own reservations
    try {
      const response = await api.get<Reservation[]>(
        '/api/v1/reservations/by-user/',
        { 
          params,
          headers: {} as any
        }
      );

      // Map backend response to frontend format
      const reservations: Reservation[] = response.data.map((res: any) => ({
        id: res.id,
        user_id: res.user_id,
        event_id: res.event_id,
        quantity: res.quantity,
        status: res.status,
        amount_cents: res.amount_cents,
        expires_at: res.expires_at,
        created_at: res.created_at
      }));

      return {
        data: reservations,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE,
          total: reservations.length,
          totalPages: Math.ceil(reservations.length / (params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE))
        }
      };
    } catch (error) {
      if (error instanceof ApiError) {
        // Demo mode: read from client-side demo store
        const demoReservations = demoStore.getReservationsByUser();
        const paged = demoReservations.slice(0, params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE);
        return {
          data: paged as Reservation[],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE,
            total: demoReservations.length,
            totalPages: Math.max(1, Math.ceil(demoReservations.length / (params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE)))
          }
        };
      }
      throw error;
    }
  },

  // Get single reservation details
  getReservation: async (reservationId: string): Promise<Reservation> => {
    const response = await api.get<{
      id: string;
      user_id: string;
      event_id: string;
      quantity: number;
      status: string;
      amount_cents: number;
      expires_at?: string;
      created_at: string;
    }>(
      API_CONFIG.ENDPOINTS.RESERVATIONS.DETAIL.replace(':id', reservationId)
    );
    
    return {
      id: response.data.id,
      user_id: response.data.user_id,
      event_id: response.data.event_id,
      quantity: response.data.quantity,
      status: response.data.status as ReservationStatus,
      amount_cents: response.data.amount_cents,
      expires_at: response.data.expires_at,
      created_at: response.data.created_at
    };
  },

  // Cancel reservation
  cancelReservation: async (reservationId: string): Promise<void> => {
    await api.post(API_CONFIG.ENDPOINTS.RESERVATIONS.CANCEL.replace(':id', reservationId));
  },

  // Confirm reservation (internal call from Payment Service)
  confirmReservation: async (reservationId: string): Promise<void> => {
    try {
      await api.post(API_CONFIG.ENDPOINTS.RESERVATIONS.CONFIRM.replace(':id', reservationId));
    } catch (error) {
      if (error instanceof ApiError) {
        console.warn('Booking confirm not available, applying demo confirm');
        try {
          demoStore.confirmReservation(reservationId);
        } catch (e) {
          // ignore
        }
        return;
      }
      throw error;
    }
  }
};
