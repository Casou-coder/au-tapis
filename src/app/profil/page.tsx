'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProgress, getXpTitle, XP_TITLES, loadXpHistory, XpDayRecord } from '@/hooks/useProgress';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useChallengeStats, TypeStat } from '@/hooks/useChallengeStats';
import { CHALLENGES } from '@/lib/challenges-data';

const LEVELS = [
  { id: 'debutant', label: 'Débutant', emoji: '🟢', color: 'text-green-400', total: 8 },
  { id: 'intermediaire', label: 'Intermédiaire', emoji: '🔵', color: 'text-blue-400', total: 8 },
  { id: 'avance', label: 'Avancé', emoji: '🟣', color: 'text-purple-400', total: 9 },
  { id: 'expert', label: 'Expert', emoji: '🟡', color: 'text-yellow-400', total: 9 },
  { id: 'professionnel', label: 'Professionnel', emoji: '🔴', color: 'text-red-400', total: 7 },
];

const TYPE_META: { id: string; label: string; color: string }[] = [
  { id: 'decision',    label: '🎯 Décision',    color: '#3b82f6' },
  { id: 'calculation', label: '🔢 Calcul',       color: '#8b5cf6' },
  { id: 'reads',       label: '👁 Read',          color: '#22c55e' },
  { id: 'gto',         label: '🤖 GTO',           color: '#eab308' },
  { id: 'icm',         label: '💰 ICM',           color: '#f97316' },
];

function XpChart({ history }: { history: XpDayRecord[] }) {
  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 text-gray-600 text-sm">
        Complète des défis pour voir ta progression
      </div>
    );
  }

  // Build a 30-day window
  const days = 30;
  const today = new Date();
  const dayMap = new Map<string, number>();
  history.forEach(h => dayMap.set(h.date, h.earned));

  const slots: { date: string; earned: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    slots.push({ date: key, earned: dayMap.get(key) ?? 0 });
  }

  const maxVal = Math.max(...slots.map(s => s.earned), 1);
  const chartH = 64;
  const barW = 8;
  const gap = 2;
  const totalW = slots.length * (barW + gap) - gap;

  return (
    <svg width="100%" viewBox={`0 0 ${totalW} ${chartH + 4}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {slots.map((slot, i) => {
        const h = slot.earned === 0 ? 2 : Math.max(4, (slot.earned / maxVal) * chartH);
        const x = i * (barW + gap);
        const y = chartH - h;
        const opacity = slot.earned === 0 ? 0.12 : 0.8;
        return (
          <rect key={slot.date} x={x} y={y} width={barW} height={h} rx={2}
            fill={slot.earned === 0 ? '#374151' : '#eab308'}
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}

export default function ProfilPage() {
  const { progress, getLevelProgress, resetProgress, isLevelUnlocked } = useProgress();
  const { history, streak } = useDailyChallenge();
  const { typeStats } = useChallengeStats();
  const [xpHistory, setXpHistory] = useState<XpDayRecord[]>([]);

  useEffect(() => {
    setXpHistory(loadXpHistory());
  }, []);

  const totalDefis = CHALLENGES.length;
  const completedDefis = history.filter(h => h.completed).length;
  const correctDefis = history.filter(h => h.correct).length;
  const successRate = completedDefis > 0 ? Math.round((correctDefis / completedDefis) * 100) : 0;
  const defiPct = Math.round((completedDefis / totalDefis) * 100);

  const totalCompleted = LEVELS.reduce((sum, l) => sum + getLevelProgress(l.id, l.total).completed, 0);
  const totalModules = LEVELS.reduce((sum, l) => sum + l.total, 0);

  const totalXp = progress.totalXp || 0;
  const currentTitle = getXpTitle(totalXp);
  const nextTitle = XP_TITLES.find(t => t.min > totalXp);
  const xpToNextTitle = nextTitle ? nextTitle.min - totalXp : 0;
  const titleProgress = nextTitle
    ? ((totalXp - currentTitle.min) / (nextTitle.min - currentTitle.min)) * 100
    : 100;

  const hasTypeStats = Object.keys(typeStats).length > 0;
  const totalAttempts = Object.values(typeStats).reduce((s, t) => s + t.total, 0);

  return (
    <div className="min-h-screen bg-[#0a0f0a]">

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

          {/* XP & titre */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mt-5 w-full max-w-xs mx-auto"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg font-bold text-white">{currentTitle.emoji} {currentTitle.label}</span>
              <span className="text-yellow-400 font-bold text-sm">⚡ {totalXp.toLocaleString('fr-FR')} XP</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}
                initial={{ width: 0 }}
                animate={{ width: `${titleProgress}%` }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
            {nextTitle ? (
              <p className="text-gray-500 text-xs mt-1 text-right">{xpToNextTitle} XP avant {nextTitle.emoji} {nextTitle.label}</p>
            ) : (
              <p className="text-yellow-400 text-xs mt-1 text-center font-medium">Rang maximum atteint 👑</p>
            )}
          </motion.div>
        </motion.div>

        {/* XP sur 30 jours */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white text-sm">XP gagnée — 30 derniers jours</h2>
            {xpHistory.length > 0 && (
              <span className="text-yellow-400 text-xs font-medium">
                +{xpHistory.slice(-30).reduce((s, d) => s + d.earned, 0).toLocaleString('fr-FR')} XP
              </span>
            )}
          </div>
          <XpChart history={xpHistory} />
          <div className="flex justify-between text-gray-600 text-xs mt-1">
            <span>il y a 30j</span>
            <span>aujourd&apos;hui</span>
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

        {/* Défis */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Défis quotidiens</h2>
            <Link href="/defis" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">Voir les défis →</Link>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-400">{streak}</div>
              <div className="text-gray-500 text-xs mt-0.5">🔥 Streak</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-white">{completedDefis}</div>
              <div className="text-gray-500 text-xs mt-0.5">complétés</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-green-400">{successRate}%</div>
              <div className="text-gray-500 text-xs mt-0.5">réussite</div>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{completedDefis}/{totalDefis} défis explorés</span>
            <span>{defiPct}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400"
              initial={{ width: 0 }}
              animate={{ width: `${defiPct}%` }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </div>
        </motion.div>

        {/* Statistiques par type */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Statistiques par type</h2>
            {hasTypeStats && (
              <span className="text-gray-500 text-xs">{totalAttempts} tentative{totalAttempts > 1 ? 's' : ''}</span>
            )}
          </div>

          {!hasTypeStats ? (
            <p className="text-gray-600 text-sm text-center py-4">Complète des défis pour voir tes stats par type</p>
          ) : (
            <div className="space-y-3">
              {TYPE_META.map(meta => {
                const stat: TypeStat | undefined = typeStats[meta.id];
                const rate = stat && stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;
                return (
                  <div key={meta.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">{meta.label}</span>
                      <span className="text-xs text-gray-500">
                        {stat ? `${stat.correct}/${stat.total}` : '—'}
                        {rate !== null && (
                          <span className="ml-1.5 font-medium" style={{ color: rate >= 70 ? '#4ade80' : rate >= 40 ? '#fbbf24' : '#f87171' }}>
                            {rate}%
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: stat ? meta.color : 'transparent' }}
                        initial={{ width: 0 }}
                        animate={{ width: rate !== null ? `${rate}%` : '0%' }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

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
