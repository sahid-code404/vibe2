import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star } from 'lucide-react';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';
import api from '@/lib/api';

export default function CommunityFeed() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reviews/?limit=30').then(r => { setReviews(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <motion.div {...fadeInUp}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><MessageSquare size={24} className="text-orange-400" /> Community</h1>
        <p className="text-white/30 text-sm mt-1">Latest reviews and discoveries</p>
      </motion.div>
      <div className="mt-6">
        {loading ? <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-32 rounded-2xl skeleton" />)}</div> : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
            {reviews.map(r => (
              <motion.div key={r.id} variants={staggerItem} className="glass rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-sm font-bold">{(r.user_name || 'A')[0]}</div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{r.user_name || 'Anonymous'}</p>
                    <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10'} />)}</div>
                  </div>
                  <span className="text-white/20 text-xs">{r.entity_type}</span>
                </div>
                {r.content && <p className="text-white/50 text-sm">{r.content}</p>}
                {r.image_url && <img src={r.image_url} alt="" className="mt-3 rounded-xl w-full h-40 object-cover" />}
              </motion.div>
            ))}
            {reviews.length === 0 && <p className="text-white/30 text-center py-16 text-sm">No reviews yet. Be the first to share!</p>}
          </motion.div>
        )}
      </div>
    </div>
  );
}
