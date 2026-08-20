'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export function XpToast({ amount, onDone }: { amount: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-black shadow-xl pointer-events-none"
      style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}
    >
      ⚡ +{amount} XP
    </motion.div>
  );
}
