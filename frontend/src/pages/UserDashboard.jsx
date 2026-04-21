import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Card, Button, Badge, Spinner, EmptyState, Modal } from '../components/ui';
import PricingModal from '../components/subscription/PricingModal';
import { 
  Trophy, 
  Target, 
  Heart, 
  CreditCard, 
  Plus, 
  Trash2, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  Lock
} from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [isCharityModalOpen, setIsCharityModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  
  const [scoreValue, setScoreValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/users/dashboard');
      if (response.data?.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.response?.data?.message || 'Failed to sync with Hero Service');
    } finally {
      setLoading(false);
    }
  };

  const fetchCharities = async () => {
    try {
      const response = await api.get('/charities');
      if (response.data?.success) {
        setCharities(response.data.data || []);
      }
    } catch (err) {
      console.error('Charity fetch error:', err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchCharities();
  }, []);

  const handleAddScore = async (e) => {
    e.preventDefault();
    if (!scoreValue) return;
    setSubmitting(true);
    try {
      await api.post('/scores', { value: parseInt(scoreValue) });
      setScoreValue('');
      setIsScoreModalOpen(false);
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log score');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteScore = async (date) => {
    if (!date) return;
    if (!confirm('Are you sure you want to delete this score?')) return;
    try {
      const dateKey = typeof date === 'string' ? date.split('T')[0] : new Date(date).toISOString().split('T')[0];
      await api.delete(`/scores/${dateKey}`);
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSelectCharity = async (charityId) => {
    setSubmitting(true);
    try {
      await api.put('/charities/config', { charityId });
      setIsCharityModalOpen(false);
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || 'Charity update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0b1120] text-white"><Spinner /></div>;
  
  if (error) return (
    <div className="min-h-screen pt-32 text-center bg-[#0b1120] px-4 text-white">
      <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
      <h2 className="text-xl font-bold mb-2">Sync Interrupted</h2>
      <p className="text-gray-400 mb-6">{error}</p>
      <Button onClick={() => window.location.reload()}>Retry Connection</Button>
    </div>
  );

  const profile = data?.profile || {};
  const subscription = data?.subscription || {};
  const scores = data?.scores || { count: 0, history: [] };
  const charityConfig = data?.charityConfig || {};
  const winningsOverview = data?.winningsOverview || { totalWon: 0, pendingPayouts: 0, detailedWinnings: [] };
  const participation = data?.participationSummary || { drawsEntered: 0 };
  
  const isActive = subscription.status === 'active';

  return (
    <div className="min-h-screen bg-[#0b1120] pt-24 pb-20 px-6 sm:px-8 lg:px-12 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Hero Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, {profile.name || 'Hero'}. Your impact matters.</p>
          </div>
          <div className="flex gap-3">
             <Badge variant={isActive ? 'green' : 'amber'}>
               {(subscription.status || 'inactive').toUpperCase()}
             </Badge>
             {charityConfig.selectedCharity && charityConfig.selectedCharity !== 'None Selected' && (
               <Badge variant="blue">SUPPORTING: {charityConfig.selectedCharity.toUpperCase()}</Badge>
             )}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Trophy} label="Total Winnings" value={`₹${winningsOverview.totalWon || 0}`} sub={`₹${winningsOverview.pendingPayouts} Pending`} color="text-amber-500" />
          <StatCard icon={Target} label="Scores Logged" value={scores.count || 0} sub="Target: 5 scores" color="text-blue-500" />
          <StatCard icon={Heart} label="Charity Share" value={`${charityConfig.percentage || 10}%`} sub="Of winnings" color="text-red-500" />
          <StatCard icon={Calendar} label="Draws Entered" value={participation.drawsEntered || 0} sub="Lifetime" color="text-green-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 relative overflow-hidden">
              {!isActive && (
                <div className="absolute inset-0 z-10 bg-[#111827]/60 backdrop-blur-[2px] flex items-center justify-center p-8 text-center">
                   <div className="max-w-xs">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-500">
                         <Lock size={24} />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Restricted Access</h3>
                      <p className="text-xs text-gray-400 mb-6">Upgrade to a Hero plan to log scores and qualify for monthly draws.</p>
                      <Button size="sm" onClick={() => setIsPricingModalOpen(true)}>Unlock Now</Button>
                   </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Baseline Scores</h2>
                  <p className="text-xs text-gray-500">Log 5 scores to enter the draw.</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setIsScoreModalOpen(true)} 
                  className="text-black"
                  disabled={!isActive}
                >
                  <Plus size={16} /> Add Score
                </Button>
              </div>

              {Array.isArray(scores.history) && scores.history.length > 0 ? (
                <div className="space-y-3">
                  {scores.history.map((score, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center font-black text-green-500">
                          {score.value}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase">Entry Date</p>
                          <p className="text-sm font-medium">{score.date ? new Date(score.date).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      <Button variant="danger" size="sm" className="p-2" onClick={() => handleDeleteScore(score.date)} disabled={!isActive}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={TrendingUp} text="No scores yet" description="Log your first score to start qualifying." />
              )}
            </Card>

            <Card className="p-6">
               <h2 className="text-xl font-bold mb-6">Winnings History</h2>
               {Array.isArray(winningsOverview.detailedWinnings) && winningsOverview.detailedWinnings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="text-[10px] uppercase font-black text-gray-500 tracking-widest border-b border-white/5">
                        <tr>
                          <th className="pb-4">Draw</th>
                          <th className="pb-4">Prize</th>
                          <th className="pb-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {winningsOverview.detailedWinnings.map((win, idx) => (
                          <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                            <td className="py-4 font-bold">{win.drawMonth}</td>
                            <td className="py-4 font-black text-green-500">₹{win.prize}</td>
                            <td className="py-4 text-xs uppercase font-bold text-gray-500">{win.paymentStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               ) : (
                  <EmptyState icon={Trophy} text="No prizes yet" description="Stay active, your draw breakthrough is coming." />
               )}
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Membership</h2>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Plan</p>
                 <p className="text-xl font-black">{(subscription.plan || 'NONE').toUpperCase()}</p>
              </div>
              <Button 
                className="w-full text-black" 
                onClick={() => setIsPricingModalOpen(true)}
              >
                {isActive ? 'Manage Subscription' : 'Upgrade to Hero'}
              </Button>
            </Card>

            <Card className="p-6">
               <h2 className="text-lg font-bold mb-6">Charity Partner</h2>
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                    <Heart size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{charityConfig.selectedCharity || 'None Selected'}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black">Hero Partner</p>
                  </div>
               </div>
               <Button variant="secondary" className="w-full" onClick={() => setIsCharityModalOpen(true)}>Change Charity</Button>
            </Card>
          </div>
        </div>
      </div>

      <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />

      <Modal isOpen={isScoreModalOpen} onClose={() => setIsScoreModalOpen(false)} title="Log New Score">
         <form onSubmit={handleAddScore} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">Golf Score (1-45)</label>
              <input 
                type="number" required min="1" max="45"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white outline-none"
                value={scoreValue} onChange={(e) => setScoreValue(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full text-black" loading={submitting}>Log Entry</Button>
         </form>
      </Modal>

      <Modal isOpen={isCharityModalOpen} onClose={() => setIsCharityModalOpen(false)} title="Select Partner">
         <div className="space-y-3 max-h-[300px] overflow-y-auto">
           {charities.map(c => (
             <button key={c._id} onClick={() => handleSelectCharity(c._id)} className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all">
                <p className="font-bold">{c.name}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{c.description}</p>
             </button>
           ))}
         </div>
      </Modal>

    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
        <Icon size={18} className={color} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black">{value}</p>
        <p className="text-[10px] text-gray-600 font-bold uppercase">{sub}</p>
      </div>
    </Card>
  );
}

