
import { SystemHealth, SystemMetrics } from '../types';
import { sleep } from './client';

/**
 * SERVICE: Monitoring / Admin Service
 * RESPONSIBILITY: Aggregating health and metrics from all microservices.
 */

export const adminService = {
  getSystemHealth: async (): Promise<SystemHealth[]> => {
    await sleep(700);
    return [
      { serviceName: 'Auth-Service', status: 'UP', latency: 45, version: 'v1.2.0' },
      { serviceName: 'Event-Service', status: 'UP', latency: 120, version: 'v1.4.2' },
      { serviceName: 'Reservation-Service', status: 'UP', latency: 85, version: 'v2.0.1' },
      { serviceName: 'Payment-Gateway', status: 'UP', latency: 310, version: 'v1.0.0' },
      { serviceName: 'Notification-Service', status: 'UP', latency: 60, version: 'v1.1.0' },
      { serviceName: 'Redis-Cluster', status: 'UP', latency: 2, version: 'v6.2' },
      { serviceName: 'Kafka-Broker', status: 'DEGRADED', latency: 450, version: 'v3.5.0' },
    ];
  },

  getMetrics: async (): Promise<SystemMetrics> => {
    await sleep(500);
    return {
      totalEvents: 3,
      totalReservations: 142,
      revenue: 12450.50,
      activeUsers: 84
    };
  }
};
