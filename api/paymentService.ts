import { 
  Payment, 
  CreatePaymentRequest, 
  PaymentIntentResponse,
  StripeWebhookEvent 
} from '../types';
import { api, ApiError } from './client';
import { API_CONFIG } from '../config/api';

/**
 * SERVICE: Payment Service
 * RESPONSIBILITY: Stripe integration and payment processing
 * INTEGRATION: Backend team's payment endpoints
 */
export const paymentService = {
  // Create payment session for a reservation
  createPayment: async (paymentData: CreatePaymentRequest): Promise<PaymentIntentResponse> => {
    try {
      const response = await api.post<PaymentIntentResponse>(
        API_CONFIG.ENDPOINTS.PAYMENTS.CREATE,
        paymentData
      );
      return response.data;
    } catch (error) {
      // Fallback to demo mode if backend is not available
      if (error instanceof ApiError) {
        console.warn('Backend payment not available, using demo mode');
        
        // Simulate API Call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate demo payment response
        return {
          client_secret: 'pi_' + Math.random().toString(36).substr(2, 20) + '_secret_' + Math.random().toString(36).substr(2, 20),
          checkout_url: `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substr(2, 20)}`
        };
      }
      throw error;
    }
  },

  // Process Stripe webhook (for backend use, not typically called from frontend)
  processWebhook: async (webhookData: StripeWebhookEvent): Promise<void> => {
    try {
      await api.post(
        API_CONFIG.ENDPOINTS.PAYMENTS.WEBHOOK,
        webhookData
      );
    } catch (error) {
      if (error instanceof ApiError) {
        console.warn('Backend payment not available, using demo mode');
        await new Promise(resolve => setTimeout(resolve, 300));
        // Demo mode - just simulate webhook processing
      }
      throw error;
    }
  },

  // Get payment details (if needed)
  getPayment: async (paymentId: string): Promise<Payment> => {
    try {
      const response = await api.get<Payment>(`/api/v1/payments/${paymentId}/`);
      return response.data;
    } catch (error) {
      // Fallback to demo mode
      if (error instanceof ApiError) {
        console.warn('Backend payment not available, using demo mode');
        
        await new Promise(resolve => setTimeout(resolve, 400));
        
        return {
          id: paymentId,
          reservation_id: 'res-1',
          stripe_payment_intent: 'pi_' + Math.random().toString(36).substr(2, 20),
          status: 'succeeded',
          amount_cents: 10000,
          created_at: new Date().toISOString()
        };
      }
      throw error;
    }
  }
};

// Stripe integration utilities
export const stripeUtils = {
  // Initialize Stripe (to be used with Stripe.js)
  getStripePublishableKey: (): string => {
    return API_CONFIG.STRIPE.PUBLISHABLE_KEY;
  },

  // Format amount for Stripe (in cents)
  formatAmount: (amount: number): number => {
    return Math.round(amount * 100);
  },

  // Format amount for display (from cents to dollars)
  formatForDisplay: (amountCents: number): string => {
    return (amountCents / 100).toFixed(2);
  },

  // Create payment method configuration
  createPaymentMethodConfig: () => ({
    type: 'card',
    billingDetails: {
      name: 'Customer Name',
      email: 'customer@example.com'
    }
  })
};
