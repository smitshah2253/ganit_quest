import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Play, Trophy, CheckCircle, Crown } from 'lucide-react';
import { useSubscriptionStore } from '@/store/subscription.store';
import { useAuthStore } from '@/store/auth.store';

interface PaywallProps {
  onSubscribe?: () => void;
  previewContent?: React.ReactNode;
}

export const Paywall: React.FC<PaywallProps> = ({ onSubscribe, previewContent }) => {
  const { isLoading, createSubscription } = useSubscriptionStore();
  const { token } = useAuthStore();

  const handleSubscribe = async () => {
    if (!token) return;
    
    const result = await createSubscription(token, 'annual');
    if (result) {
      // In production, this would redirect to payment gateway
      // For now, we simulate a successful subscription
      onSubscribe?.();
    }
  };

  const features = [
    'Interactive animations for all 5 chapters',
    'Coordinate Geometry Lab with unlimited practice',
    'Arithmetic Progressions visualizer',
    'Trigonometry unit circle explorer',
    'Probability simulation tools',
    'Progress tracking across all devices',
    'Priority support'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Preview Section (Free) */}
      {previewContent && (
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-slate-800">Free Preview</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
              Available
            </span>
          </div>
          {previewContent}
        </div>
      )}

      {/* Paywall Section */}
      <div className="p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-orange-500 p-3 rounded-full shadow-lg">
            <Crown className="w-8 h-8 text-white" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-center text-slate-800 mb-2">
          Unlock Full Learning Experience
        </h3>
        <p className="text-center text-slate-600 mb-6">
          Get unlimited access to all interactive animations and premium features
        </p>

        {/* Pricing Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200 mb-6"
        >
          <div className="text-center">
            <span className="text-sm text-slate-500 uppercase tracking-wider">Annual Plan</span>
            <div className="flex items-baseline justify-center gap-1 mt-2">
              <span className="text-4xl font-bold text-slate-900">₹499</span>
              <span className="text-slate-500">/year</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Just ₹42/month · Save 40%
            </p>
          </div>

          <div className="my-4 h-px bg-slate-100" />

          <ul className="space-y-3">
            {features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Subscribe Now - ₹499/year'}
          </button>

          <p className="text-xs text-center text-slate-500">
            Cancel anytime. 7-day money-back guarantee.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-orange-200">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Lock className="w-4 h-4" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Trophy className="w-4 h-4" />
            <span>Premium Content</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Sparkles className="w-4 h-4" />
            <span>Instant Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};
