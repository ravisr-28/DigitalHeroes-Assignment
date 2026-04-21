import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Card, Button, Badge, Spinner, EmptyState, Modal } from '../components/ui';
import { 
  Users, 
  Trophy, 
  BarChart3, 
  Settings, 
  Search, 
  RefreshCcw, 
  CheckCircle2, 
  XCircle, 
  Eye,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Heart
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [data, setData] = useState({ analytics: null, users: [], winners: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [simForm, setSimForm] = useState({ month: new Date().toISOString().slice(0, 7), drawType: 'random' });
  const [simResult, setSimResult] = useState(null);

  const fetchData = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const [analyticsRes, usersRes, winnersRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
        api.get('/admin/winners')
      ]);
      
      setData({
        analytics: analyticsRes.data?.data || null,
        users: usersRes.data?.data || [],
        winners: winnersRes.data?.data || []
      });
    } catch (err) {
      console.error('Failed to fetch admin data', err);
      setError(err.response?.data?.message || 'Failed to load administrative data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSimulate = async (e) => {
    e.preventDefault();
    setRefreshing(true);
    try {
      const res = await api.post('/draws/simulate', simForm);
      setSimResult(res.data?.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Simulation failed');
    } finally {
      setRefreshing(false);
    }
  };

  const handlePublish = async (id) => {
    if (!confirm('Are you sure you want to officially publish this draw? This will notify all winners.')) return;
    setRefreshing(true);
    try {
      await api.post(`/draws/publish/${id}`);
      setSimResult(null);
      setIsSimModalOpen(false);
      fetchData();
      alert('Draw published successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Publish failed');
      setRefreshing(false);
    }
  };

  const handleReviewWinner = async (drawId, userId, status) => {
    try {
      await api.post(`/verification/review/${drawId}/${userId}`, { verificationStatus: status });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Review failed');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0b1120] text-white"><Spinner /></div>;
  
  if (error) return (
    <div className="min-h-screen pt-32 text-center bg-[#0b1120] px-4 text-white">
      <div className="max-w-md mx-auto p-8 rounded-3xl bg-red-500/5 border border-red-500/20">
        <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
        <h2 className="text-xl font-bold mb-2">Administrative Error</h2>
        <p className="text-red-400 text-sm font-medium mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry Sync</Button>
      </div>
    </div>
  );

  
  const analytics = data?.analytics || {
    totalUsers: 0,
    activeSubscribers: 0,
    financials: { totalPrizePoolDistributed: 0, totalIndependentDonations: 0, estimatedMonthlySubscriptionCharityCut: 0 },
    drawStatistics: { totalDrawsPublished: 0 }
  };

  const financials = analytics.financials || { totalPrizePoolDistributed: 0, totalIndependentDonations: 0, estimatedMonthlySubscriptionCharityCut: 0 };
  const drawStats = analytics.drawStatistics || { totalDrawsPublished: 0 };

  const tabs = [
    { id: 'analytics', label: 'Platform Stats', icon: BarChart3 },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'winners', label: 'Winner Verification', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-[#0b1120] pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={20} className="text-green-500" />
              <h1 className="text-3xl font-black tracking-tight">Admin Control Room</h1>
            </div>
            <p className="text-gray-400 text-sm font-medium">Platform-wide management and logistics.</p>
          </div>
          <div className="flex gap-3">
             <Button 
              variant="secondary" 
              size="sm" 
              onClick={fetchData} 
              loading={refreshing}
              className="px-4"
             >
                Sync Data
             </Button>
             <Button 
              size="sm" 
              onClick={() => setIsSimModalOpen(true)}
              className="text-black px-4"
             >
               Run Simulation
             </Button>
          </div>
        </header>

        {}
        <div className="flex border-b border-white/5 space-x-8 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 pb-4 text-sm font-bold transition-all border-b-2 bg-transparent whitespace-nowrap cursor-pointer
                ${activeTab === tab.id 
                  ? 'border-green-500 text-green-500' 
                  : 'border-transparent text-gray-500 hover:text-gray-300'}
              `}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
            
            {}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Total Heroes" value={analytics.totalUsers} sub="All Registered Account" icon={Users} color="text-blue-500" />
                  <StatCard label="Active Subs" value={analytics.activeSubscribers} sub="Currently Eligible" icon={CheckCircle2} color="text-green-500" />
                  <StatCard label="Total Pool Won" value={`₹${financials.totalPrizePoolDistributed}`} sub="Lifetime distributions" icon={Trophy} color="text-amber-500" />
                  <StatCard label="Charity Impact" value={`₹${financials.totalIndependentDonations}`} sub="Independent Donations" icon={Heart} color="text-red-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <Card className="p-6">
                      <h2 className="text-xl font-bold mb-6">Financial Overview</h2>
                      <div className="space-y-4">
                         <DetailRow label="Distributed Prize Pool" value={`₹${financials.totalPrizePoolDistributed}`} />
                         <DetailRow label="Charity Cut (Sub)" value={`₹${financials.estimatedMonthlySubscriptionCharityCut}`} />
                         <DetailRow label="Direct Donations" value={`₹${financials.totalIndependentDonations}`} />
                         <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-400">Total Philanthropic Impact</span>
                            <span className="text-xl font-black text-green-500">
                               ₹{financials.totalIndependentDonations + financials.estimatedMonthlySubscriptionCharityCut}
                            </span>
                         </div>
                      </div>
                   </Card>
                   <Card className="p-6">
                      <h2 className="text-xl font-bold mb-6">Draw Health</h2>
                      <div className="space-y-4">
                         <DetailRow label="Total Draws Published" value={drawStats.totalDrawsPublished} />
                         <DetailRow label="Platform Conversion" value={analytics.totalUsers > 0 ? `${((analytics.activeSubscribers / analytics.totalUsers) * 100).toFixed(1)}%` : '0%'} />
                         <p className="text-xs text-gray-500 font-medium leading-relaxed bg-white/5 p-4 rounded-xl mt-4">
                            Draw simulation health is measured by active subscription distribution across tiers. 
                            Matched winner count remains zero for Match-5 in most cases.
                         </p>
                      </div>
                   </Card>
                </div>
              </div>
            )}

            {}
            {activeTab === 'users' && (
                <Card className="p-0 overflow-hidden">
                  <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between gap-4">
                    <h2 className="text-xl font-bold">Registered Heroes</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input 
                        className="bg-[#080d19] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-green-500/50" 
                        placeholder="Search heroes..."
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="text-[10px] uppercase font-black text-gray-500 tracking-widest border-b border-white/5">
                        <tr>
                          <th className="py-4 px-6">Hero / Identification</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6">Plan</th>
                          <th className="py-4 px-6">Target</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {data.users.map((u) => (
                          <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                            <td className="py-4 px-6">
                              <div className="font-bold">{u.name}</div>
                              <div className="text-[10px] text-gray-500 uppercase font-black">{u.email}</div>
                            </td>
                            <td className="py-4 px-6">
                              <Badge variant={u.subscriptionStatus === 'active' ? 'green' : 'amber'}>{u.subscriptionStatus}</Badge>
                            </td>
                            <td className="py-4 px-6 font-bold text-gray-400">
                              {u.planType?.toUpperCase() || '-'}
                            </td>
                            <td className="py-4 px-6">
                               <Button variant="ghost" size="sm" className="p-2 aspect-square rounded-lg">
                                  <Settings size={14} />
                               </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
            )}

            {}
            {activeTab === 'winners' && (
                <Card className="p-0 overflow-hidden">
                  <div className="p-6 border-b border-white/5">
                    <h2 className="text-xl font-bold">Winner Verification Flow</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="text-[10px] uppercase font-black text-gray-500 tracking-widest border-b border-white/5">
                        <tr>
                          <th className="py-4 px-6">Winner / Draw</th>
                          <th className="py-4 px-6">Tier / Prize</th>
                          <th className="py-4 px-6">Proof</th>
                          <th className="py-4 px-6">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {data.winners.length > 0 ? data.winners.map((win, idx) => (
                          <tr key={`${win.drawId}-${idx}`} className="border-b border-white/5">
                            <td className="py-4 px-6">
                              <div className="font-bold">{win.user?.name}</div>
                              <div className="text-[10px] text-gray-500 uppercase font-black">{win.month} DRAW</div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-xs font-black text-green-500">₹{win.prize}</div>
                            </td>
                            <td className="py-4 px-6">
                              <Badge variant={win.verificationStatus === 'approved' ? 'green' : win.verificationStatus === 'pending' ? 'amber' : 'default'}>
                                {win.verificationStatus}
                              </Badge>
                            </td>
                            <td className="py-4 px-6">
                               <div className="flex gap-2">
                                 {win.proofUrl ? (
                                   <>
                                     <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="p-1.5 bg-green-500/10 text-green-500"
                                      onClick={() => handleReviewWinner(win.drawId, win.user?._id, 'approved')}
                                     >
                                        <CheckCircle2 size={14} />
                                     </Button>
                                     <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="p-1.5 bg-red-500/10 text-red-500"
                                      onClick={() => handleReviewWinner(win.drawId, win.user?._id, 'rejected')}
                                     >
                                        <XCircle size={14} />
                                     </Button>
                                   </>
                                 ) : (
                                   <span className="text-[10px] font-black text-gray-700 uppercase">Waiting</span>
                                 )}
                               </div>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan="4"><EmptyState icon={Trophy} text="No Winners yet" description="Published draws with winners will appear here." /></td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
            )}
        </div>

        {}
        <Modal 
          isOpen={isSimModalOpen} 
          onClose={() => { setIsSimModalOpen(false); setSimResult(null); }} 
          title="Monthly Pool Simulation"
        >
          {simResult ? (
            <div className="space-y-6">
               <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-6 text-center">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Prize Pool</p>
                  <p className="text-4xl font-black text-white">₹{simResult.totalPool}</p>
                  <div className="flex justify-center gap-2 mt-4">
                    {(simResult.winningNumbers || []).map((n, i) => (
                      <div key={i} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-black text-green-500 border border-white/10">{n}</div>
                    ))}
                  </div>
               </div>
               <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => setSimResult(null)}>Reset</Button>
                  <Button className="flex-1 text-black" onClick={() => handlePublish(simResult._id)}>Publish</Button>
               </div>
            </div>
          ) : (
            <form onSubmit={handleSimulate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Month</label>
                <input 
                  type="month" required
                  className="w-full bg-[#080d19] border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-green-500"
                  value={simForm.month}
                  onChange={(e) => setSimForm({ ...simForm, month: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full text-black" loading={refreshing}>Simulate</Button>
            </form>
          )}
        </Modal>

      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <Card className="p-6 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
        <Icon size={48} />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black mt-1 leading-none">{value}</p>
        <p className="text-[10px] font-bold text-gray-600 mt-2 uppercase tracking-wide">{sub}</p>
      </div>
    </Card>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
