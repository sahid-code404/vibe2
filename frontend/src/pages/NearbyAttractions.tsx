import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';
import PlaceCard from '@/components/cards/PlaceCard';
import api from '@/lib/api';

export default function NearbyAttractions() {
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        api.get('/attractions/nearby', { params: { lat: pos.coords.latitude, lng: pos.coords.longitude, limit: 20 } })
          .then((r) => { setAttractions(r.data); setLoading(false); }).catch(() => setLoading(false));
      },
      () => {
        api.get('/attractions/nearby', { params: { lat: 22.57, lng: 88.36, limit: 20 } })
          .then((r) => { setAttractions(r.data); setLoading(false); }).catch(() => setLoading(false));
      }
    );
  }, []);

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <motion.div {...fadeInUp}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Compass size={24} className="text-emerald-400" /> Nearby Attractions</h1>
        <p className="text-white/30 text-sm mt-1">Discover tourist spots around you</p>
      </motion.div>

      <div className="mt-6">
        {loading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-24 rounded-2xl skeleton" />)}</div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
            {attractions.map((a: any, i: number) => (
              <motion.div key={i} variants={staggerItem}><PlaceCard {...a} type="attraction" /></motion.div>
            ))}
            {attractions.length === 0 && <p className="text-white/30 text-sm text-center py-16">No attractions found nearby.</p>}
          </motion.div>
        )}
      </div>
    </div>
  );
}
