import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useSubscriptionStore } from '@/store/subscription.store';
import { useAuthStore } from '@/store/auth.store';

const FEATURES = [
  'Access to all Grade 1-12 Mathematics Labs',
  'Unlimited interactive practice exercises',
  'Detailed performance analytics and reports',
  'Priority support from educators',
  'Ad-free learning experience',
  'Offline access (coming soon)'
];

export const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { 
    isSubscribed, 
    subscription, 
    isLoading, 
    error,
    checkSubscription, 
    openRazorpayCheckout,
    cancelSubscription,
    clearError
  } = useSubscriptionStore();

  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      checkSubscription(token);
    }
  }, [token]);

  const handleSubscribe = async (planType: string) => {
    if (!token || !user) {
      navigate('/login');
      return;
    }
    
    setProcessingPlan(planType);
    clearError();
    
    const success = await openRazorpayCheckout(token, planType, {
      name: user.name,
      email: user.email
    });
    
    setProcessingPlan(null);
    if (success) {
      // Payment successful
    }
  };

  const handleCancel = async () => {
    if (!token || !window.confirm('Are you sure you want to cancel your PRO subscription? You will lose access at the end of your current billing period.')) return;
    await cancelSubscription(token);
  };

  if (isLoading && !processingPlan && !subscription) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-slate-800 p-4 sm:p-6 md:p-10 relative overflow-y-auto select-none pt-20">
      <div className="absolute top-0 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-40 h-40 sm:w-[30rem] sm:h-[30rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-slate-900 transition-all font-semibold bg-white/80 backdrop-blur px-4 py-2 rounded-xl border border-slate-200 shadow-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-orange-500/20 mb-4">
            <Crown className="w-8 h-8 text-white fill-current" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            GanitQuest <span className="text-orange-600">PRO</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Unlock the full potential of your mathematical journey with unlimited access to all labs and features.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {isSubscribed && subscription ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-orange-200 shadow-xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Subscription
                </div>
                <h2 className="text-2xl font-bold mb-1">PRO {subscription.planType === 'annual' ? 'Annual' : 'Monthly'} Plan</h2>
                <p className="text-slate-500">
                  Valid until {new Date(subscription.endDate).toLocaleDateString()} ({subscription.daysRemaining} days remaining)
                </p>
              </div>
              <button 
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-2.5 text-red-600 font-semibold border border-red-200 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Monthly Plan */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 p-6 sm:p-8 relative transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Monthly Pass</h3>
              <p className="text-slate-500 text-sm mb-6">Perfect for short-term practice</p>
              
              <div className="mb-6">
                <span className="text-4xl font-black">₹99</span>
                <span className="text-slate-500 font-medium">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                {FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-600 font-medium leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe('monthly')}
                disabled={!!processingPlan}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {processingPlan === 'monthly' ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Choose Monthly
              </button>
            </div>

            {/* Annual Plan */}
            <div className="bg-gradient-to-b from-orange-50 to-white rounded-3xl border-2 border-orange-400 p-6 sm:p-8 relative shadow-xl shadow-orange-500/10 transition-transform hover:-translate-y-1">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                Best Value
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-2">Annual Pass</h3>
              <p className="text-slate-500 text-sm mb-6">Save 58% with yearly billing</p>
              
              <div className="mb-6">
                <span className="text-4xl font-black text-orange-600">₹499</span>
                <span className="text-slate-500 font-medium">/year</span>
              </div>

              <ul className="space-y-4 mb-8">
                {FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-orange-500 shrink-0" />
                    <span className="text-sm text-slate-700 font-medium leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe('annual')}
                disabled={!!processingPlan}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {processingPlan === 'annual' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crown className="w-4 h-4 fill-current" />}
                Unlock PRO Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
