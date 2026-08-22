'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Calendar, Lock, Shuffle, RotateCcw, CheckCircle2 } from 'lucide-react';
import { DailyChallengeModal, DailyChallengeCard } from '@/components/DailyChallenge';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useChallengeStats } from '@/hooks/useChallengeStats';
import { CHALLENGES as CHALLENGES_FR, Challenge, ChallengeLevel, CHALLENGE_LEVEL_ORDER } from '@/lib/challenges-data';
import { CHALLENGES as CHALLENGES_EN } from '@/lib/challenges-data.en';
import { useProgress } from '@/hooks/useProgress';
import { useLocale } from 'next-intl';

const BATCH = 20;
const STREAK_MILESTONES = [3, 7, 14, 30, 100];

export default function DefisPage() {
  const locale = useLocale();
  const isEn = locale === 'en';
  const CHALLENGES = isEn ? CHALLENGES_EN : CHALLENGES_FR;

  const LEVEL_META: Record<ChallengeLevel, { label: string; color: string; emoji: string }> = {
    debutant:     { label: isEn ? 'Beginner'     : 'Débutant',      color: '#22c55e', emoji: '🟢' },
    intermediaire:{ label: isEn ? 'Intermediate' : 'Intermédiaire', color: '#3b82f6', emoji: '🔵' },
    avance:       { label: isEn ? 'Advanced'     : 'Avancé',        color: '#a855f7', emoji: '🟣' },
    expert:       { label: 'Expert',                                  color: '#eab308', emoji: '🟡' },
    professionnel:{ label: isEn ? 'Professional' : 'Professionnel', color: '#ef4444', emoji: '🔴' },
  };

  const TYPE_OPTIONS = [
    { id: 'all',         label: isEn ? 'All'          : 'Tous' },
    { id: 'decision',    label: isEn ? '🎯 Decision'  : '🎯 Décision' },
    { id: 'calculation', label: isEn ? '🔢 Calc'      : '🔢 Calcul' },
    { id: 'reads',       label: '👁 Read' },
    { id: 'gto',         label: '🤖 GTO' },
    { id: 'icm',         label: '💰 ICM' },
  ];

  const DIFF_OPTIONS = [
    { id: 'all', label: isEn ? 'All'         : 'Toutes' },
    { id: 1,     label: isEn ? '● Easy'      : '● Facile' },
    { id: 2,     label: isEn ? '●● Medium'   : '●● Moyen' },
    { id: 3,     label: isEn ? '●●● Hard'    : '●●● Difficile' },
  ];

  const { challenge, isCompleted, wasCorrect, streak, loading, completeChallenge, history } = useDailyChallenge();
  const { isLevelUnlocked, addXp } = useProgress();
  const { failedIds, recordAttempt } = useChallengeStats();

  const [modalOpen, setModalOpen] = useState(false);
  const [practiceChallenge, setPracticeChallenge] = useState<Challenge | null>(null);
  const [showRevision, setShowRevision] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [milestoneStreak, setMilestoneStreak] = useState<number | null>(null);

  // Filters
  const [activeLevel, setActiveLevel]     = useState<ChallengeLevel | 'all'>('all');
  const [activeType, setActiveType]       = useState<string>('all');
  const [activeDiff, setActiveDiff]       = useState<number | 'all'>('all');
  const [visibleCount, setVisibleCount]   = useState(BATCH);

  const completedIds = history.filter(h => h.completed).map(h => h.challengeId);

  useEffect(() => {
    if (justCompleted && STREAK_MILESTONES.includes(streak)) {
      setMilestoneStreak(streak);
      const t = setTimeout(() => { setMilestoneStreak(null); setJustCompleted(false); }, 4500);
      return () => clearTimeout(t);
    }
    if (justCompleted) setJustCompleted(false);
  }, [justCompleted, streak]);

  useEffect(() => { setVisibleCount(BATCH); }, [activeLevel, activeType, activeDiff, showRevision]);

  const basePool = showRevision
    ? CHALLENGES.filter(c => failedIds.includes(c.id))
    : CHALLENGES.filter(c => {
        if (!isCompleted && challenge && c.id === challenge.id) return false;
        if (activeLevel !== 'all' && c.level !== activeLevel) return false;
        if (activeType  !== 'all' && c.type  !== activeType)  return false;
        if (activeDiff  !== 'all' && c.difficulty !== activeDiff) return false;
        return true;
      });

  const sorted = showRevision
    ? basePool
    : [
        ...basePool.filter(c => !completedIds.includes(c.id)),
        ...basePool.filter(c =>  completedIds.includes(c.id)),
      ];

  const visible = sorted.slice(0, visibleCount);
  const hasMore = sorted.length > visibleCount;

  const pickRandom = useCallback(() => {
    const pool = CHALLENGES.filter(c => {
      const unlocked = c.level === 'debutant' || isLevelUnlocked(c.level);
      return unlocked && !completedIds.includes(c.id);
    });
    const source = pool.length > 0 ? pool : CHALLENGES.filter(c => c.level === 'debutant' || isLevelUnlocked(c.level));
    if (!source.length) return;
    setPracticeChallenge(source[Math.floor(Math.random() * source.length)]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CHALLENGES, completedIds, isLevelUnlocked]);

  const streakMessage = (n: number) => isEn
    ? (n >= 100 ? 'You are an absolute legend.' : n >= 30 ? 'Champion discipline.' : n >= 14 ? 'Two full weeks without missing.' : n >= 7 ? 'A full week!' : 'Great streak, keep going!')
    : (n >= 100 ? 'Tu es une légende absolue.' : n >= 30 ? 'Discipline de champion.' : n >= 14 ? 'Deux semaines sans faillir.' : n >= 7 ? 'Une semaine complète !' : 'Belle série, continue !');

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <main className="max-w-4xl mx-auto px-4 pt-28 pb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            {isEn ? 'Daily Challenges' : 'Défis Quotidiens'}
          </h1>
          <p className="text-gray-400">
            {isEn
              ? 'One challenge per day, tailored to your level. Build your streak and improve.'
              : 'Un défi par jour, adapté à ton niveau. Construis ta série et progresse.'}
          </p>
        </motion.div>

        {/* Streak milestone banner */}
        <AnimatePresence>
          {milestoneStreak !== null && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="mb-6 rounded-2xl p-4 text-center"
              style={{ background: 'linear-gradient(135deg, rgba(251,146,60,0.18), rgba(239,68,68,0.12))', border: '1px solid rgba(251,146,60,0.35)' }}
            >
              <p className="text-2xl mb-1">🔥</p>
              <p className="text-white font-bold text-lg">
                {isEn ? `${milestoneStreak} days in a row!` : `${milestoneStreak} jours de suite !`}
              </p>
              <p className="text-orange-300 text-sm mt-0.5">{streakMessage(milestoneStreak)}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats + daily challenge */}
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
          <div className="grid grid-cols-3 gap-2 md:block md:space-y-3">
            <div className="rounded-xl p-3 md:p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Flame size={18} className="text-orange-400 mx-auto mb-1" />
              <p className="text-xl md:text-2xl font-bold text-white">{streak}</p>
              <p className="text-gray-400 text-xs leading-tight">{isEn ? 'Consecutive Days' : 'Jours consécutifs'}</p>
            </div>
            <div className="rounded-xl p-3 md:p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Trophy size={18} className="text-yellow-400 mx-auto mb-1" />
              <p className="text-xl md:text-2xl font-bold text-white">{completedIds.length}</p>
              <p className="text-gray-400 text-xs leading-tight">{isEn ? 'Challenges Done' : 'Défis complétés'}</p>
            </div>
            <div className="rounded-xl p-3 md:p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Calendar size={18} className="text-blue-400 mx-auto mb-1" />
              <p className="text-xl md:text-2xl font-bold text-white">{history.filter(h => h.correct).length}</p>
              <p className="text-gray-400 text-xs leading-tight">{isEn ? 'Correct Answers' : 'Réponses correctes'}</p>
            </div>
          </div>
        </div>

        {/* Library header */}
        <div className="mb-4">
          {/* Tabs */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setShowRevision(false)}
              className="text-sm font-bold transition-colors"
              style={{ color: !showRevision ? '#ffffff' : '#6b7280' }}
            >
              {isEn ? 'Challenge Library' : 'Bibliothèque de défis'}
            </button>
            <span className="text-gray-700">|</span>
            <button
              onClick={() => setShowRevision(true)}
              className="flex items-center gap-1.5 text-sm font-bold transition-colors"
              style={{ color: showRevision ? '#f97316' : '#6b7280' }}
            >
              <RotateCcw size={13} />
              {isEn ? 'Review' : 'Révision'}
              {failedIds.length > 0 && (
                <span className="ml-0.5 text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                  {failedIds.length}
                </span>
              )}
            </button>
          </div>

          {showRevision ? (
            failedIds.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
                <p className="text-white font-semibold text-lg mb-1">{isEn ? 'All mastered!' : 'Tout maîtrisé !'}</p>
                <p className="text-gray-500 text-sm">{isEn ? 'No failed challenges to review. Keep it up.' : 'Aucun défi raté à réviser. Continue comme ça.'}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">
                {isEn
                  ? `${failedIds.length} challenge${failedIds.length > 1 ? 's' : ''} to review · Answer correctly to remove them`
                  : `${failedIds.length} défi${failedIds.length > 1 ? 's' : ''} à revoir · Réponds correctement pour les retirer`}
              </p>
            )
          ) : (
            <>
              <div className="flex gap-2 flex-wrap mb-2">
                {(['all', ...CHALLENGE_LEVEL_ORDER] as const).map(l => {
                  const active = activeLevel === l;
                  const meta = l === 'all' ? null : LEVEL_META[l];
                  return (
                    <button key={l} onClick={() => setActiveLevel(l)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: active ? (meta?.color ?? '#c9a84c') + '20' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${active ? (meta?.color ?? '#c9a84c') + '50' : 'rgba(255,255,255,0.1)'}`,
                        color: active ? (meta?.color ?? '#c9a84c') : '#6b7280',
                      }}>
                      {l === 'all' ? (isEn ? 'All' : 'Tous') : `${meta!.emoji} ${meta!.label}`}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 flex-wrap mb-2">
                {TYPE_OPTIONS.map(t => {
                  const active = activeType === t.id;
                  return (
                    <button key={t.id} onClick={() => setActiveType(t.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${active ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        color: active ? '#a5b4fc' : '#6b7280',
                      }}>
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 flex-wrap mb-4">
                {DIFF_OPTIONS.map(d => {
                  const active = activeDiff === d.id;
                  return (
                    <button key={String(d.id)} onClick={() => setActiveDiff(d.id as number | 'all')}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: active ? 'rgba(251,146,60,0.12)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${active ? 'rgba(251,146,60,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        color: active ? '#fb923c' : '#6b7280',
                      }}>
                      {d.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">
                  {isEn
                    ? `${sorted.length} challenge${sorted.length > 1 ? 's' : ''}`
                    : `${sorted.length} défi${sorted.length > 1 ? 's' : ''}`}
                  {completedIds.length > 0 && (
                    <span className="text-gray-600">
                      {isEn
                        ? ` · ${basePool.filter(c => completedIds.includes(c.id)).length} done`
                        : ` · ${basePool.filter(c => completedIds.includes(c.id)).length} fait${basePool.filter(c => completedIds.includes(c.id)).length > 1 ? 's' : ''}`}
                    </span>
                  )}
                </p>
                <button
                  onClick={pickRandom}
                  disabled={basePool.length === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
                  style={{ background: 'rgba(202,163,60,0.1)', border: '1px solid rgba(202,163,60,0.25)', color: '#c9a84c' }}
                >
                  <Shuffle size={13} />
                  {isEn ? 'Random Challenge' : 'Défi aléatoire'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visible.map((c, i) => {
            const meta = LEVEL_META[c.level];
            const done = completedIds.includes(c.id);
            const failed = failedIds.includes(c.id);
            const unlocked = c.level === 'debutant' || isLevelUnlocked(c.level);

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={unlocked ? { scale: 0.97 } : {}}
                whileHover={unlocked ? { y: -2 } : {}}
                transition={{ delay: Math.min(i, 10) * 0.03, duration: 0.15 }}
                onClick={unlocked ? () => setPracticeChallenge(c) : undefined}
                className={`rounded-xl p-4 relative transition-opacity${unlocked ? ' cursor-pointer' : ''}${done && !showRevision ? ' opacity-50' : ''}`}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${failed ? 'rgba(239,68,68,0.25)' : done ? meta.color + '20' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {!unlocked && (
                  <div className="absolute inset-0 rounded-xl flex items-center justify-center backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.6)' }}>
                    <div className="text-center">
                      <Lock size={20} className="text-gray-500 mx-auto mb-1" />
                      <p className="text-gray-500 text-xs">{isEn ? 'Complete previous level' : 'Terminer le niveau précédent'}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: meta.color + '20', color: meta.color }}>
                    {meta.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {failed && <span className="text-red-400/70 text-xs font-medium">{isEn ? '✗ Failed' : '✗ Raté'}</span>}
                    {done && !failed && <span className="text-green-400/70 text-xs font-medium">{isEn ? '✓ Done' : '✓ Fait'}</span>}
                    <span className="text-gray-500 text-xs">
                      {TYPE_OPTIONS.find(t => t.id === c.type)?.label ?? c.type}
                    </span>
                  </div>
                </div>
                <p className="text-white text-sm font-semibold mb-2">{c.title}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Array.from({ length: c.difficulty }).map((_, j) => (
                      <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                    ))}
                    {Array.from({ length: 3 - c.difficulty }).map((_, j) => (
                      <div key={j} className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    ))}
                  </div>
                  <span className="text-yellow-400/70 text-xs">+{Math.round(c.xp * 0.5)} XP</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="text-center mt-6">
            <button
              onClick={() => setVisibleCount(v => v + BATCH)}
              className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af' }}
            >
              {isEn
                ? `See more · ${sorted.length - visibleCount} remaining`
                : `Voir plus · ${sorted.length - visibleCount} restants`}
            </button>
          </div>
        )}
      </main>

      {/* Daily challenge modal */}
      {modalOpen && challenge && (
        <DailyChallengeModal
          challenge={challenge}
          streak={streak}
          onComplete={(correct) => {
            setJustCompleted(true);
            recordAttempt(challenge, correct);
            completeChallenge(correct);
          }}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Practice modal */}
      {practiceChallenge && (
        <DailyChallengeModal
          challenge={practiceChallenge}
          streak={streak}
          onComplete={(correct) => {
            if (correct) addXp(Math.round(practiceChallenge.xp * 0.5));
            recordAttempt(practiceChallenge, correct);
            setPracticeChallenge(null);
          }}
          onClose={() => setPracticeChallenge(null)}
        />
      )}
    </div>
  );
}
