import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import AIChatWidget from '../ai/AIChatWidget';

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <div className="min-h-screen animated-gradient">
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`${isAuthPage ? '' : 'pb-24'}`}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <BottomNav />
      {!isAuthPage && <AIChatWidget />}
    </div>
  );
}
