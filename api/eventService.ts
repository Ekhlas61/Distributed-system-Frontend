
import { Event } from '../types';
import { sleep } from './client';

/**
 * SERVICE: Event Service
 * RESPONSIBILITY: Managing event catalog, schedules, and ticket availability.
 */

const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Distributed Systems Conference 2024',
    description: 'Learn about microservices, Pub/Sub patterns, and cloud-native architecture from industry experts.',
    date: '2024-10-15T09:00:00Z',
    venue: 'Grand Tech Hall, San Francisco',
    price: 299.00,
    totalTickets: 500,
    availableTickets: 124,
    category: 'Technology',
    image: 'https://picsum.photos/seed/tech/800/400'
  },
  {
    id: 'e2',
    title: 'Neo-Jazz Summer Night',
    description: 'A magical evening of modern jazz and fusion melodies under the stars.',
    date: '2024-08-22T20:00:00Z',
    venue: 'City Botanical Garden',
    price: 45.00,
    totalTickets: 200,
    availableTickets: 0,
    category: 'Music',
    image: 'https://picsum.photos/seed/jazz/800/400'
  },
  {
    id: 'e3',
    title: 'React & AI Workshop',
    description: 'Deep dive into building GenAI powered React applications with Gemini API.',
    date: '2024-11-05T10:00:00Z',
    venue: 'Silicon Valley Hub',
    price: 150.00,
    totalTickets: 100,
    availableTickets: 42,
    category: 'Workshop',
    image: 'https://picsum.photos/seed/code/800/400'
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
