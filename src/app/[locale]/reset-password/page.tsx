'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      });
      if (error) {
        setError('Impossible d\'envoyer l\'email. Vérifiez l\'adresse saisie.');
      } else {
        setSent(true);
      }
    } catch {
      setError('Erreur réseau. Vérifiez que le serveur est lancé.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#060d08]">
      <div className="pt-28 pb-16 px-4 flex items-start justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <Link href="/auth" className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-8 transition-colors">
            <ChevronLeft size={16} /> Retour à la connexion
          </Link>

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center text-2xl mx-auto mb-3">
              ♠
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
              Mot de passe oublié
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Saisissez votre email pour recevoir un lien de réinitialisation.
            </p>
          </div>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-6 rounded-2xl border border-green-500/30 bg-green-900/20"
            >
              <div className="text-3xl mb-3">📬</div>
              <h2 className="text-white font-bold text-lg mb-2">Email envoyé !</h2>
              <p className="text-gray-400 text-sm">
                Vérifiez votre boîte mail et cliquez sur le lien de réinitialisation.
                Le lien expire dans 1 heure.
              </p>
              <Link
                href="/auth"
                className="inline-block mt-4 text-yellow-400 text-sm hover:text-yellow-300 transition-colors"
              >
                Retour à la connexion →
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">Adresse email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="vous@exemple.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full py-3 rounded-xl font-bold text-sm text-black transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}
              >
                {loading ? '…' : 'Envoyer le lien'}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
