import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Subscription {
  id: number;
  status: string;
  planType: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

interface SubscriptionState {
  isSubscribed: boolean;
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  checkSubscription: (token: string) => Promise<void>;
  createSubscription: (token: string, planType?: string) => Promise<{ subscriptionId: number; amount: number; currency: string; razorpayOrderId: string; keyId: string } | null>;
  verifySubscription: (token: string, subscriptionId: number, paymentId: string, paymentProvider: string, razorpayOrderId?: string, razorpaySignature?: string) => Promise<boolean>;
  openRazorpayCheckout: (token: string, planType: string, user: { name: string; email: string }) => Promise<boolean>;
  cancelSubscription: (token: string) => Promise<boolean>;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  isSubscribed: false,
  subscription: null,
  isLoading: false,
  error: null,

  checkSubscription: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/subscription/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({
        isSubscribed: res.data.isSubscribed,
        subscription: res.data.subscription,
        isLoading: false
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Failed to check subscription',
        isLoading: false
      });
    }
  },

  createSubscription: async (token: string, planType = 'annual') => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(
        `${API_URL}/subscription/create`,
        { planType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ isLoading: false });
      return {
        subscriptionId: res.data.subscriptionId,
        amount: res.data.amount,
        currency: res.data.currency,
        razorpayOrderId: res.data.razorpayOrderId,
        keyId: res.data.keyId
      };
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Failed to create subscription',
        isLoading: false
      });
      return null;
    }
  },

  verifySubscription: async (token: string, subscriptionId: number, paymentId: string, paymentProvider: string, razorpayOrderId?: string, razorpaySignature?: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(
        `${API_URL}/subscription/verify`,
        { subscriptionId, paymentId, paymentProvider, razorpayOrderId, razorpaySignature },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({
        isSubscribed: res.data.isSubscribed,
        subscription: res.data.subscription,
        isLoading: false
      });
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Failed to verify subscription',
        isLoading: false
      });
      return false;
    }
  },
  openRazorpayCheckout: async (token: string, planType: string, user: { name: string; email: string }) => {
    const subStore = useSubscriptionStore.getState();
    const data = await subStore.createSubscription(token, planType);
    if (!data) return false;

    return new Promise((resolve) => {
      const options = {
        key: data.keyId,
        amount: data.amount * 100,
        currency: data.currency,
        name: 'GanitQuest',
        description: `${planType === 'annual' ? 'Annual' : 'Monthly'} Pro Subscription`,
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          const success = await subStore.verifySubscription(
            token,
            data.subscriptionId,
            response.razorpay_payment_id,
            'razorpay',
            response.razorpay_order_id,
            response.razorpay_signature
          );
          resolve(success);
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#f97316',
        },
        modal: {
          ondismiss: function() {
            resolve(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        resolve(false);
      });
      rzp.open();
    });
  },

  cancelSubscription: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(
        `${API_URL}/subscription/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({
        isSubscribed: false,
        subscription: null,
        isLoading: false
      });
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Failed to cancel subscription',
        isLoading: false
      });
      return false;
    }
  },

  clearError: () => set({ error: null })
}));
