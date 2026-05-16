import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Sparkles } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { useAuthStore } from '@/store/authStore';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    try {
      await register(email, password, name);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10">
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-blue-500/10 blur-[100px]" />
      <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-orange-500/8 blur-[100px]" />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full max-w-sm relative z-10">
        <motion.div variants={staggerItem} className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 glow-blue" style={{ background: 'linear-gradient(135deg, hsl(210,90%,55%), hsl(210,90%,42%))' }}>
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-white/30 text-sm mt-1">Join the culinary journey</p>
        </motion.div>

        <motion.form variants={staggerItem} onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">{error}</div>}

          <div className="space-y-1.5">
            <label className="text-white/40 text-xs font-medium">Display Name</label>
            <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3">
              <User size={16} className="text-white/20" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-white/40 text-xs font-medium">Email</label>
            <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3">
              <Mail size={16} className="text-white/20" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-white/40 text-xs font-medium">Password</label>
            <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3">
              <Lock size={16} className="text-white/20" />
              <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none" required />
              <button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={16} className="text-white/20" /> : <Eye size={16} className="text-white/20" />}</button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-transform hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, hsl(210,90%,55%), hsl(210,90%,42%))' }}>
            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus size={16} /> Create Account</>}
          </button>
        </motion.form>

        <motion.p variants={staggerItem} className="text-center text-white/30 text-sm mt-6">
          Already have an account?{' '}<Link to="/login" className="text-orange-400 font-medium hover:underline">Sign In</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
