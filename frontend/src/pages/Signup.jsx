import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, Button } from "../components/ui";
import {
  UserPlus,
  User,
  Mail,
  ShieldCheck,
  AlertCircle,
  Key,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    setLoading(true);

    const result = await signup(
      form.name,
      form.email,
      form.password,
      form.role,
    );

    if (result.success) {
      setTimeout(() => {
        navigate(form.role === "admin" ? "/admin" : "/dashboard");
      }, 500);
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 py-24 bg-[#0b1120] relative overflow-hidden">
      {}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-3xl mb-4 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)] text-blue-500">
            <UserPlus size={28} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Join the Digital Heroes ecosystem today
          </p>
        </div>

        <Card className="p-8" glow>
          <form onSubmit={handleSignup} className="space-y-5">
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

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black text-gray-300 tracking-[0.2em] ml-1">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                  size={18}
                />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-[#080d19] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-green-500/50 transition-all"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black text-gray-300 tracking-[0.2em] ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-[#080d19] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-green-500/50 transition-all"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black text-gray-300 tracking-[0.2em] ml-1">
                Secure Password
              </label>
              <div className="relative">
                <Key
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#080d19] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-green-500/50 transition-all"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black text-gray-300 tracking-[0.2em] ml-1">
                Account Type
              </label>
              <div className="relative">
                <ShieldCheck
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <select
                  className="w-full bg-[#080d19] border border-white/10 rounded-xl py-3 pl-12 pr-10 text-sm text-white outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <motion.div
                    animate={{ y: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    ▼
                  </motion.div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-4 text-base text-white tracking-wide mt-2"
              loading={loading}
            >
              Create Account
            </Button>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-500 font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-green-500 hover:text-green-400 font-bold decoration-none transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
