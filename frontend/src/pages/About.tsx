import { motion } from 'framer-motion';
import { Compass, Users, Globe, Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { staggerContainer, staggerItem } from '@/lib/animations';

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen px-5 pt-14 pb-24">
      <button onClick={() => navigate(-1)} className="mb-6 p-2 rounded-xl hover:bg-white/5"><ArrowLeft size={18} className="text-white/50" /></button>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl mx-auto">
        <motion.div variants={staggerItem} className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">About <span className="gradient-text">Culinary Compass</span></h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-lg mx-auto">
            We're on a mission to help travelers discover authentic food experiences, hidden gems, and cultural treasures across India through the power of AI.
          </p>
        </motion.div>
        <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4 mb-12">
          {[
            { icon: Compass, title: 'Discovery', desc: 'Find hidden food gems and local favorites' },
            { icon: Users, title: 'Community', desc: 'Share reviews and connect with food lovers' },
            { icon: Globe, title: 'Travel', desc: 'AI-powered trip planning across India' },
            { icon: Heart, title: 'Passion', desc: 'Built by food and travel enthusiasts' },
          ].map(item => (
            <div key={item.title} className="glass rounded-2xl p-5 text-center">
              <item.icon size={24} className="mx-auto mb-3 text-orange-400" />
              <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-white/30 text-xs">{item.desc}</p>
            </div>
          ))}
        </motion.div>
        <motion.div variants={staggerItem} className="glass rounded-2xl p-6 text-center">
          <h2 className="text-white font-bold text-lg mb-2">Our Vision</h2>
          <p className="text-white/40 text-sm leading-relaxed">To become the go-to platform for authentic food and travel discovery, connecting travelers with local culinary experiences and cultural heritage across India and beyond.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
