'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Trophy, ChevronRight, Brain, Lightbulb } from 'lucide-react';
import { useLocale } from 'next-intl';
import type { Challenge } from '@/lib/challenges-data';
import { CHALLENGE_HINTS } from '@/lib/challenge-hints';
import { useProgress } from '@/hooks/useProgress';

// ─── Card display ─────────────────────────────────────────────────────────────

function PokerCardSmall({ value, hidden }: { value: string; hidden?: boolean }) {
  if (hidden) {
    return (
      <div
        className="w-9 h-12 md:w-11 md:h-[60px] rounded-md flex items-center justify-center text-white text-lg shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1a3a8f, #0d2060)' }}
      >
        ♠
      </div>
    );
  }
  const suit = value.slice(-1);
  const rank = value.slice(0, -1);
  const isRed = suit === '♥' || suit === '♦';
  return (
    <div
      className={`w-9 h-12 md:w-11 md:h-[60px] rounded-md bg-white flex flex-col items-center justify-center shadow-md font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}
    >
      <span className="text-xs md:text-sm leading-none">{rank}</span>
      <span className="text-sm md:text-base leading-none">{suit}</span>
    </div>
  );
}

// ─── VPIP/PFR stat bar ────────────────────────────────────────────────────────

function StatBar({ label, value, max = 70, color }: { label: string; value: number; max?: number; color: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-400 w-8">{label}</span>
      <div className="flex-1 bg-white/10 rounded-full h-1.5">
        <div className="h-full rounded-full transition-all" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="text-white font-mono w-8 text-right">{value}%</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Screen = 'briefing' | 'challenge' | 'result';

const STREET_LABELS: Record<string, string> = {
  preflop: 'Préflop', flop: 'Flop', turn: 'Turn', river: 'River',
};

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  debutant: { label: 'Débutant', color: '#22c55e' },
  intermediaire: { label: 'Intermédiaire', color: '#3b82f6' },
  avance: { label: 'Avancé', color: '#a855f7' },
  expert: { label: 'Expert', color: '#eab308' },
  professionnel: { label: 'Professionnel', color: '#ef4444' },
};

const LEVEL_LABELS_EN: Record<string, { label: string; color: string }> = {
  debutant: { label: 'Beginner', color: '#22c55e' },
  intermediaire: { label: 'Intermediate', color: '#3b82f6' },
  avance: { label: 'Advanced', color: '#a855f7' },
  expert: { label: 'Expert', color: '#eab308' },
  professionnel: { label: 'Professional', color: '#ef4444' },
};

const TYPE_LABELS: Record<string, string> = {
  decision: '🎯 Décision',
  calculation: '🔢 Calcul',
  reads: '👁 Read',
  gto: '🤖 GTO',
  icm: '💰 ICM',
};

const TYPE_LABELS_EN: Record<string, string> = {
  decision: '🎯 Decision',
  calculation: '🔢 Calculation',
  reads: '👁 Reading',
  gto: '🤖 GTO',
  icm: '💰 ICM',
};

interface DailyChallengeProps {
  challenge: Challenge;
  streak: number;
  onComplete: (correct: boolean) => void;
  onClose: () => void;
}

export function DailyChallengeModal({ challenge, streak, onComplete, onClose }: DailyChallengeProps) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const levelLabels = isEn ? LEVEL_LABELS_EN : LEVEL_LABELS;
  const typeLabels = isEn ? TYPE_LABELS_EN : TYPE_LABELS;

  const [screen, setScreen] = useState<Screen>('briefing');
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const { addXp } = useProgress();
  const hint = CHALLENGE_HINTS[challenge.id];
  const levelMeta = levelLabels[challenge.level];
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function handleAnswer(idx: number) {
    if (confirmed) return;
    setSelected(idx);
  }

  function handleConfirm() {
    if (selected === null) return;
    setConfirmed(true);
    const isCorrect = challenge.options[selected].isCorrect;
    const xp = isCorrect ? (hintVisible ? 35 : 75) : 0;
    if (xp > 0) addXp(xp);
    setEarnedXp(xp);
    setTimeout(() => { setScreen('result'); onComplete(isCorrect); }, 800);
  }

  const isCorrect = selected !== null && challenge.options[selected].isCorrect;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="challenge-title"
        className="relative w-full max-w-lg md:max-w-2xl z-10 rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: '#0d1f0d', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {/* ── Sticky header ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 sticky top-0 bg-[#0d1f0d] z-10">
          <div className="flex items-center gap-2">
            <span id="challenge-title" className="text-yellow-400 font-bold text-sm">{isEn ? 'Daily Challenge' : 'Défi du Jour'}</span>
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 rounded-full px-2 py-0.5">
                <Flame size={12} className="text-orange-400" />
                <span className="text-orange-400 text-xs font-bold">{streak}</span>
              </div>
            )}
            <span className="hidden md:inline text-xs px-2.5 py-1 rounded-full font-medium ml-1" style={{ background: levelMeta.color + '20', color: levelMeta.color }}>
              {levelMeta.label}
            </span>
            <span className="hidden md:inline text-xs text-gray-500">{typeLabels[challenge.type]}</span>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={isEn ? 'Close challenge' : 'Fermer le défi'}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* ── Screens ── */}
        <div className="max-h-[80vh] overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ═══ BRIEFING ═══ */}
            {screen === 'briefing' && (
              <motion.div
                key="briefing"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="md:grid md:grid-cols-2 md:divide-x md:divide-white/10"
              >
                {/* LEFT, Villain */}
                <div className="p-5">
                  {/* Badges mobile only */}
                  <div className="flex items-center gap-2 mb-4 md:hidden">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: levelMeta.color + '20', color: levelMeta.color }}>
                      {STREET_LABELS[challenge.context.street]}
                    </span>
                    <span className="text-xs text-gray-500">{typeLabels[challenge.type]}</span>
                  </div>

                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">{isEn ? 'Your opponent' : 'Votre adversaire'}</p>

                  <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl md:text-4xl">{challenge.villain.emoji}</span>
                      <div>
                        <p className="text-white font-semibold">{challenge.villain.name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{challenge.villain.style}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-3">
                      <StatBar label="VPIP" value={challenge.villain.vpip} color="#22c55e" />
                      <StatBar label="PFR" value={challenge.villain.pfr} max={40} color="#3b82f6" />
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">{challenge.villain.description}</p>
                    <p className="text-yellow-400/80 text-xs mt-2 italic">💡 {challenge.villain.tendency}</p>
                  </div>
                </div>

                {/* RIGHT, Situation + CTA */}
                <div className="p-5 flex flex-col border-t border-white/10 md:border-t-0">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">{isEn ? 'The situation' : 'La situation'}</p>

                  {/* Context table */}
                  <div className="rounded-xl p-3 space-y-2 text-xs mb-4" style={{ background: '#1a4a2e33', border: '1px solid #1a4a2e' }}>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isEn ? 'Format' : 'Format'}</span>
                      <span className="text-white">{challenge.context.gameType === 'cash' ? (isEn ? '💵 Cash' : '💵 Cash') : (isEn ? '🏆 Tournament' : '🏆 Tournoi')} · {challenge.context.blinds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isEn ? 'Position' : 'Position'}</span>
                      <span className="text-white">{challenge.context.position}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isEn ? 'Stacks' : 'Stacks'}</span>
                      <span className="text-white">{challenge.context.effectiveStack}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isEn ? 'Street' : 'Street'}</span>
                      <span className="text-white">{STREET_LABELS[challenge.context.street] ?? challenge.context.street}</span>
                    </div>
                  </div>

                  {/* Scenario */}
                  <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-5">{challenge.context.action}</p>

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setScreen('challenge')}
                    className="w-full py-3 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}
                  >
                    {isEn ? 'Take the challenge' : 'Relever le défi'} <ChevronRight size={16} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ═══ CHALLENGE ═══ */}
            {screen === 'challenge' && (
              <motion.div
                key="challenge"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="md:grid md:grid-cols-2 md:divide-x md:divide-white/10"
              >
                {/* LEFT, Table visuelle */}
                <div className="p-5">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">{isEn ? 'The table' : 'La table'}</p>

                  {/* Cards */}
                  <div className="rounded-xl p-4 mb-4" style={{ background: '#1a4a2e55', border: '1px solid #1a4a2e' }}>
                    <div className="flex flex-wrap items-start gap-4">
                      <div>
                        <p className="text-gray-400 text-xs mb-2">{isEn ? 'Your hand' : 'Votre main'}</p>
                        <div className="flex gap-1.5">
                          {challenge.context.heroHand.map((c, i) => <PokerCardSmall key={i} value={c} />)}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-2">{challenge.context.board.length > 0 ? `Board : ${STREET_LABELS[challenge.context.street] ?? challenge.context.street}` : (isEn ? 'Preflop' : 'Préflop')}</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {challenge.context.board.length > 0
                            ? challenge.context.board.map((c, i) => <PokerCardSmall key={i} value={c} />)
                            : [0, 1].map(i => <PokerCardSmall key={i} value="" hidden />)
                          }
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-3 text-xs text-gray-400">
                      <span>{isEn ? 'Pot:' : 'Pot :'} <span className="text-white font-mono">{challenge.context.pot}</span></span>
                      <span>·</span>
                      <span>{challenge.context.position}</span>
                    </div>
                  </div>

                  {/* Villain recap */}
                  <div className="flex items-center gap-3 text-sm rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-2xl shrink-0">{challenge.villain.emoji}</span>
                    <div>
                      <p className="text-white text-xs font-medium">{challenge.villain.name}</p>
                      <p className="text-gray-500 text-xs">{challenge.villain.style} · VPIP {challenge.villain.vpip}% / PFR {challenge.villain.pfr}%</p>
                    </div>
                  </div>
                </div>

                {/* RIGHT, Question + Options */}
                <div className="p-5 flex flex-col border-t border-white/10 md:border-t-0">
                  <p className="text-white font-semibold text-sm mb-4 leading-relaxed">{challenge.question}</p>

                  {/* Hint */}
                  {hint && !confirmed && (
                    <div className="mb-4">
                      <button
                        onClick={() => setHintVisible(v => !v)}
                        className="flex items-center gap-1.5 text-xs text-yellow-500/70 hover:text-yellow-400 transition-colors"
                      >
                        <Lightbulb size={13} />
                        {hintVisible
                          ? (isEn ? 'Hide hint' : "Masquer l'aide")
                          : (isEn ? 'Show hint (-40 XP)' : "Voir l'aide (-40 XP)")}
                      </button>
                      <AnimatePresence>
                        {hintVisible && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="mt-2 text-xs text-gray-400 italic leading-relaxed px-1 border-l-2 border-yellow-500/30 pl-3">
                              {hint}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Options */}
                  <div className="space-y-2 flex-1">
                    {challenge.options.map((opt, i) => {
                      let style = 'border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-yellow-500/50';
                      if (selected === i && !confirmed) style = 'border border-yellow-500 bg-yellow-500/10 text-white';
                      if (confirmed) {
                        if (opt.isCorrect) {
                          style = 'border border-green-500 bg-green-500/15 text-green-300';
                        } else if (selected === i) {
                          style = 'border border-red-500 bg-red-500/15 text-red-300';
                        }
                      }
                      return (
                        <motion.button
                          key={i}
                          whileHover={!confirmed ? { scale: 1.01 } : {}}
                          whileTap={!confirmed ? { scale: 0.99 } : {}}
                          onClick={() => handleAnswer(i)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${style}`}
                        >
                          <span className="text-gray-500 mr-2">{['A', 'B', 'C', 'D'][i]}.</span>
                          {opt.label}
                        </motion.button>
                      );
                    })}
                  </div>

                  <motion.button
                    whileHover={selected !== null ? { scale: 1.02 } : {}}
                    whileTap={selected !== null ? { scale: 0.98 } : {}}
                    onClick={handleConfirm}
                    disabled={selected === null || confirmed}
                    className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-4"
                    style={{
                      background: selected !== null ? 'linear-gradient(to right, #ca8a04, #eab308)' : 'rgba(255,255,255,0.1)',
                      color: selected !== null ? '#000' : '#6b7280',
                    }}
                  >
                    {confirmed
                      ? (isCorrect ? (isEn ? '✓ Correct!' : '✓ Correct !') : (isEn ? '✗ Incorrect' : '✗ Incorrect'))
                      : (isEn ? 'Confirm my answer' : 'Valider ma réponse')}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ═══ RESULT ═══ */}
            {screen === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="md:grid md:grid-cols-2 md:divide-x md:divide-white/10"
              >
                {/* LEFT, Score */}
                <div className="p-5 md:flex md:flex-col md:items-center md:justify-center md:text-center">
                  <div className={`rounded-xl p-5 mb-0 ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                      className="text-5xl mb-3 text-center"
                    >
                      {isCorrect ? '✅' : '❌'}
                    </motion.div>
                    <p className={`font-bold text-base text-center ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect
                        ? (isEn ? 'Correct answer!' : 'Bonne réponse !')
                        : (isEn ? 'Not quite right…' : 'Pas tout à fait…')}
                    </p>
                    {earnedXp > 0 && (
                      <div className="mt-2 flex items-center justify-center gap-1.5">
                        <Trophy size={15} className="text-yellow-400" />
                        <span className="text-yellow-400 font-bold">+{earnedXp} XP</span>
                      </div>
                    )}
                  </div>

                  {/* Mobile: close button at bottom of left col */}
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full py-3 rounded-xl font-bold text-sm text-black mt-4 md:hidden"
                    style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}
                  >
                    {isEn ? 'Close' : 'Fermer'}
                  </motion.button>
                </div>

                {/* RIGHT, Explanations */}
                <div className="p-5 flex flex-col border-t border-white/10 md:border-t-0">
                  {selected !== null && (
                    <div
                      className="rounded-xl p-3 mb-3"
                      style={isCorrect
                        ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
                        : { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }
                      }
                    >
                      <p className={`text-xs mb-1 ${isCorrect ? 'text-gray-400' : 'text-red-400'}`}>
                        {isCorrect ? (isEn ? '✓ Your answer:' : '✓ Ta réponse :') : (isEn ? '✗ Your answer:' : '✗ Ta réponse :')} {challenge.options[selected].label}
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed">{challenge.options[selected].explanation}</p>
                    </div>
                  )}

                  {!isCorrect && (() => {
                    const correct = challenge.options.find(o => o.isCorrect);
                    return correct ? (
                      <div className="rounded-xl p-3 mb-3 bg-green-500/10 border border-green-500/25">
                        <p className="text-green-400 text-xs font-semibold mb-1">
                          ✓ {isEn ? 'The correct answer:' : 'La bonne réponse :'}
                        </p>
                        <p className="text-green-200 text-sm font-medium mb-1">{correct.label}</p>
                        <p className="text-gray-400 text-xs leading-relaxed">{correct.explanation}</p>
                      </div>
                    ) : null;
                  })()}

                  {challenge.mathNote && (
                    <div className="rounded-xl p-3 mb-3 bg-blue-500/10 border border-blue-500/20">
                      <p className="text-blue-400 text-xs font-medium mb-1">🔢 {isEn ? 'The calculation' : 'Le calcul'}</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{challenge.mathNote}</p>
                    </div>
                  )}

                  <div className="rounded-xl p-3 mb-4 bg-yellow-500/10 border border-yellow-500/20 flex-1">
                    <div className="flex items-center gap-1 mb-1.5">
                      <Brain size={12} className="text-yellow-400" />
                      <p className="text-yellow-400 text-xs font-medium">{isEn ? 'Key lesson' : 'Leçon clé'}</p>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">{challenge.lesson}</p>
                  </div>

                  {/* Desktop: close button at bottom of right col */}
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="w-full py-3 rounded-xl font-bold text-sm text-black hidden md:block"
                    style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}
                  >
                    {isEn ? 'Close' : 'Fermer'}
                  </motion.button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Compact card for landing page ───────────────────────────────────────────

