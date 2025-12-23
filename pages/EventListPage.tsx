
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types';
import { eventService } from '../api/eventService';

const EventListPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await eventService.getAllEvents();
      setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100 shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Upcoming Events</h1>
          <p className="mt-2 text-lg text-gray-500">Live inventory synced from Distributed Event Service.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Synced with Event-Svc</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map(event => (
          <div key={event.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-600 shadow-sm">
                  {event.category}
                </span>
              </div>
              {event.availableTickets === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="px-6 py-2 bg-red-600 text-white text-sm font-bold rounded-lg transform -rotate-12 shadow-lg">SOLD OUT</span>
                </div>
              )}
            </div>
            
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-4 space-x-3">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Starts from</p>
                  <p className="text-lg font-extrabold text-blue-600">${event.price.toFixed(2)}</p>
                </div>
                
                <Link 
                  to={`/events/${event.id}`}
                  className={`inline-flex items-center px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition-all ${
                    event.availableTickets > 0 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {event.availableTickets > 0 ? 'View Detail' : 'No Seats'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventListPage;
