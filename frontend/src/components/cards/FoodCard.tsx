import { motion } from 'framer-motion';
import { Star, Heart, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cardHover } from '@/lib/animations';

interface FoodCardProps {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  cuisine?: string;
  rating_avg?: number;
  rating_count?: number;
  price_range?: string;
  region_name?: string;
  is_vegetarian?: boolean;
}

export default function FoodCard({ id, name, description, image_url, cuisine, rating_avg, rating_count, price_range, region_name, is_vegetarian }: FoodCardProps) {
  const [isFav, setIsFav] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      onClick={() => navigate(`/food/${id}`)}
      className="cursor-pointer rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Fav button */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsFav(!isFav); }}
          className="absolute top-3 right-3 p-2 rounded-full glass transition-transform hover:scale-110"
        >
          <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : 'text-white/70'} />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {is_vegetarian && (
            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-medium border border-green-500/20">
              VEG
            </span>
          )}
          {cuisine && (
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[10px] font-medium backdrop-blur-md">
              {cuisine}
            </span>
          )}
        </div>

        {/* Price */}
        {price_range && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white/80 text-xs font-medium">
            {price_range}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-white text-base leading-tight line-clamp-1">{name}</h3>
        {description && <p className="text-white/40 text-xs line-clamp-2 leading-relaxed">{description}</p>}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="text-amber-400 text-sm font-semibold font-display">{rating_avg?.toFixed(1) || '0.0'}</span>
            <span className="text-white/30 text-xs">({rating_count || 0})</span>
          </div>
          {region_name && (
            <div className="flex items-center gap-1 text-white/30 text-xs">
              <MapPin size={11} />
              <span>{region_name}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
