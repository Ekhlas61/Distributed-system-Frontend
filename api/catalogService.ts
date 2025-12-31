import { Event, CreateEventRequest, PaginatedResponse, PaginationParams } from '../types';
import { api, ApiError } from './client';
import { API_CONFIG } from '../config/api';

/**
 * SERVICE: Catalog Service
 * RESPONSIBILITY: Event catalog management (read-heavy operations)
 * INTEGRATION: Backend team's catalog endpoints
 */
export const catalogService = {
  // List all events with optional filters
  getEvents: async (params?: PaginationParams & { search?: string; date?: string }): Promise<PaginatedResponse<Event>> => {
    const response = await api.get<Event[]>(API_CONFIG.ENDPOINTS.EVENTS.LIST, { 
      params,
      headers: {} as any
    });
    
    // Backend may return paginated response or array
    const events = Array.isArray(response.data) ? response.data : (response.data as any).results || [];
    const paginationInfo = (response.data as any).pagination || {};
    
    return {
      data: events,
      pagination: {
        page: paginationInfo.page || params?.page || 1,
        limit: paginationInfo.limit || params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE,
        total: paginationInfo.total || events.length,
        totalPages: paginationInfo.total_pages || Math.ceil((paginationInfo.total || events.length) / (paginationInfo.limit || params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE))
      }
    };
  },

  // Get single event details
  getEvent: async (eventId: string): Promise<Event> => {
    const response = await api.get<Event>(
      API_CONFIG.ENDPOINTS.EVENTS.DETAIL.replace(':id', eventId)
    );
    return response.data;
  },

  // Create new event (admin only)
  createEvent: async (eventData: CreateEventRequest): Promise<Event> => {
    const response = await api.post<Event>(
      API_CONFIG.ENDPOINTS.EVENTS.CREATE,
      eventData
    );
    return response.data;
  },

  // Update event (admin only)
  updateEvent: async (eventId: string, eventData: Partial<CreateEventRequest>): Promise<Event> => {
    const response = await api.patch<Event>(
      API_CONFIG.ENDPOINTS.EVENTS.UPDATE.replace(':id', eventId),
      eventData
    );
    return response.data;
  },

  // Delete event (admin only)
  deleteEvent: async (eventId: string): Promise<void> => {
    await api.delete(API_CONFIG.ENDPOINTS.EVENTS.DELETE.replace(':id', eventId));
  }
};
