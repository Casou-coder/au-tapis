'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase places the recovery tokens in the URL hash after the redirect.
    // onAuthStateChange fires with event "PASSWORD_RECOVERY" once tokens are exchanged.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError('Erreur lors de la mise à jour. Demandez un nouveau lien.');
      } else {
        router.push('/profil');
      }
    } catch {
      setError('Erreur réseau.');
    }
    setLoading(false);
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#060d08] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center px-4"
        >
          <div className="w-12 h-12 rounded-full border-2 border-yellow-500/40 border-t-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Vérification du lien en cours…</p>
          <p className="text-gray-600 text-xs mt-2">
            Si cette page ne se charge pas, le lien est peut-être expiré.{' '}
            <a href="/reset-password" className="text-yellow-500 hover:text-yellow-400">
              Demander un nouveau lien
            </a>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060d08]">
      <div className="pt-28 pb-16 px-4 flex items-start justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center text-2xl mx-auto mb-3">
              ♠
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
              Nouveau mot de passe
            </h1>
            <p className="text-gray-500 text-sm mt-1">Choisissez un mot de passe sécurisé.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Nouveau mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Minimum 6 caractères"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Répétez le mot de passe"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
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
              {loading ? '…' : 'Mettre à jour le mot de passe'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
