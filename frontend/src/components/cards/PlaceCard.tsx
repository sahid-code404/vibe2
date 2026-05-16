import { motion } from 'framer-motion';
import { Star, MapPin, IndianRupee } from 'lucide-react';
import { cardHover } from '@/lib/animations';

interface PlaceCardProps {
  name: string;
  rating?: number;
  distance?: number;
  image_url?: string;
  category?: string;
  price_per_night?: number;
  address?: string;
  type: 'hotel' | 'attraction';
  onClick?: () => void;
}

export default function PlaceCard({ name, rating, distance, image_url, category, price_per_night, address, type, onClick }: PlaceCardProps) {
  const defaultImg = type === 'hotel'
    ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
    : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400';

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      onClick={onClick}
      className="cursor-pointer rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm flex gap-3 p-3"
    >
      <img
        src={image_url || defaultImg}
        alt={name}
        className="w-20 h-20 rounded-xl object-cover shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <h4 className="font-semibold text-white text-sm leading-tight line-clamp-1">{name}</h4>
          {address && <p className="text-white/30 text-xs mt-0.5 line-clamp-1">{address}</p>}
          {category && <span className="text-white/40 text-[10px] capitalize">{category}</span>}
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            {rating != null && (
              <div className="flex items-center gap-1">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span className="text-amber-400 text-xs font-semibold font-display">{rating.toFixed?.(1) ?? rating}</span>
              </div>
            )}
            {distance != null && (
              <div className="flex items-center gap-0.5 text-white/30 text-xs">
                <MapPin size={10} />
                <span>{distance.toFixed?.(1) ?? distance} km</span>
              </div>
            )}
          </div>
          {price_per_night != null && (
            <div className="flex items-center text-green-400 text-xs font-semibold">
              <IndianRupee size={10} />
              {price_per_night}/night
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
