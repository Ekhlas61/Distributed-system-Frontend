
import React, { useState, useEffect } from 'react';
import { User, Reservation } from '../types';
import { reservationService } from '../api/reservationService';
import StatusBadge from '../components/StatusBadge';
import ReservationTimeline from '../components/ReservationTimeline';
import SystemInsight from '../components/SystemInsight';

interface MyReservationsPageProps {
  user: User;
}

const MyReservationsPage: React.FC<MyReservationsPageProps> = ({ user }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    const data = await reservationService.getMyReservations(user.id);
    setReservations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
    
    // UI POLLING:
    // In a microservices frontend, we poll the backend to observe updates 
    // published by async workers (Payment, Notification, etc.)
    const interval = setInterval(fetchReservations, 3000);
    return () => clearInterval(interval);
  }, [user.id]);

  if (loading) return <div className="text-center py-20 animate-pulse">Scanning reservation vault...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Reservations</h1>
          <p className="mt-2 text-lg text-gray-500">Track your tickets through the distributed processing pipeline.</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-2xl flex items-center space-x-3 border border-blue-100">
          <div className="flex space-x-1">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></span>
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '400ms'}}></span>
          </div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Polling Backend Events</span>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] p-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">No bookings yet</h3>
          <p className="text-gray-500 mt-2">Explore events and start your distributed booking journey.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {reservations.map(res => (
            <div key={res.id} className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden transform transition hover:scale-[1.01]">
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-2">
                      <StatusBadge status={res.status} />
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tight">ID: {res.id}</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{res.eventTitle}</h3>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                        {res.ticketQuantity} Tickets
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Total: ${res.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="md:w-64 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <ReservationTimeline status={res.status} />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50/50 px-8 py-4 border-t border-gray-100 flex justify-between items-center">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                   Event Loop: {new Date(res.updatedAt).toLocaleTimeString()}
                 </p>
                 <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[10px] font-mono text-gray-500">Active Pipeline</span>
                 </div>
              </div>
            </div>
          ))}
          
          <SystemInsight 
            topic="Async Status Updates" 
            context="The frontend doesn't see the Pub/Sub bus directly. Instead, microservices update the Reservation aggregate state in the database, and the frontend polls (or uses WebSockets) to visualize the eventual consistency of the paid and notified states." 
          />
        </div>
      )}
    </div>
  );
};

export default MyReservationsPage;
