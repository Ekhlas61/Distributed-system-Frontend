
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event, User } from '../types';
import { eventService } from '../api/eventService';
import { reservationService } from '../api/reservationService';
import SystemInsight from '../components/SystemInsight';

interface EventDetailPageProps {
  user: User | null;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchDetail = async () => {
      if (id) {
        const data = await eventService.getEventById(id);
        if (data) setEvent(data);
        else navigate('/');
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!event) return;

    setBooking(true);
    try {
      // Calls Reservation Microservice (Synchronous REST Call)
      await reservationService.createReservation(event, user.id, quantity);
      navigate('/my-reservations');
    } catch (err) {
      alert('Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading || !event) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium animate-pulse">Fetching event blueprint...</p>
    </div>
  );

  const totalPrice = event.price * quantity;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100">
        <div className="relative h-[450px]">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-10">
            <span className="w-fit px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-full mb-6 shadow-xl uppercase tracking-[0.2em]">
              {event.category}
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
              {event.title}
            </h1>
            <div className="flex items-center text-blue-200 text-lg font-medium space-x-6">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {event.venue}
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-1 bg-blue-600 rounded-full mr-3"></span>
                Event Overview
              </h2>
              <p className="text-gray-600 leading-relaxed text-xl font-light">{event.description}</p>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <p className={`text-xl font-black ${event.availableTickets > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {event.availableTickets > 0 ? 'Booking Open' : 'Sold Out'}
                  </p>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-bold text-gray-400 uppercase mb-2">
                    <span>Availability</span>
                    <span>{Math.round((event.availableTickets / event.totalTickets) * 100)}% left</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${(event.availableTickets / event.totalTickets) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Service Node</p>
                <p className="text-xl font-black text-blue-900">Event-Svc-01</p>
                <p className="mt-2 text-xs text-blue-600/70 font-mono">Region: us-east-1a</p>
                <p className="text-xs text-blue-600/70 font-mono">Latency: 12ms</p>
              </div>
            </div>

            <SystemInsight 
              topic="Double-Booking Prevention" 
              context={`The Reservation service uses distributed locking or database constraints to ensure that during high concurrency, the ${event.availableTickets} available tickets aren't over-allocated.`} 
            />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] p-8 border-2 border-gray-50 shadow-2xl shadow-gray-200/50 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Purchase Tickets</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-gray-500 font-medium">Single Price</span>
                  <span className="text-2xl font-black text-gray-900">${event.price.toFixed(2)}</span>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Quantity</label>
                  <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-100 p-2">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={event.availableTickets === 0}
                      className="w-12 h-12 flex items-center justify-center text-blue-600 hover:bg-white rounded-xl transition-all disabled:opacity-30"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                    </button>
                    <span className="flex-grow text-center text-2xl font-black text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(5, quantity + 1))}
                      disabled={event.availableTickets === 0 || quantity >= event.availableTickets}
                      className="w-12 h-12 flex items-center justify-center text-blue-600 hover:bg-white rounded-xl transition-all disabled:opacity-30"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total Amount</span>
                    <span className="text-4xl font-black text-blue-600">${totalPrice.toFixed(2)}</span>
                  </div>

                  <button 
                    onClick={handleBook}
                    disabled={booking || event.availableTickets === 0}
                    className={`w-full py-4 rounded-2xl text-lg font-black tracking-tight shadow-xl transition-all transform active:scale-95 ${
                      event.availableTickets > 0 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    } ${booking ? 'opacity-70' : ''}`}
                  >
                    {booking ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Initiating Transaction...
                      </span>
                    ) : event.availableTickets > 0 ? 'Confirm Reservation' : 'Unavailable'}
                  </button>
                  
                  <p className="mt-4 text-center text-[10px] text-gray-400 font-medium">
                    Secured by Payment-Svc & Auth-Svc encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
