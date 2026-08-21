'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

type Mode = 'login' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message.includes('not confirmed')
            ? 'Confirmez votre email avant de vous connecter (vérifiez votre boîte mail).'
            : 'Email ou mot de passe incorrect.');
        } else {
          router.push('/profil');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        console.log('[auth] signUp response:', { data, error });
        if (error) {
          const msg = error.message || (error as unknown as { error_description?: string }).error_description || JSON.stringify(error);
          if (msg.includes('already') || msg.includes('registered')) {
            setError('Ce compte existe déjà. Connectez-vous.');
          } else if (msg.includes('Database') || msg.includes('database') || !msg || msg === '{}') {
            setError('Erreur serveur. Lance ce SQL dans Supabase : DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users; puis réessaie.');
          } else {
            setError(msg);
          }
        } else if (data.session) {
          router.push('/profil');
        } else if (data.user) {
          setError('Compte créé : vérifiez votre boîte mail et cliquez sur le lien de confirmation.');
        } else {
          setError(`Réponse inattendue : ${JSON.stringify(data)}`);
        }
      }
    } catch (err) {
      console.error('[auth] exception:', err);
      setError(`Erreur réseau : vérifiez que le serveur est lancé. (${String(err)})`);
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
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center text-2xl mx-auto mb-3">
              ♠
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
              Forged Poker
            </h1>
            <p className="text-gray-500 text-sm mt-1">Sauvegardez votre progression</p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-6">
            {(['login', 'signup'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="vous@exemple.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-gray-400 text-xs">Mot de passe</label>
                {mode === 'login' && (
                  <a href="/reset-password" className="text-yellow-500/70 hover:text-yellow-400 text-xs transition-colors">
                    Mot de passe oublié ?
                  </a>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={mode === 'signup' ? 6 : 1}
                placeholder={mode === 'signup' ? 'Minimum 6 caractères' : '••••••••'}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full py-3 rounded-xl font-bold text-sm text-black transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}
            >
              {loading ? '…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </motion.button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-6">
            Votre progression locale sera automatiquement migrée vers votre compte.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
