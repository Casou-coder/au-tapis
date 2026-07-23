'use client';

import { motion } from 'framer-motion';
import { useProgress } from '@/hooks/useProgress';
import Navigation from '@/components/Navigation';

const LEVELS = [
  { id: 'debutant', label: 'Débutant', emoji: '🟢', color: 'text-green-400', total: 8 },
  { id: 'intermediaire', label: 'Intermédiaire', emoji: '🔵', color: 'text-blue-400', total: 8 },
  { id: 'avance', label: 'Avancé', emoji: '🟣', color: 'text-purple-400', total: 9 },
  { id: 'expert', label: 'Expert', emoji: '🟡', color: 'text-yellow-400', total: 9 },
  { id: 'professionnel', label: 'Professionnel', emoji: '🔴', color: 'text-red-400', total: 6 },
];

export default function ProfilPage() {
  const { getLevelProgress, resetProgress, isLevelUnlocked } = useProgress();

  const totalCompleted = LEVELS.reduce((sum, l) => sum + getLevelProgress(l.id, l.total).completed, 0);
  const totalModules = LEVELS.reduce((sum, l) => sum + l.total, 0);

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <Navigation />

      <main id="main-content" className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center text-3xl mx-auto mb-4" aria-hidden="true">
            ♠
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
            Ma Progression
          </h1>

          <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5">
            <span className="text-yellow-400 font-bold">{totalCompleted}</span>
            <span className="text-gray-400 text-sm">/ {totalModules} modules terminés</span>
          </div>
        </motion.div>

        {/* Barre globale */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progression globale</span>
            <span>{Math.round((totalCompleted / totalModules) * 100)}%</span>
          </div>
          <div
            className="h-2 bg-white/10 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round((totalCompleted / totalModules) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progression globale"
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400"
              initial={{ width: 0 }}
              animate={{ width: `${(totalCompleted / totalModules) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Progression par niveau */}
        <div className="space-y-3 mb-8">
          {LEVELS.map((level, i) => {
            const prog = getLevelProgress(level.id, level.total);
            const unlocked = isLevelUnlocked(level.id);

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true">{level.emoji}</span>
                    <span className={`font-semibold text-sm ${level.color}`}>{level.label}</span>
                    {!unlocked && <span className="text-xs text-gray-500">🔒 Verrouillé</span>}
                    {prog.completed === prog.total && unlocked && (
                      <span className="text-xs text-green-400 font-medium">✓ Terminé</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {prog.completed}/{prog.total} modules
                  </span>
                </div>
                <div
                  className="h-1.5 bg-white/10 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={prog.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progression ${level.label}`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${prog.percentage}%`, background: unlocked ? '#eab308' : '#374151' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            if (confirm('Réinitialiser toute votre progression ? Cette action est irréversible.')) {
              resetProgress();
            }
          }}
          className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
        >
          Réinitialiser la progression
        </button>
      </main>
    </div>
  );
}
