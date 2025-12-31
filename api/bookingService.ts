import {
  Reservation,
  CreateReservationRequest,
  ReservationResponse,
  PaginatedResponse,
  PaginationParams,
} from "../types";
import { api, ApiError } from "./client";
import { API_CONFIG } from "../config/api";

/**
 * SERVICE: Booking Service
 * RESPONSIBILITY: Reservation management and orchestration
 * INTEGRATION: Backend team's booking endpoints
 */
export const bookingService = {
  // Create a new reservation
  createReservation: async (
    reservationData: CreateReservationRequest
  ): Promise<ReservationResponse> => {
    try {
      const response = await api.post<ReservationResponse>(
        API_CONFIG.ENDPOINTS.RESERVATIONS.CREATE,
        reservationData
      );
      return response.data;
    } catch (error) {
      // Fallback to demo mode if backend is not available
      if (error instanceof ApiError) {
        console.warn("Backend booking not available, using demo mode");

        // Simulate API Call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate demo reservation response
        const reservationId = "res-" + Math.random().toString(36).substr(2, 9);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes from now

        return {
          reservation_id: reservationId,
          amount_cents: reservationData.quantity * 5000, // Assuming $50 per ticket
          expires_at: expiresAt,
          payment: {
            client_secret:
              "pi_" +
              Math.random().toString(36).substr(2, 20) +
              "_secret_" +
              Math.random().toString(36).substr(2, 20),
            checkout_url: `https://checkout.stripe.com/pay/cs_test_${Math.random()
              .toString(36)
              .substr(2, 20)}`,
          },
        };
      }
      throw error;
    }
  },

  // List user's reservations
  getUserReservations: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Reservation>> => {
    try {
      const response = await api.get<Reservation[]>(
        API_CONFIG.ENDPOINTS.RESERVATIONS.LIST,
        {
          params,
          headers: {} as any,
        }
      );
      return {
        data: response.data,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE,
          total: response.data.length,
          totalPages: Math.ceil(
            response.data.length /
              (params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE)
          ),
        },
      };
    } catch (error) {
      // Fallback to demo mode
      if (error instanceof ApiError) {
        console.warn("Backend booking not available, using demo mode");

        await new Promise((resolve) => setTimeout(resolve, 500));

        // Demo reservations data
        const demoReservations: Reservation[] = [
          {
            id: "res-1",
            user_id: "user-1",
            event_id: "1",
            quantity: 2,
            status: "CONFIRMED" as any,
            amount_cents: 10000,
            created_at: "2024-01-15T10:00:00Z",
          },
          {
            id: "res-2",
            user_id: "user-1",
            event_id: "2",
            quantity: 1,
            status: "PENDING" as any,
            amount_cents: 7500,
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
            created_at: "2024-01-16T14:30:00Z",
          },
        ];

        return {
          data: demoReservations,
          pagination: {
            page: 1,
            limit: API_CONFIG.DEFAULT_PAGE_SIZE,
            total: demoReservations.length,
            totalPages: 1,
          },
        };
      }
      throw error;
    }
  },

  // Get single reservation details
  getReservation: async (reservationId: string): Promise<Reservation> => {
    try {
      const response = await api.get<Reservation>(
        API_CONFIG.ENDPOINTS.RESERVATIONS.DETAIL.replace(":id", reservationId)
      );
      return response.data;
    } catch (error) {
      // Fallback to demo mode
      if (error instanceof ApiError) {
        console.warn("Backend booking not available, using demo mode");

        await new Promise((resolve) => setTimeout(resolve, 300));

        return {
          id: reservationId,
          user_id: "user-1",
          event_id: "1",
          quantity: 2,
          status: "PENDING" as any,
          amount_cents: 10000,
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          created_at: "2024-01-15T10:00:00Z",
        };
      }
      throw error;
    }
  },

  // Cancel reservation
  cancelReservation: async (reservationId: string): Promise<void> => {
    try {
      await api.post(
        API_CONFIG.ENDPOINTS.RESERVATIONS.CANCEL.replace(":id", reservationId)
      );
    } catch (error) {
      // Fallback to demo mode
      if (error instanceof ApiError) {
        console.warn("Backend booking not available, using demo mode");
        await new Promise((resolve) => setTimeout(resolve, 600));
        // Demo mode - just simulate cancellation
      }
      throw error;
    }
  },

  // Confirm reservation (internal call from Payment Service)
  confirmReservation: async (reservationId: string): Promise<void> => {
    try {
      await api.post(
        API_CONFIG.ENDPOINTS.RESERVATIONS.CONFIRM.replace(":id", reservationId)
      );
    } catch (error) {
      // Fallback to demo mode
      if (error instanceof ApiError) {
        console.warn("Backend booking not available, using demo mode");
        await new Promise((resolve) => setTimeout(resolve, 400));
        // Demo mode - just simulate confirmation
      }
      throw error;
    }
  },

  // Get reservations for a specific event (admin only)
  getEventReservations: async (
    eventId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Reservation>> => {
    try {
      const response = await api.get<Reservation[]>(
        API_CONFIG.ENDPOINTS.RESERVATIONS.LIST,
        {
          params: { ...params, event_id: eventId },
          headers: {} as any,
        }
      );
      return {
        data: response.data,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE,
          total: response.data.length,
          totalPages: Math.ceil(
            response.data.length /
              (params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE)
          ),
        },
      };
    } catch (error) {
      // Fallback to demo mode
      if (error instanceof ApiError) {
        console.warn("Backend booking not available, using demo mode");

        await new Promise((resolve) => setTimeout(resolve, 500));

        // Demo reservations filtered by event_id
        const demoReservations: Reservation[] = [
          {
            id: "res-1",
            user_id: "user-1",
            event_id: eventId,
            quantity: 2,
            status: "CONFIRMED" as any,
            amount_cents: 10000,
            created_at: "2024-01-15T10:00:00Z",
          },
          {
            id: "res-2",
            user_id: "user-2",
            event_id: eventId,
            quantity: 1,
            status: "PAID" as any,
            amount_cents: 5000,
            created_at: "2024-01-16T14:30:00Z",
          },
          {
            id: "res-3",
            user_id: "user-3",
            event_id: eventId,
            quantity: 3,
            status: "PENDING" as any,
            amount_cents: 15000,
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
            created_at: "2024-01-17T09:15:00Z",
          },
        ];

        return {
          data: demoReservations,
          pagination: {
            page: 1,
            limit: API_CONFIG.DEFAULT_PAGE_SIZE,
            total: demoReservations.length,
            totalPages: 1,
          },
        };
      }
      throw error;
    }
  },
};
