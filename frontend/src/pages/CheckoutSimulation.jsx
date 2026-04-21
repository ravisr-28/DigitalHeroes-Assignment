import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Spinner } from '../components/ui';
import { CreditCard, ShieldCheck, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';

export default function CheckoutSimulation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const plan = searchParams.get('plan') || 'monthly';
  
  const [status, setStatus] = useState('idle'); 
  const price = plan === 'monthly' ? '₹999' : '₹8,999';

  const handlePayment = async (e) => {
    e.preventDefault();
    setStatus('processing');

    try {
      
      await new Promise(resolve => setTimeout(resolve, 2500));

      const response = await api.post('/subscriptions/verify-payment', {
        sessionId,
        planType: plan
      });

      if (response.data.success) {
        setStatus('success');
        
        setTimeout(() => {
          navigate('/dashboard');
          
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment simulation failed. Please try again.');
      setStatus('idle');
    }
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Invalid Session</h1>
          <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white py-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {}
        <div className="space-y-8">
           <button 
             onClick={() => navigate('/dashboard')}
             className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-sm font-bold uppercase tracking-widest"
           >
             <ArrowLeft size={16} /> Cancel & Return
           </button>

           <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight">Complete your <br/><span className="text-green-500">Subscription.</span></h1>
              <p className="text-gray-400 text-sm">You are subscribing to the {plan} plan. Your first month is backed by our transparency guarantee.</p>
           </div>

           <Card className="p-6 bg-white/[0.02]">
              <div className="flex justify-between items-center mb-4">
                 <p className="text-sm text-gray-400">Selected Plan</p>
                 <Badge variant={plan === 'yearly' ? 'green' : 'blue'}>{plan.toUpperCase()}</Badge>
              </div>
              <div className="flex justify-between items-baseline">
                 <p className="text-3xl font-black text-white">{price}</p>
                 <p className="text-xs text-gray-500">/ {plan === 'monthly' ? 'mo' : 'yr'}</p>
              </div>
              <div className="border-t border-white/5 mt-6 pt-6 space-y-3">
                 <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-500">Platform Fee</span>
                    <span>₹0</span>
                 </div>
                 <div className="flex justify-between text-base font-black">
                    <span>Total Due Today</span>
                    <span className="text-green-500">{price}</span>
                 </div>
              </div>
           </Card>

           <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <div className="flex items-center gap-1"><Lock size={12}/> Secure</div>
              <div className="flex items-center gap-1"><ShieldCheck size={12}/> PCI Compliant</div>
           </div>
        </div>

        {}
        <Card className="p-8 relative overflow-hidden" glow={status === 'processing'}>
           {status === 'processing' && (
             <div className="absolute inset-0 bg-[#111827]/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-8">
                <Spinner />
                <p className="mt-4 font-bold text-white">Communicating with Gateway...</p>
                <p className="text-xs text-gray-500 mt-1">Please do not refresh the page.</p>
             </div>
           )}

           {status === 'success' && (
             <div className="absolute inset-0 bg-[#111827] z-30 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                   <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Payment Heroic!</h2>
                <p className="text-gray-400 text-sm">Your subscription is now active. You are being redirected to your Command Center.</p>
             </div>
           )}

           <form onSubmit={handlePayment} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                    <CreditCard size={20} />
                 </div>
                 <h2 className="text-xl font-bold">Card Details</h2>
              </div>

              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
                      required
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Expiry Date</label>
                       <input 
                         type="text" 
                         placeholder="MM / YY"
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
                         required
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">CVV</label>
                       <input 
                         type="text" 
                         placeholder="***"
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
                         required
                       />
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="HERO PLAYER"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
                      required
                    />
                 </div>
              </div>

              <Button type="submit" className="w-full mt-4 h-14 text-white shadow-xl shadow-green-500/20" size="lg">
                 Pay {price}
              </Button>
              
              <p className="text-[9px] text-center text-gray-600 font-medium">
                 By completing this payment, you agree to the Golf Charity Club Terms of Service and Privacy Policy. Subscriptions renew automatically until canceled.
              </p>
           </form>
        </Card>
      </div>
    </div>
  );
}

