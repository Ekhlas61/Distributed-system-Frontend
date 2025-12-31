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
    } catch (error) {
      // Demo fallback when backend is unavailable or access denied
      if (error instanceof ApiError) {
        console.warn('Catalog getEvents backend not available, using demo events');
        const STORAGE_KEY = 'demo_events_v1';
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const items: Event[] = raw ? JSON.parse(raw) : [];
          const paged = items.slice(0, params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE);
          return {
            data: paged,
            pagination: {
              page: params?.page || 1,
              limit: params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE,
              total: items.length,
              totalPages: Math.max(1, Math.ceil(items.length / (params?.limit || API_CONFIG.DEFAULT_PAGE_SIZE)))
            }
          };
        } catch (e) {
          return {
            data: [],
            pagination: { page: 1, limit: API_CONFIG.DEFAULT_PAGE_SIZE, total: 0, totalPages: 0 }
          };
        }
      }
      throw error;
    }
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
    try {
      const response = await api.post<Event>(
        API_CONFIG.ENDPOINTS.EVENTS.CREATE,
        eventData
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.warn('Catalog createEvent backend not available, applying demo fallback');
        // Demo: persist to localStorage so admin users can create events locally
        const STORAGE_KEY = 'demo_events_v1';
        const load = (): Event[] => {
          try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
        };
        const save = (items: Event[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

        const newEvent: Event = {
          id: 'evt-' + Math.random().toString(36).substr(2, 9),
          name: eventData.name,
          start_at: eventData.start_at,
          price_cents: eventData.price_cents,
          total_tickets: eventData.total_tickets,
          tickets_sold: 0,
          tickets_held: 0,
          description: (eventData as any).description || '',
          image: '',
          venue: (eventData as any).venue || '',
          metadata: eventData.metadata || {},
          created_at: new Date().toISOString()
        };

        const items = load();
        items.unshift(newEvent);
        save(items);
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
        console.warn('Catalog updateEvent backend not available, applying demo fallback');
        const STORAGE_KEY = 'demo_events_v1';
        const load = (): Event[] => { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } };
        const save = (items: Event[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        const items = load();
        const idx = items.findIndex(i => i.id === eventId);
        if (idx !== -1) {
          items[idx] = { ...items[idx], ...eventData } as Event;
          save(items);
          return items[idx];
        }
        throw new Error('Event not found in demo store');
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
        console.warn('Catalog deleteEvent backend not available, applying demo fallback');
        const STORAGE_KEY = 'demo_events_v1';
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const items: Event[] = raw ? JSON.parse(raw) : [];
          const filtered = items.filter(i => i.id !== eventId);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
          return;
        } catch (e) {
          // ignore
        }
        return;
      }
      throw error;
    }
  }
};
