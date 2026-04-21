import { Button, Card, Badge } from "../components/ui";
import { motion } from "framer-motion";
import {
  Shield,
  Trophy,
  Heart,
  ArrowRight,
  CheckCircle2,
  Globe,
  TrendingUp,
  Target,
  Zap,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="bg-[#0b1120] text-white">
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 sm:px-8 lg:px-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-green-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Zap size={14} className="text-green-500" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              The Future of Digital Philanthropy
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8"
          >
            PLAY. WIN. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600">
              GIVE BACK.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Golf Charity Club is the first competition platform where your
            skills contribute to a massive global prize pool—while funding
            life-changing charities automatically.
          </motion.p>

          {!user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                as={Link}
                to="/signup"
                className="group text-white shadow-green-500/20 shadow-2xl"
              >
                Become a Hero{" "}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="ghost" size="lg" as={Link} to="/login">
                Hero Login
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center"
            >
              <Button
                size="lg"
                as={Link}
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="group text-white"
              >
                Enter Command Center{" "}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}
        </div>

        <div className="max-w-5xl mx-auto mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 px-6 sm:px-8 lg:px-12">
          <StatPill icon={Users} label="5.2k+" sub="Active Heroes" />
          <StatPill icon={Heart} label="₹1.2M" sub="Donated" />
          <StatPill icon={Trophy} label="₹4.8M" sub="Prizes Paid" />
          <StatPill icon={Globe} label="120+" sub="Countries" />
        </div>
      </section>

      <section className="py-24 px-6 sm:px-8 lg:px-12 bg-[#080d19]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">
              The Impact Cycle
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto font-medium">
              Four simple steps to win for yourself and the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Step
              icon={Target}
              step="01"
              title="Log Scores"
              desc="Sync your weekly golf performances to qualify."
            />
            <Step
              icon={TrendingUp}
              step="02"
              title="The Pool"
              desc="Subscriptions fund a global monthly prize pool."
            />
            <Step
              icon={Shield}
              step="03"
              title="Fair Draw"
              desc="Transparent monthly draws determine the heroes."
            />
            <Step
              icon={Heart}
              step="04"
              title="Give Back"
              desc="A portion of every win goes to your chosen charity."
            />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeIn}>
            <Badge variant="green" className="mb-4">
              REAL IMPACT
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
              Your victory is their{" "}
              <span className="text-green-500">breakthrough.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              We believe that competition shouldn't just be about individual
              gain. That's why every single winner on our platform donates 10%
              or more to verified global charities.
            </p>
            <ul className="space-y-4">
              {[
                "Clean Water initiatives in Kenya",
                "Medical aid in conflict zones",
                "Educational tech for remote villages",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-gray-300 font-bold"
                >
                  <CheckCircle2 size={18} className="text-green-500" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeIn} className="grid grid-cols-2 gap-4">
            <Card className="aspect-square flex flex-col items-center justify-center p-8 text-center bg-green-500/5 border-green-500/20">
              <Heart size={40} className="text-green-500 mb-4" />
              <p className="text-3xl font-black text-white">100%</p>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
                Transparency
              </p>
            </Card>
            <Card className="aspect-square flex flex-col items-center justify-center p-8 text-center bg-blue-500/5 border-blue-500/20">
              <Shield size={40} className="text-blue-500 mb-4" />
              <p className="text-3xl font-black text-white">SECURE</p>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
                Stripe Protected
              </p>
            </Card>
            <Card className="aspect-square flex flex-col items-center justify-center p-8 text-center bg-amber-500/5 border-amber-500/20">
              <Trophy size={40} className="text-amber-500 mb-4" />
              <p className="text-3xl font-black text-white">MONTHLY</p>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
                Global Draws
              </p>
            </Card>
            <Card className="aspect-square flex flex-col items-center justify-center p-8 text-center bg-teal-500/5 border-teal-500/20">
              <Globe size={40} className="text-teal-500 mb-4" />
              <p className="text-3xl font-black text-white">GLOBAL</p>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
                Universal Play
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-transparent to-[#080d19]">
        <div className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-br from-green-500 to-emerald-700 p-12 md:p-20 text-center relative overflow-hidden shadow-[0_0_80px_rgba(34,197,94,0.3)]">
          <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
            <Trophy size={160} />
          </div>
          <motion.div {...fadeIn} className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-[#0b1120] tracking-tighter mb-6 leading-none">
              Ready to play <br /> for a purpose?
            </h2>
            <p className="text-[#0b1120]/80 text-lg md:text-xl font-bold max-w-xl mx-auto mb-10">
              Join thousands of heroes already making an impact. Your first
              month is backed by our transparency guarantee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Button
                    as={Link}
                    to="/signup"
                    size="lg"
                    className="bg-[#0b1120] text-white hover:bg-black/80 px-12"
                  >
                    Sign Up Now
                  </Button>
                  <Button
                    variant="ghost"
                    as={Link}
                    to="/login"
                    size="lg"
                    className="text-[#0b1120] border-[#0b1120]/20 hover:bg-[#0b1120]/10 font-black"
                  >
                    Login
                  </Button>
                </>
              ) : (
                <Button
                  as={Link}
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  size="lg"
                  className="bg-[#0b1120] text-white hover:bg-black/80 px-12"
                >
                  Enter Command Center
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function StatPill({ icon: Icon, label, sub }) {
  return (
    <motion.div
      {...fadeIn}
      className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
    >
      <Icon className="text-green-500 mb-2" size={20} />
      <p className="text-xl font-black text-white leading-none">{label}</p>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
        {sub}
      </p>
    </motion.div>
  );
}

function Step({ icon: Icon, step, title, desc }) {
  return (
    <motion.div
      {...fadeIn}
      className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-green-500/30 transition-all"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 border border-green-500/20 group-hover:scale-110 transition-transform">
          <Icon size={24} />
        </div>
        <span className="text-3xl font-black text-white/10 group-hover:text-green-500/20 transition-colors uppercase italic">
          {step}
        </span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 font-medium leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}

