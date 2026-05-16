import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';
import api from '@/lib/api';

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/favorites/').then(r => { setFavorites(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const removeFav = async (entityType: string, entityId: number) => {
    await api.delete(`/favorites/${entityType}/${entityId}`);
    setFavorites(prev => prev.filter(f => !(f.entity_type === entityType && f.entity_id === entityId)));
  };

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <motion.div {...fadeInUp}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Heart size={24} className="text-red-400" /> Favorites</h1>
        <p className="text-white/30 text-sm mt-1">Your saved places and dishes</p>
      </motion.div>

      <div className="mt-6">
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl skeleton" />)}</div>
        ) : favorites.length > 0 ? (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
            {favorites.map((fav: any) => (
              <motion.div key={fav.id} variants={staggerItem} className="glass rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm capitalize">{fav.entity_type} #{fav.entity_id}</p>
                  <p className="text-white/30 text-xs mt-0.5">Saved {new Date(fav.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => removeFav(fav.entity_type, fav.entity_id)} className="p-2 rounded-xl hover:bg-red-500/10 transition-colors">
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <Heart size={40} className="mx-auto mb-4 text-white/10" />
            <p className="text-white/30 text-sm">No favorites yet</p>
            <p className="text-white/20 text-xs mt-1">Start exploring and save places you love</p>
          </div>
        )}
      </div>
    </div>
  );
}
