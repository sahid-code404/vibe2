import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Map, Heart, User } from 'lucide-react';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Compass, label: 'Explore' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/favorites', icon: Heart, label: 'Saved' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const hideOn = ['/login', '/signup', '/forgot-password', '/reset-password'];
  if (hideOn.some((p) => location.pathname.startsWith(p))) return null;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md"
    >
      <div className="glass-strong rounded-2xl px-2 py-2 flex items-center justify-around shadow-2xl shadow-black/30">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
          return (
            <NavLink key={path} to={path} className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors">
              {isActive && (
                <motion.div
                  layoutId="bottomnav-active"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(245,130,32,0.15), rgba(245,130,32,0.05))' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-orange-400' : 'text-white/40'}`}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className={`relative z-10 text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-orange-400' : 'text-white/40'}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </motion.nav>
  );
}
