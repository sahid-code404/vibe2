import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';
import api from '@/lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full max-w-sm">
        <motion.div variants={staggerItem}>
          <Link to="/login" className="inline-flex items-center gap-1.5 text-white/30 text-xs hover:text-white/50 mb-8"><ArrowLeft size={14} /> Back to login</Link>
        </motion.div>

        <motion.div variants={staggerItem} className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
          <p className="text-white/30 text-sm mt-1">We'll send you a reset link</p>
        </motion.div>

        {sent ? (
          <motion.div variants={staggerItem} className="text-center glass rounded-2xl p-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4"><Mail size={24} className="text-green-400" /></div>
            <h2 className="text-white font-semibold mb-2">Check Your Email</h2>
            <p className="text-white/40 text-sm">If an account exists for {email}, you'll receive a reset link.</p>
          </motion.div>
        ) : (
          <motion.form variants={staggerItem} onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3">
              <Mail size={16} className="text-white/20" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none" required />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, hsl(24,95%,53%), hsl(24,95%,42%))' }}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={16} /> Send Reset Link</>}
            </button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}
