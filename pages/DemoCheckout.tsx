import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DemoCheckout: React.FC = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const reservationId = params.get('reservation_id');

  const handleComplete = () => {
    // Try to confirm reservation in backend; fall back to demo confirm so UI reflects paid state
    try {
      // dynamic import to avoid circular deps at module load
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { bookingService } = require('../api/bookingService');
      if (bookingService && typeof bookingService.confirmReservation === 'function') {
        bookingService.confirmReservation(reservationId).catch(() => {});
      }
    } catch (err) {
      // ignore
    }
    navigate('/my-reservations');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Demo Checkout</h1>
        <p className="text-gray-600 mb-6">This is a local demo checkout flow. No real payment is performed.</p>
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">Reservation ID</p>
          <p className="font-mono mt-1">{reservationId || '—'}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleComplete}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Complete Demo Payment
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoCheckout;
