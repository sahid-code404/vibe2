import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Hotel, Star, MapPin } from 'lucide-react';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';
import PlaceCard from '@/components/cards/PlaceCard';
import api from '@/lib/api';

export default function NearbyHotels() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        api.get('/hotels/nearby', { params: { lat: pos.coords.latitude, lng: pos.coords.longitude, limit: 20 } })
          .then((r) => { setHotels(r.data); setLoading(false); }).catch(() => setLoading(false));
      },
      () => {
        api.get('/hotels/nearby', { params: { lat: 22.57, lng: 88.36, limit: 20 } })
          .then((r) => { setHotels(r.data); setLoading(false); }).catch(() => setLoading(false));
      }
    );
  }, []);

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <motion.div {...fadeInUp}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Hotel size={24} className="text-blue-400" /> Nearby Hotels</h1>
        <p className="text-white/30 text-sm mt-1">Find the best stays near you</p>
      </motion.div>

      <div className="mt-6">
        {loading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-24 rounded-2xl skeleton" />)}</div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
            {hotels.map((h: any, i: number) => (
              <motion.div key={i} variants={staggerItem}><PlaceCard {...h} type="hotel" /></motion.div>
            ))}
            {hotels.length === 0 && <p className="text-white/30 text-sm text-center py-16">No hotels found nearby.</p>}
          </motion.div>
        )}
      </div>
    </div>
  );
}
