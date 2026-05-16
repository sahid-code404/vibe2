import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, ArrowLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { staggerContainer, staggerItem } from '@/lib/animations';

export default function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <button onClick={() => navigate(-1)} className="mb-6 p-2 rounded-xl hover:bg-white/5"><ArrowLeft size={18} className="text-white/50" /></button>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-md mx-auto">
        <motion.div variants={staggerItem} className="text-center mb-8">
          <MessageCircle size={40} className="mx-auto mb-4 text-orange-400" />
          <h1 className="text-2xl font-bold text-white">Get in Touch</h1>
          <p className="text-white/30 text-sm mt-1">We'd love to hear from you</p>
        </motion.div>
        {sent ? (
          <motion.div variants={staggerItem} className="text-center glass rounded-2xl p-8">
            <Mail size={40} className="mx-auto mb-4 text-green-400" />
            <h2 className="text-white font-semibold mb-2">Message Sent!</h2>
            <p className="text-white/40 text-sm">We'll get back to you soon.</p>
          </motion.div>
        ) : (
          <motion.form variants={staggerItem} onSubmit={handleSubmit} className="space-y-4">
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none" required />
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none" required />
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Your message..." className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none resize-none h-32" required />
            <button type="submit" className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, hsl(24,95%,53%), hsl(24,95%,42%))' }}><Send size={16} /> Send Message</button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}
