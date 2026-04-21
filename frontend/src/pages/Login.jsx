import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button } from '../components/ui';
import { LogIn, Key, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(form.email, form.password);
    
    if (result.success) {
      
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 py-24 bg-[#0b1120] relative overflow-hidden">
      {}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-3xl mb-4 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <LogIn size={28} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm font-medium">Continue your journey with Digital Heroes</p>
        </div>

        <Card className="p-8" glow>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 text-red-400 text-xs font-semibold"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-gray-300 tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="you@example.com"
                  className="w-full bg-[#080d19] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-green-500/50 transition-all shadow-inner"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] uppercase font-black text-gray-300 tracking-[0.2em]">Password</label>
                <a href="#" className="text-[10px] text-green-500 hover:text-green-400 font-bold uppercase tracking-wider">Forgot?</a>
              </div>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#080d19] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-green-500/50 transition-all shadow-inner"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 text-base tracking-wide text-white" 
              loading={loading}
            >
              Sign In
            </Button>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-500 font-medium">
                Don't have an account? {' '}
                <Link to="/signup" className="text-green-500 hover:text-green-400 font-bold decoration-none transition-colors">
                  SignUp
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
