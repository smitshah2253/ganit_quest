import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { useSubscriptionStore } from '@/store/subscription.store';

export const SubscriptionBadge: React.FC = () => {
  const navigate = useNavigate();
  const { isSubscribed } = useSubscriptionStore();

  return (
    <button
      onClick={() => navigate('/subscription')}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all border ${
        isSubscribed
          ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent hover:shadow-md hover:scale-105'
          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
      }`}
      title={isSubscribed ? 'Pro Member' : 'Upgrade to Pro'}
    >
      <Crown className={`w-3.5 h-3.5 ${isSubscribed ? 'fill-current' : ''}`} />
      <span className="text-[10px] sm:text-xs font-bold tracking-wide uppercase">
        {isSubscribed ? 'PRO' : 'Upgrade'}
      </span>
    </button>
  );
};
