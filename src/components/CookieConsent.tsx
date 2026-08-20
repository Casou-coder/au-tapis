'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'cookie-consent-v1';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable
    }
  }, []);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, 'accepted'); } catch {}
    setVisible(false);
  }

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, 'dismissed'); } catch {}
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="dialog"
          aria-label="Consentement aux cookies"
          aria-modal="false"
          className="fixed bottom-20 left-4 right-4 z-40 max-w-lg mx-auto sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm"
        >
          <div className="rounded-2xl border border-white/10 bg-[#111a12]/97 backdrop-blur-md shadow-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Cookie size={14} className="text-yellow-400" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold mb-1">Cookies essentiels</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Nous utilisons uniquement des cookies nécessaires au fonctionnement du site
                  (authentification, sauvegarde de progression). Aucun cookie publicitaire.{' '}
                  <Link
                    href="/politique-confidentialite"
                    className="text-yellow-400 underline underline-offset-2 hover:text-yellow-300 transition-colors"
                  >
                    En savoir plus
                  </Link>
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={accept}
                    className="px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-semibold transition-colors"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={dismiss}
                    className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-gray-400 hover:text-white text-xs transition-colors"
                  >
                    Continuer sans accepter
                  </button>
                </div>
              </div>

              <button
                onClick={dismiss}
                aria-label="Fermer"
                className="p-1 text-gray-600 hover:text-gray-300 transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
