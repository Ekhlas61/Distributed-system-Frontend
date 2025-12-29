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
    try {
      const response = await api.get<Event[]>(API_CONFIG.ENDPOINTS.EVENTS.LIST, { 
        params,
        headers: {} as any
      });
      return {
        data: response.data,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE,
          total: response.data.length,
          totalPages: Math.ceil(response.data.length / (params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE))
        }
      };
    } catch (error) {
      // Fallback to demo mode if backend is not available
      if (error instanceof ApiError) {
        console.warn('Backend catalog not available, using demo mode');
        
        // Simulate API Call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Demo events data
        const demoEvents: Event[] = [
          {
            id: '1',
            name: 'Tech Conference 2024',
            start_at: '2024-03-15T09:00:00Z',
            price_cents: 5000, // $50.00
            total_tickets: 100,
            tickets_sold: 45,
            tickets_held: 5,
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            name: 'Music Festival',
            start_at: '2024-04-20T18:00:00Z',
            price_cents: 7500, // $75.00
            total_tickets: 500,
            tickets_sold: 200,
            tickets_held: 15,
            created_at: '2024-01-02T00:00:00Z'
          }
        ];
        
        return {
          data: demoEvents,
          pagination: {
            page: 1,
            limit: API_CONFIG.DEFAULT_PAGE_SIZE,
            total: demoEvents.length,
            totalPages: 1
          }
        };
      }
      throw error;
    }
  },

  // Get single event details
  getEvent: async (eventId: string): Promise<Event> => {
    try {
      const response = await api.get<Event>(
        API_CONFIG.ENDPOINTS.EVENTS.DETAIL.replace(':id', eventId)
      );
      return response.data;
    } catch (error) {
      // Fallback to demo mode
      if (error instanceof ApiError) {
        console.warn('Backend catalog not available, using demo mode');
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Return demo event
        return {
          id: eventId,
          name: 'Tech Conference 2024',
          start_at: '2024-03-15T09:00:00Z',
          price_cents: 5000,
          total_tickets: 100,
          tickets_sold: 45,
          tickets_held: 5,
          created_at: '2024-01-01T00:00:00Z'
        };
      }
      throw error;
    }
  },

  // Create new event (admin only)
  createEvent: async (eventData: CreateEventRequest): Promise<Event> => {
    try {
      const response = await api.post<Event>(
        API_CONFIG.ENDPOINTS.EVENTS.CREATE,
        eventData
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.warn('Backend catalog not available, using demo mode');
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const newEvent: Event = {
          id: 'demo-' + Date.now(),
          ...eventData,
          tickets_sold: 0,
          tickets_held: 0,
          created_at: new Date().toISOString()
        };
        
        return newEvent;
      }
      throw error;
    }
  },

  // Update event (admin only)
  updateEvent: async (eventId: string, eventData: Partial<CreateEventRequest>): Promise<Event> => {
    try {
      const response = await api.patch<Event>(
        API_CONFIG.ENDPOINTS.EVENTS.UPDATE.replace(':id', eventId),
        eventData
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.warn('Backend catalog not available, using demo mode');
        
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Return updated demo event
        return {
          id: eventId,
          name: eventData.name || 'Updated Event',
          start_at: eventData.start_at || '2024-03-15T09:00:00Z',
          price_cents: eventData.price_cents || 5000,
          total_tickets: eventData.total_tickets || 100,
          tickets_sold: 45,
          tickets_held: 5,
          created_at: '2024-01-01T00:00:00Z'
        };
      }
      throw error;
    }
  },

  // Delete event (admin only)
  deleteEvent: async (eventId: string): Promise<void> => {
    try {
      await api.delete(API_CONFIG.ENDPOINTS.EVENTS.DELETE.replace(':id', eventId));
    } catch (error) {
      if (error instanceof ApiError) {
        console.warn('Backend catalog not available, using demo mode');
        await new Promise(resolve => setTimeout(resolve, 400));
        // Demo mode - just simulate deletion
      }
      throw error;
    }
  }
};
