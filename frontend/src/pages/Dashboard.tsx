import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Utensils, Hotel, MapPin, Sparkles, Heart, Star, TrendingUp } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { useAuthStore } from '@/store/authStore';
import FoodCard from '@/components/cards/FoodCard';
import api from '@/lib/api';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [foods, setFoods] = useState<any[]>([]);
  const [stats, setStats] = useState({ favorites: 0, reviews: 0, itineraries: 0 });

  useEffect(() => {
    api.get('/foods/featured').then(r => setFoods(r.data.slice(0, 4))).catch(() => {});
    api.get('/favorites/').then(r => setStats(s => ({ ...s, favorites: r.data.length }))).catch(() => {});
    api.get('/itineraries/').then(r => setStats(s => ({ ...s, itineraries: r.data.length }))).catch(() => {});
  }, []);

  const quickActions = [
    { icon: Utensils, label: 'Explore Food', path: '/explore', color: 'orange' },
    { icon: Hotel, label: 'Find Hotels', path: '/hotels', color: 'blue' },
    { icon: MapPin, label: 'Attractions', path: '/attractions', color: 'emerald' },
    { icon: Sparkles, label: 'AI Planner', path: '/ai-planner', color: 'purple' },
  ];

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        {/* Welcome */}
        <motion.div variants={staggerItem} className="mb-8">
          <h1 className="text-2xl font-bold text-white">Hello, {user?.display_name || 'Foodie'} 👋</h1>
          <p className="text-white/30 text-sm mt-1">Ready for your next culinary adventure?</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={staggerItem} className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Favorites', value: stats.favorites, icon: Heart, color: 'text-red-400' },
            { label: 'Reviews', value: stats.reviews, icon: Star, color: 'text-amber-400' },
            { label: 'Trips', value: stats.itineraries, icon: TrendingUp, color: 'text-blue-400' },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center">
              <s.icon size={18} className={`mx-auto mb-2 ${s.color}`} />
              <p className="text-white font-bold text-xl font-display">{s.value}</p>
              <p className="text-white/30 text-xs">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={staggerItem} className="grid grid-cols-4 gap-3 mb-8">
          {quickActions.map(a => (
            <button key={a.label} onClick={() => navigate(a.path)} className="glass rounded-2xl p-3 text-center hover:bg-white/[0.04] transition-colors">
              <a.icon size={20} className={`mx-auto mb-1.5 text-${a.color}-400`} />
              <p className="text-white/60 text-[10px] font-medium">{a.label}</p>
            </button>
          ))}
        </motion.div>

        {/* Recommendations */}
        {foods.length > 0 && (
          <motion.div variants={staggerItem}>
            <h2 className="text-lg font-bold text-white mb-4">Recommended For You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {foods.map((f: any) => <FoodCard key={f.id} {...f} />)}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
