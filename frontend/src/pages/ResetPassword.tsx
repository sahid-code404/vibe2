import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';
import api from '@/lib/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Minimum 6 characters'); return; }
    try {
      await api.post('/auth/reset-password', { token, new_password: password });
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) { setError(err.response?.data?.detail || 'Reset failed'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full max-w-sm">
        <motion.div variants={staggerItem} className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-white/30 text-sm mt-1">Enter your new password</p>
        </motion.div>

        {done ? (
          <motion.div variants={staggerItem} className="text-center glass rounded-2xl p-8">
            <CheckCircle size={40} className="mx-auto mb-4 text-green-400" />
            <h2 className="text-white font-semibold mb-2">Password Reset!</h2>
            <p className="text-white/40 text-sm">Redirecting to login...</p>
          </motion.div>
        ) : (
          <motion.form variants={staggerItem} onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">{error}</div>}
            <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3">
              <Lock size={16} className="text-white/20" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none" required />
            </div>
            <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3">
              <Lock size={16} className="text-white/20" />
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none" required />
            </div>
            <button type="submit" className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm" style={{ background: 'linear-gradient(135deg, hsl(24,95%,53%), hsl(24,95%,42%))' }}>Reset Password</button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}
