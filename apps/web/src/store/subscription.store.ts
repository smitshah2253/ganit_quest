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
  createSubscription: (token: string, planType?: string) => Promise<{ subscriptionId: number; amount: number; currency: string } | null>;
  verifySubscription: (token: string, subscriptionId: number, paymentId: string, paymentProvider: string) => Promise<boolean>;
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
        currency: res.data.currency
      };
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Failed to create subscription',
        isLoading: false
      });
      return null;
    }
  },

  verifySubscription: async (token: string, subscriptionId: number, paymentId: string, paymentProvider: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(
        `${API_URL}/subscription/verify`,
        { subscriptionId, paymentId, paymentProvider },
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
