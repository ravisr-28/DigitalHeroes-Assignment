import React, { useState } from 'react';
import { Card, Button, Badge, Modal } from '../ui';
import { Check, Zap, Star } from 'lucide-react';
import api from '../../lib/api';

export default function PricingModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (planType) => {
    try {
      setLoading(planType);
      const response = await api.post('/subscriptions/create-session', { planType });
      if (response.data.success && response.data.url) {
        
        
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Failed to initiate checkout:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const PlanFeature = ({ text }) => (
    <div className="flex items-center gap-3 text-sm text-gray-400">
      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
        <Check size={12} className="text-green-500" />
      </div>
      {text}
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Choose Your Hero Tier"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        {}
        <Card className="flex flex-col p-6 h-full border-white/5 hover:border-white/10 transition-colors">
          <div className="mb-6">
            <Badge variant="blue" className="mb-3">Standard</Badge>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">₹999</span>
              <span className="text-gray-500 text-sm">/month</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">Full access to monthly draws and charity logging.</p>
          </div>

          <div className="space-y-3 mb-8 flex-grow">
            <PlanFeature text="Log weekly scores" />
            <PlanFeature text="Enter monthly draws" />
            <PlanFeature text="Choose your charity" />
            <PlanFeature text="Basic analytics" />
          </div>

          <Button 
            className="w-full" 
            variant="secondary"
            onClick={() => handleSubscribe('monthly')}
            loading={loading === 'monthly'}
          >
            Start Monthly
          </Button>
        </Card>

        {}
        <Card className="flex flex-col p-6 h-full relative border-green-500/30 bg-green-500/[0.02]" glow>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="bg-green-500 text-[#0b1120] text-[9px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-green-500/20">
              <Star size={10} fill="currentColor" /> Best Value
            </div>
          </div>

          <div className="mb-6">
            <Badge variant="green" className="mb-3">Impact Elite</Badge>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">₹8,999</span>
              <span className="text-gray-500 text-sm">/year</span>
            </div>
            <p className="text-sm font-black text-green-500/80 mt-1">Saves ₹2,989 per year</p>
          </div>

          <div className="space-y-3 mb-8 flex-grow">
            <PlanFeature text="All monthly features" />
            <PlanFeature text="Priority draw entry" />
            <PlanFeature text="Exclusive Hero badge" />
            <PlanFeature text="Advanced performance stats" />
          </div>

          <Button 
            className="w-full shadow-lg shadow-green-500/20" 
            onClick={() => handleSubscribe('yearly')}
            loading={loading === 'yearly'}
          >
            Join Elite Yearly
          </Button>
        </Card>
      </div>
    </Modal>
  );
}

