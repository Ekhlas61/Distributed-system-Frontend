
import { Reservation, ReservationStatus, Event } from '../types';
import { sleep } from './client';

/**
 * SERVICE: Reservation / Booking Service
 * RESPONSIBILITY: Handling transactional seat reservations.
 * 
 * WORKFLOW:
 * 1. Client calls REST POST /reservations (Synchronous)
 * 2. Reservation Service publishes 'ticket.reserved' (Pub/Sub)
 * 3. Payment Service consumes event, processes payment, then publishes 'payment.confirmed' (Pub/Sub)
 * 4. Notification Service consumes confirmation and sends email.
 */

// In-memory mock store for demo persistence
let reservations: Reservation[] = [];

export const reservationService = {
  createReservation: async (event: Event, userId: string, quantity: number): Promise<Reservation> => {
    await sleep(1000);
    
    const newReservation: Reservation = {
      id: 'res-' + Math.random().toString(36).substr(2, 9),
      eventId: event.id,
      eventTitle: event.title,
      userId,
      status: ReservationStatus.PENDING,
      ticketQuantity: quantity,
      totalAmount: event.price * quantity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    reservations.push(newReservation);
    
    // Simulate Background Pub/Sub Workflow (This would happen in backend)
    // We update the state over time so the UI can "poll" and show changes
    setTimeout(() => {
      const res = reservations.find(r => r.id === newReservation.id);
      if (res) {
        res.status = ReservationStatus.PAID;
        res.updatedAt = new Date().toISOString();
      }
    }, 5000);

    setTimeout(() => {
      const res = reservations.find(r => r.id === newReservation.id);
      if (res) {
        res.status = ReservationStatus.NOTIFIED;
        res.updatedAt = new Date().toISOString();
      }
    }, 10000);
    
    return newReservation;
  },

  getMyReservations: async (userId: string): Promise<Reservation[]> => {
    await sleep(500);
    return reservations.filter(r => r.userId === userId);
  },

  getReservationStatus: async (id: string): Promise<Reservation | undefined> => {
    await sleep(300);
    return reservations.find(r => r.id === id);
  }
};
