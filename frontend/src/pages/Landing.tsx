import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, Compass, Sparkles, MapPin, Utensils, Hotel, Star, ChevronRight } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import FoodCard from '@/components/cards/FoodCard';
import api from '@/lib/api';

export default function Landing() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/foods/featured').then((r) => setFoods(r.data)).catch(() => {});
    api.get('/foods/regions').then((r) => setRegions(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-5">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-orange-500/10 blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-500/8 blur-[120px]" />
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-xs text-white/60">
            <Sparkles size={14} className="text-orange-400" />
            AI-Powered Travel & Food Discovery
          </motion.div>

          <motion.h1 variants={staggerItem} className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
            <span className="text-white">Discover </span>
            <span className="gradient-text">Culinary</span>
            <br />
            <span className="text-white">Treasures </span>
            <span className="gradient-text-blue">Everywhere</span>
          </motion.h1>

          <motion.p variants={staggerItem} className="mt-6 text-white/40 text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Explore authentic regional food, find nearby hotels, discover hidden gems, and plan your perfect trip with AI.
          </motion.p>

          <motion.div variants={staggerItem} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/explore')} className="px-8 py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center gap-2 glow-orange transition-transform hover:scale-105" style={{ background: 'linear-gradient(135deg, hsl(24,95%,53%), hsl(24,95%,42%))' }}>
              Start Exploring <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/ai-planner')} className="px-8 py-3.5 rounded-2xl text-white/70 font-medium text-sm flex items-center gap-2 glass hover:bg-white/[0.06] transition-colors">
              <Sparkles size={16} className="text-orange-400" /> AI Trip Planner
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={staggerItem} className="mt-16 flex items-center justify-center gap-8 md:gap-12">
            {[
              { label: 'Cuisines', value: '50+', icon: Utensils },
              { label: 'Regions', value: '10+', icon: MapPin },
              { label: 'Dishes', value: '500+', icon: Star },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon size={18} className="mx-auto mb-1.5 text-orange-400/60" />
                <div className="text-2xl font-bold text-white font-display">{value}</div>
                <div className="text-xs text-white/30">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="px-5 py-16">
        <motion.div variants={staggerItem} className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Everything You Need</h2>
          <p className="text-white/30 text-sm mt-2">One platform for food, travel, and discovery</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { icon: Utensils, title: 'Food Discovery', desc: 'Authentic regional cuisines', color: 'orange' },
            { icon: Hotel, title: 'Nearby Hotels', desc: 'Best stays near you', color: 'blue' },
            { icon: Compass, title: 'Attractions', desc: 'Tourist spots & gems', color: 'green' },
            { icon: Sparkles, title: 'AI Planner', desc: 'Smart trip itineraries', color: 'purple' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <motion.div key={title} variants={staggerItem} className="glass rounded-2xl p-5 text-center hover:bg-white/[0.04] transition-colors cursor-pointer group">
              <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3 bg-${color === 'orange' ? 'orange' : color === 'blue' ? 'blue' : color === 'green' ? 'emerald' : 'purple'}-500/10`}>
                <Icon size={22} className={`text-${color === 'orange' ? 'orange' : color === 'blue' ? 'blue' : color === 'green' ? 'emerald' : 'purple'}-400`} />
              </div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="text-xs text-white/30 mt-1">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Foods */}
      {foods.length > 0 && (
        <section className="px-5 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Featured Dishes</h2>
              <p className="text-white/30 text-xs mt-0.5">Must-try culinary experiences</p>
            </div>
            <button onClick={() => navigate('/explore')} className="text-orange-400 text-xs font-medium flex items-center gap-1 hover:underline">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foods.slice(0, 6).map((food: any) => (
              <FoodCard key={food.id} {...food} />
            ))}
          </div>
        </section>
      )}

      {/* Regions */}
      {regions.length > 0 && (
        <section className="px-5 py-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Explore Regions</h2>
            <p className="text-white/30 text-xs mt-0.5">Discover food across India</p>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {regions.map((region: any) => (
              <motion.div
                key={region.id}
                whileHover={{ scale: 1.03, y: -3 }}
                onClick={() => navigate(`/explore?region=${region.id}`)}
                className="shrink-0 w-36 cursor-pointer group"
              >
                <div className="h-44 rounded-2xl overflow-hidden relative">
                  <img src={region.image_url || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400'} alt={region.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white font-semibold text-sm">{region.name}</h3>
                    <p className="text-white/50 text-[10px]">{region.country}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-5 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden p-8 md:p-12 text-center glass">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/5" />
          <div className="relative z-10">
            <Sparkles className="mx-auto mb-4 text-orange-400" size={32} />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Plan Your Perfect Trip with AI</h2>
            <p className="text-white/40 text-sm max-w-md mx-auto mb-6">Tell our AI your budget, preferences, and duration — get a complete travel itinerary instantly.</p>
            <button onClick={() => navigate('/ai-planner')} className="px-8 py-3 rounded-2xl text-white font-semibold text-sm glow-orange" style={{ background: 'linear-gradient(135deg, hsl(24,95%,53%), hsl(24,95%,42%))' }}>
              Try AI Planner
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-8 border-t border-white/[0.04]">
        <div className="text-center">
          <h3 className="font-bold text-white text-lg gradient-text">Culinary Compass</h3>
          <p className="text-white/20 text-xs mt-1">© 2026 Culinary Compass. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
