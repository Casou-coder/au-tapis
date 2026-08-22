'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';
import { useLocale } from 'next-intl';

const STORAGE_KEY = 'jeu-responsable-banner-dismissed';

export default function ResponsibleGamblingBanner() {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable
    }
  }, []);

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* */ }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          role="alertdialog"
          aria-label={isEn ? 'Responsible gambling information' : 'Information jeu responsable'}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-xl mx-auto"
        >
          <div className="rounded-2xl border border-yellow-500/25 bg-[#0d1a0f]/95 backdrop-blur-md shadow-2xl p-4 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-yellow-500/15 border border-yellow-500/25 flex items-center justify-center shrink-0">
              <ShieldAlert size={16} className="text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold mb-0.5">
                <span className="mr-2 px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-bold">18+</span>
                {isEn ? 'Gambling: know the risks' : "Jeu d'argent : connaître les risques"}
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                {isEn
                  ? 'Forged Poker is free and has no real money. If you play for real money elsewhere, '
                  : "Forged Poker est gratuit et sans argent réel. Si tu joues en argent réel ailleurs, "}
                <Link href="/jeu-responsable" onClick={dismiss} className="text-yellow-400 underline underline-offset-2 hover:text-yellow-300 transition-colors">
                  {isEn ? 'check our responsible gambling guide' : 'consulte notre guide jeu responsable'}
                </Link>
                {isEn
                  ? ' (mental preparation, risks and help resources).'
                  : " (préparation mentale, risques et ressources d'aide)."}
              </p>
            </div>
            <button
              onClick={dismiss}
              aria-label={isEn ? 'Close' : 'Fermer'}
              className="p-1 text-gray-600 hover:text-gray-300 transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
