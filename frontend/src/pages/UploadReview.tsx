import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Star, Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { staggerContainer, staggerItem } from '@/lib/animations';
import api from '@/lib/api';

export default function UploadReview() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ entity_type: 'food', entity_id: 1, rating: 5, content: '', image_url: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reviews/', form);
      setDone(true);
    } catch {} finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <button onClick={() => navigate(-1)} className="mb-6 p-2 rounded-xl hover:bg-white/5"><ArrowLeft size={18} className="text-white/50" /></button>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-md mx-auto">
        <motion.div variants={staggerItem} className="text-center mb-8">
          <Camera size={40} className="mx-auto mb-4 text-orange-400" />
          <h1 className="text-2xl font-bold text-white">Write a Review</h1>
          <p className="text-white/30 text-sm mt-1">Share your food experience</p>
        </motion.div>
        {done ? (
          <motion.div variants={staggerItem} className="text-center glass rounded-2xl p-8">
            <Star size={40} className="mx-auto mb-4 text-amber-400" />
            <h2 className="text-white font-semibold mb-2">Review Submitted!</h2>
            <p className="text-white/40 text-sm">Thank you for sharing.</p>
          </motion.div>
        ) : (
          <motion.form variants={staggerItem} onSubmit={handleSubmit} className="space-y-4">
            <select value={form.entity_type} onChange={e => setForm({...form, entity_type: e.target.value})} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-white outline-none appearance-none">
              <option value="food" className="bg-gray-900">Food</option>
              <option value="restaurant" className="bg-gray-900">Restaurant</option>
              <option value="hotel" className="bg-gray-900">Hotel</option>
              <option value="tourist_place" className="bg-gray-900">Tourist Place</option>
            </select>
            <input type="number" value={form.entity_id} onChange={e => setForm({...form, entity_id: parseInt(e.target.value)})} placeholder="Item ID" className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none" min={1} />
            <div>
              <p className="text-white/30 text-xs mb-2">Rating</p>
              <div className="flex gap-2">{[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => setForm({...form, rating: s})}><Star size={24} className={s <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10'} /></button>)}</div>
            </div>
            <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Share your experience..." className="w-full bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none resize-none h-28" />
            <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, hsl(24,95%,53%), hsl(24,95%,42%))' }}><Send size={16} /> Submit Review</button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}
