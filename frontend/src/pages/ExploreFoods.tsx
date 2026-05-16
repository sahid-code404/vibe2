import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Leaf, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';
import FoodCard from '@/components/cards/FoodCard';
import api from '@/lib/api';

export default function ExploreFoods() {
  const [searchParams] = useSearchParams();
  const [foods, setFoods] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<number | null>(Number(searchParams.get('region')) || null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [vegOnly, setVegOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/foods/categories').then((r) => setCategories(r.data)).catch(() => {});
    api.get('/foods/regions').then((r) => setRegions(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = {};
    if (search) params.search = search;
    if (selectedRegion) params.region_id = selectedRegion;
    if (selectedCategory) params.category_id = selectedCategory;
    if (vegOnly) params.vegetarian = true;

    const timer = setTimeout(() => {
      api.get('/foods/', { params }).then((r) => { setFoods(r.data); setLoading(false); }).catch(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedRegion, selectedCategory, vegOnly]);

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      {/* Header */}
      <motion.div {...fadeInUp} className="mb-6">
        <h1 className="text-2xl font-bold text-white">Explore Foods</h1>
        <p className="text-white/30 text-sm mt-1">Discover authentic regional cuisines</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3">
          <Search size={18} className="text-white/30" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dishes, cuisines..." className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none" />
          {search && <button onClick={() => setSearch('')}><X size={14} className="text-white/30" /></button>}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`p-3 rounded-2xl transition-colors ${showFilters ? 'bg-orange-500/20 text-orange-400' : 'glass text-white/40'}`}>
          <SlidersHorizontal size={18} />
        </button>
      </motion.div>

      {/* Filters */}
      {showFilters && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-6 space-y-4">
          {/* Veg toggle */}
          <button onClick={() => setVegOnly(!vegOnly)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors ${vegOnly ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'glass text-white/50'}`}>
            <Leaf size={14} /> Vegetarian Only
          </button>

          {/* Regions */}
          <div>
            <p className="text-white/30 text-xs mb-2 font-medium">Region</p>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setSelectedRegion(null)} className={`px-3 py-1.5 rounded-full text-xs transition-colors ${!selectedRegion ? 'bg-orange-500/20 text-orange-400' : 'glass text-white/40'}`}>All</button>
              {regions.map((r: any) => (
                <button key={r.id} onClick={() => setSelectedRegion(r.id === selectedRegion ? null : r.id)} className={`px-3 py-1.5 rounded-full text-xs transition-colors ${r.id === selectedRegion ? 'bg-orange-500/20 text-orange-400' : 'glass text-white/40'}`}>{r.name}</button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-white/30 text-xs mb-2 font-medium">Category</p>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setSelectedCategory(null)} className={`px-3 py-1.5 rounded-full text-xs transition-colors ${!selectedCategory ? 'bg-blue-500/20 text-blue-400' : 'glass text-white/40'}`}>All</button>
              {categories.map((c: any) => (
                <button key={c.id} onClick={() => setSelectedCategory(c.id === selectedCategory ? null : c.id)} className={`px-3 py-1.5 rounded-full text-xs transition-colors ${c.id === selectedCategory ? 'bg-blue-500/20 text-blue-400' : 'glass text-white/40'}`}>{c.name}</button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-white/[0.06]">
              <div className="h-48 skeleton" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 rounded skeleton" />
                <div className="h-3 w-full rounded skeleton" />
                <div className="h-3 w-1/2 rounded skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food: any) => (
            <motion.div key={food.id} variants={staggerItem}>
              <FoodCard {...food} />
            </motion.div>
          ))}
          {foods.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-white/30 text-sm">No foods found. Try a different search.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