interface DailyChallengeCardProps {
  challenge: Challenge | null;
  isCompleted: boolean;
  wasCorrect: boolean | null;
  streak: number;
  loading: boolean;
  onOpen: () => void;
}

export function DailyChallengeCard({ challenge, isCompleted, wasCorrect, streak, loading, onOpen }: DailyChallengeCardProps) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const levelLabels = isEn ? LEVEL_LABELS_EN : LEVEL_LABELS;
  const typeLabels = isEn ? TYPE_LABELS_EN : TYPE_LABELS;

  if (loading || !challenge) return null;
  const levelMeta = levelLabels[challenge.level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={!isCompleted ? { scale: 1.02 } : {}}
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: 'linear-gradient(135deg, #0d1f0d, #1a3a1a)', border: '1px solid #c9a84c40' }}
      onClick={!isCompleted ? onOpen : undefined}
    >
      <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at top right, #c9a84c, transparent 60%)' }} />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-base">🎯</div>
            <div>
              <p className="text-yellow-400 font-bold text-sm">{isEn ? 'Daily Challenge' : 'Défi du Jour'}</p>
              <p className="text-gray-500 text-xs">
                {new Date().toLocaleDateString(isEn ? 'en-US' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 rounded-full px-2.5 py-1">
              <Flame size={13} className="text-orange-400" />
              <span className="text-orange-400 text-xs font-bold">{streak} {isEn ? (streak > 1 ? 'days' : 'day') : 'jours'}</span>
            </div>
          )}
        </div>

        {isCompleted ? (
          <div className={`rounded-xl p-3 text-center ${wasCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
            <p className="text-lg mb-1">{wasCorrect ? '✅' : '❌'}</p>
            <p className={`text-sm font-semibold ${wasCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {wasCorrect
                ? (isEn ? 'Well done! Daily challenge completed.' : 'Bravo ! Défi du jour réussi.')
                : (isEn ? 'Challenge attempted, come back tomorrow!' : 'Défi tenté, reviens demain !')}
            </p>
            {wasCorrect && <p className="text-yellow-400 text-xs mt-1">{isEn ? '+XP earned ⚡' : '+XP gagnés ⚡'}</p>}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: levelMeta.color + '20', color: levelMeta.color }}>
                {levelMeta.label}
              </span>
              <span className="text-gray-500 text-xs">{typeLabels[challenge.type]}</span>
              <span className="text-gray-600 text-xs">· {STREET_LABELS[challenge.context.street] ?? challenge.context.street}</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{challenge.villain.emoji}</span>
              <span className="text-gray-400 text-xs">{challenge.villain.name} · {challenge.context.position}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {challenge.context.heroHand.map((c, i) => <PokerCardSmall key={i} value={c} />)}
              </div>
              {challenge.context.board.length > 0 && (
                <>
                  <span className="text-gray-600">·</span>
                  <div className="flex gap-1">
                    {challenge.context.board.slice(0, 3).map((c, i) => <PokerCardSmall key={i} value={c} />)}
                    {challenge.context.board.length > 3 && <span className="text-gray-500 text-xs self-center">+{challenge.context.board.length - 3}</span>}
                  </div>
                </>
              )}
              <div className="ml-auto">
                <div className="px-3 py-1.5 rounded-lg text-xs font-bold text-black" style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}>
                  {isEn ? 'Play →' : 'Jouer →'}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
