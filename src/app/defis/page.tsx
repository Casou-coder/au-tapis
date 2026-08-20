'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar, Lock } from 'lucide-react';
import { DailyChallengeModal, DailyChallengeCard } from '@/components/DailyChallenge';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { CHALLENGES, ChallengeLevel, CHALLENGE_LEVEL_ORDER } from '@/lib/challenges-data';
import { useProgress } from '@/hooks/useProgress';

const LEVEL_META: Record<ChallengeLevel, { label: string; color: string; emoji: string }> = {
  debutant: { label: 'Débutant', color: '#22c55e', emoji: '🟢' },
  intermediaire: { label: 'Intermédiaire', color: '#3b82f6', emoji: '🔵' },
  avance: { label: 'Avancé', color: '#a855f7', emoji: '🟣' },
  expert: { label: 'Expert', color: '#eab308', emoji: '🟡' },
  professionnel: { label: 'Professionnel', color: '#ef4444', emoji: '🔴' },
};

const TYPE_LABELS: Record<string, string> = {
  decision: '🎯 Décision',
  calculation: '🔢 Calcul',
  reads: '👁 Read',
  gto: '🤖 GTO',
  icm: '💰 ICM',
};

export default function DefisPage() {
  const { challenge, isCompleted, wasCorrect, streak, loading, completeChallenge, history } = useDailyChallenge();
  const { isLevelUnlocked } = useProgress();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeLevel, setActiveLevel] = useState<ChallengeLevel | 'all'>('all');
  const completedIds = history.filter(h => h.completed).map(h => h.challengeId);

  const filtered = activeLevel === 'all'
    ? CHALLENGES
    : CHALLENGES.filter(c => c.level === activeLevel);

  return (
    <div className="min-h-screen bg-[#0a0f0a]">

      <main className="max-w-4xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Défis Quotidiens
          </h1>
          <p className="text-gray-400">Un défi par jour, adapté à ton niveau. Construis ta série et progresse.</p>
        </motion.div>

        {/* Stats + défi du jour */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <DailyChallengeCard
              challenge={challenge}
              isCompleted={isCompleted}
              wasCorrect={wasCorrect}
              streak={streak}
              loading={loading}
              onOpen={() => setModalOpen(true)}
            />
          </div>

          <div className="space-y-3">
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Flame size={22} className="text-orange-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{streak}</p>
              <p className="text-gray-400 text-xs">Jours consécutifs</p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Trophy size={22} className="text-yellow-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{completedIds.length}</p>
              <p className="text-gray-400 text-xs">Défis complétés</p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Calendar size={22} className="text-blue-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{history.filter(h => h.correct).length}</p>
              <p className="text-gray-400 text-xs">Réponses correctes</p>
            </div>
          </div>
        </div>

        {/* Library */}
        <div className="mb-5">
          <h2 className="text-white font-bold text-lg mb-3">Bibliothèque de défis</h2>
          <div className="flex gap-2 flex-wrap">
            {(['all', ...CHALLENGE_LEVEL_ORDER] as const).map(l => {
              const isActive = activeLevel === l;
              const meta = l === 'all' ? null : LEVEL_META[l];
              return (
                <button
                  key={l}
                  onClick={() => setActiveLevel(l)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: isActive ? (meta?.color ?? '#c9a84c') + '20' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isActive ? (meta?.color ?? '#c9a84c') + '50' : 'rgba(255,255,255,0.1)'}`,
                    color: isActive ? (meta?.color ?? '#c9a84c') : '#6b7280',
                  }}
                >
                  {l === 'all' ? 'Tous' : `${meta!.emoji} ${meta!.label}`}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((c, i) => {
            const meta = LEVEL_META[c.level];
            const done = completedIds.includes(c.id);
            const unlocked = c.level === 'debutant' || isLevelUnlocked(c.level);

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={unlocked ? { scale: 0.97 } : {}}
                whileHover={unlocked ? { y: -2 } : {}}
                transition={{ delay: i * 0.03, duration: 0.15 }}
                className="rounded-xl p-4 relative"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${done ? meta.color + '30' : 'rgba(255,255,255,0.08)'}` }}
              >
                {!unlocked && (
                  <div className="absolute inset-0 rounded-xl flex items-center justify-center backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.6)' }}>
                    <div className="text-center">
                      <Lock size={20} className="text-gray-500 mx-auto mb-1" />
                      <p className="text-gray-500 text-xs">Terminer le niveau précédent</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: meta.color + '20', color: meta.color }}>
                    {meta.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {done && <span className="text-green-400 text-xs font-medium">✓ Fait</span>}
                    <span className="text-gray-500 text-xs">{TYPE_LABELS[c.type]}</span>
                  </div>
                </div>
                <p className="text-white text-sm font-semibold mb-1">{c.title}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Array.from({ length: c.difficulty }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                    ))}
                    {Array.from({ length: 3 - c.difficulty }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    ))}
                  </div>
                  <span className="text-yellow-400/70 text-xs">+{c.xp} XP</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Modal */}
      {modalOpen && challenge && (
        <DailyChallengeModal
          challenge={challenge}
          streak={streak}
          onComplete={(correct) => { completeChallenge(correct); }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
