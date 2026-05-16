import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Heart, Share2, IndianRupee, Leaf } from 'lucide-react';
import { fadeInUp } from '@/lib/animations';
import PlaceCard from '@/components/cards/PlaceCard';
import api from '@/lib/api';

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [nearby, setNearby] = useState<any[]>([]);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    api.get(`/foods/${id}`).then((r) => setFood(r.data)).catch(() => navigate('/explore'));
    api.get(`/reviews/?entity_type=food&entity_id=${id}`).then((r) => setReviews(r.data)).catch(() => {});
    // Fetch nearby hotels (demo coords)
    api.get('/hotels/nearby', { params: { lat: 22.57, lng: 88.36, limit: 4 } }).then((r) => setNearby(r.data)).catch(() => {});
  }, [id]);

  if (!food) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96">
        <img src={food.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'} alt={food.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,20%,6%)] via-black/30 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button onClick={() => navigate(-1)} className="p-2.5 rounded-full glass"><ArrowLeft size={18} className="text-white" /></button>
          <div className="flex gap-2">
            <button onClick={() => setIsFav(!isFav)} className="p-2.5 rounded-full glass"><Heart size={18} className={isFav ? 'fill-red-500 text-red-500' : 'text-white'} /></button>
            <button className="p-2.5 rounded-full glass"><Share2 size={18} className="text-white" /></button>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div {...fadeInUp} className="px-5 -mt-12 relative z-10">
        <div className="glass rounded-3xl p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{food.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                {food.cuisine && <span className="text-white/40 text-xs">{food.cuisine}</span>}
                {food.region_name && <span className="flex items-center gap-1 text-white/40 text-xs"><MapPin size={11} />{food.region_name}</span>}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span className="text-amber-400 font-bold font-display text-lg">{food.rating_avg?.toFixed(1)}</span>
              </div>
              <span className="text-white/30 text-xs">{food.rating_count} reviews</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {food.price_range && <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs"><IndianRupee size={11} />{food.price_range}</span>}
            {food.is_vegetarian && <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs"><Leaf size={11} />Vegetarian</span>}
          </div>

          {food.description && <p className="text-white/50 text-sm leading-relaxed">{food.description}</p>}
        </div>

        {/* Nearby Hotels */}
        {nearby.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-white mb-4">Nearby Hotels</h2>
            <div className="space-y-3">
              {nearby.slice(0, 3).map((place: any, i: number) => (
                <PlaceCard key={i} {...place} type="hotel" />
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-white mb-4">Reviews ({reviews.length})</h2>
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((r: any) => (
                <div key={r.id} className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold">
                      {(r.user_name || 'A')[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{r.user_name || 'Anonymous'}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10'} />)}
                      </div>
                    </div>
                  </div>
                  {r.content && <p className="text-white/50 text-xs">{r.content}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-sm text-center py-8">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
