import React, { useState } from 'react';
import { bookingService } from '../api/bookingService';
import { paymentService } from '../api/paymentService';
import { Event, ReservationResponse } from '../types';

interface PaymentModalProps {
  event: Event;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ event, quantity, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reservation, setReservation] = useState<ReservationResponse | null>(null);

  const totalAmount = event.price_cents * quantity;
  const formattedAmount = (totalAmount / 100).toFixed(2);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create reservation
      const reservationResponse = await bookingService.createReservation({
        event_id: event.id,
        quantity
      });

      // Calculate the total amount (since demo mode returns 0)
      const calculatedAmount = event.price_cents * quantity;

      // Step 2: Create payment intent
      const paymentResponse = await paymentService.createPayment({
        reservation_id: reservationResponse.reservation_id
      });

      // For demo purposes, simulate successful payment
      // In production, this would redirect to Stripe Checkout
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update reservation with correct amount
      const updatedReservation = {
        ...reservationResponse,
        amount_cents: calculatedAmount
      };

      // Confirm reservation so it appears in user's reservations (demo and backend)
      try {
        await bookingService.confirmReservation(updatedReservation.reservation_id, calculatedAmount);
      } catch (e) {
        // ignore confirmation errors in UI
      }

      setReservation(updatedReservation);
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setReservation(null);
    setError(null);
    onClose();
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create reservation first
      const reservationResponse = await bookingService.createReservation({
        event_id: event.id,
        quantity
      });

      // Redirect to demo checkout page
      window.location.href = `/#/demo/checkout?reservation_id=${reservationResponse.reservation_id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {showSuccess ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">
              Your reservation has been confirmed. You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">Reservation ID</p>
              <p className="font-mono text-sm font-medium">{reservation?.reservation_id}</p>
            </div>
            <button
              onClick={handleClose}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Complete Your Purchase</h2>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">{event.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(event.start_at).toLocaleDateString()} at {new Date(event.start_at).toLocaleTimeString()}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quantity: {quantity}</span>
                    <span className="text-lg font-bold text-gray-900">${formattedAmount}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Credit/Debit Card</p>
                      <p className="text-xs text-gray-500">Secure payment powered by Stripe</p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleStripeCheckout}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                >
                  {loading ? 'Processing...' : `Pay $${formattedAmount}`}
                </button>
                
               

                <button
                  onClick={handleClose}
                  className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  🔒 Your payment information is secure and encrypted.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
