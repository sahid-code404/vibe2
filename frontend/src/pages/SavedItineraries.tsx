import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Trash2 } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import ReactMarkdown from 'react-markdown';
import api from '@/lib/api';

export default function SavedItineraries() {
  const [items, setItems] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/itineraries/').then(r => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const deleteItem = async (id: number) => {
    await api.delete(`/itineraries/${id}`);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <motion.div {...fadeInUp}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Map size={24} className="text-blue-400" /> Saved Itineraries</h1>
        <p className="text-white/30 text-sm mt-1">Your AI-generated trip plans</p>
      </motion.div>
      <div className="mt-6">
        {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl skeleton" />)}</div> : items.length > 0 ? (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
            {items.map(item => (
              <motion.div key={item.id} variants={staggerItem} className="glass rounded-2xl overflow-hidden">
                <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                  <div>
                    <h3 className="text-white font-medium text-sm">{item.title}</h3>
                    <p className="text-white/30 text-xs mt-0.5">{item.destination || 'Trip'} • {item.days} day(s)</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className="p-2 rounded-xl hover:bg-red-500/10"><Trash2 size={14} className="text-red-400" /></button>
                </div>
                {expanded === item.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-4 pb-4 border-t border-white/[0.04] pt-3">
                    <div className="prose prose-sm prose-invert max-w-none text-xs">
                      <ReactMarkdown>{item.content?.text || JSON.stringify(item.content)}</ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16"><Map size={40} className="mx-auto mb-4 text-white/10" /><p className="text-white/30 text-sm">No saved itineraries</p></div>
        )}
      </div>
    </div>
  );
}
