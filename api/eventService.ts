
import { Event } from '../types';
import { sleep } from './client';

/**
 * SERVICE: Event Service
 * RESPONSIBILITY: Managing event catalog, schedules, and ticket availability.
 */

const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    name: 'Distributed Systems Conference 2024',
    description: 'Learn about microservices, Pub/Sub patterns, and cloud-native architecture from industry experts.',
    start_at: '2024-10-15T09:00:00Z',
    venue: 'Grand Tech Hall, San Francisco',
    price_cents: 29900,
    total_tickets: 500,
    tickets_sold: 376,
    tickets_held: 0,
    metadata: { category: 'Technology' },
    image: 'https://picsum.photos/seed/tech/800/400',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'e2',
    name: 'Neo-Jazz Summer Night',
    description: 'A magical evening of modern jazz and fusion melodies under the stars.',
    start_at: '2024-08-22T20:00:00Z',
    venue: 'City Botanical Garden',
    price_cents: 4500,
    total_tickets: 200,
    tickets_sold: 200,
    tickets_held: 0,
    metadata: { category: 'Music' },
    image: 'https://picsum.photos/seed/jazz/800/400',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'e3',
    name: 'React & AI Workshop',
    description: 'Deep dive into building GenAI powered React applications with Gemini API.',
    start_at: '2024-11-05T10:00:00Z',
    venue: 'Silicon Valley Hub',
    price_cents: 15000,
    total_tickets: 100,
    tickets_sold: 58,
    tickets_held: 0,
    metadata: { category: 'Workshop' },
    image: 'https://picsum.photos/seed/code/800/400',
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const eventService = {
  getAllEvents: async (): Promise<Event[]> => {
    await sleep(600);
    return MOCK_EVENTS;
  },

  getEventById: async (id: string): Promise<Event | undefined> => {
    await sleep(400);
    return MOCK_EVENTS.find(e => e.id === id);
  }
};
