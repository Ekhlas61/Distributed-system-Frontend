// Simple client-side demo reservation store using localStorage
import { Reservation, ReservationStatus } from '../types';

const STORAGE_KEY = 'demo_reservations_v1';

export const demoStore = {
  load(): Reservation[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Reservation[];
    } catch {
      return [];
    }
  },

  save(items: Reservation[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  },

  addReservation(res: Reservation) {
    const items = this.load();
    items.unshift(res);
    this.save(items);
  },

  getReservationsByUser(userId?: string) {
    const items = this.load();
    if (!userId) return items;
    return items.filter(i => (i.user_id || 'demo-user') === userId);
  },

  confirmReservation(reservationId: string, amount_cents?: number) {
    const items = this.load();
    const idx = items.findIndex(i => i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId);
    // match both id and reservation id depending on shape
    const item = items.find(i => i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || i.id === reservationId || (i.id && String(i.id) === reservationId) || (i.id && i.id === reservationId) || (i.id && i.id.toString() === reservationId) || (i.id && (i.id as any) === reservationId));
    if (item) {
      item.status = ReservationStatus.CONFIRMED as any;
      if (typeof amount_cents === 'number') item.amount_cents = amount_cents;
      this.save(items);
      return true;
    }
    // try match by reservation_id field name
    const item2 = items.find(i => (i as any).reservation_id === reservationId || (i as any).id === reservationId);
    if (item2) {
      item2.status = ReservationStatus.CONFIRMED as any;
      if (typeof amount_cents === 'number') item2.amount_cents = amount_cents;
      this.save(items);
      return true;
    }
    return false;
  }
};
