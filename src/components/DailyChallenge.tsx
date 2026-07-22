'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Trophy, ChevronRight, Brain } from 'lucide-react';
import type { Challenge } from '@/lib/challenges-data';

// ─── Card display ─────────────────────────────────────────────────────────────

function PokerCardSmall({ value, hidden }: { value: string; hidden?: boolean }) {
  if (hidden) {
    return (
      <div className="w-9 h-12 rounded-md flex items-center justify-center text-white text-lg shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1a3a8f, #0d2060)' }}>
        ♠
      </div>
    );
  }
  const suit = value.slice(-1);
  const rank = value.slice(0, -1);
  const isRed = suit === '♥' || suit === '♦';
  return (
    <div className={`w-9 h-12 rounded-md bg-white flex flex-col items-center justify-center shadow-md font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
      <span className="text-xs leading-none">{rank}</span>
      <span className="text-sm leading-none">{suit}</span>
    </div>
  );
}

// ─── VPIP/PFR stat bar ───────────────────────────────────────────────────────

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

// ─── Main component ──────────────────────────────────────────────────────────

type Screen = 'briefing' | 'challenge' | 'result';

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  debutant: { label: 'Débutant', color: '#22c55e' },
  intermediaire: { label: 'Intermédiaire', color: '#3b82f6' },
  avance: { label: 'Avancé', color: '#a855f7' },
  expert: { label: 'Expert', color: '#eab308' },
  professionnel: { label: 'Professionnel', color: '#ef4444' },
};

const TYPE_LABELS: Record<string, string> = {
  decision: '🎯 Décision',
  calculation: '🔢 Calcul',
  reads: '👁 Read',
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
  const [screen, setScreen] = useState<Screen>('briefing');
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const levelMeta = LEVEL_LABELS[challenge.level];

  function handleAnswer(idx: number) {
    if (confirmed) return;
    setSelected(idx);
  }

  function handleConfirm() {
    if (selected === null) return;
    setConfirmed(true);
    const isCorrect = challenge.options[selected].isCorrect;
    setTimeout(() => {
      setScreen('result');
      onComplete(isCorrect);
    }, 800);
  }

  const isCorrect = selected !== null && challenge.options[selected].isCorrect;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg z-10 rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0d1f0d', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-bold text-sm">Défi du Jour</span>
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 rounded-full px-2 py-0.5">
                <Flame size={12} className="text-orange-400" />
                <span className="text-orange-400 text-xs font-bold">{streak}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: levelMeta.color + '20', color: levelMeta.color }}>
              {levelMeta.label}
            </span>
            <span className="text-xs text-gray-500">{TYPE_LABELS[challenge.type]}</span>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors ml-1">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Screens */}
        <AnimatePresence mode="wait">
          {screen === 'briefing' && (
            <motion.div key="briefing"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="p-5"
            >
              <h3 className="text-white font-bold text-base mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                {challenge.title}
              </h3>

              {/* Villain card */}
              <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{challenge.villain.emoji}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{challenge.villain.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{challenge.villain.style}</span>
                  </div>
                </div>
                <div className="space-y-1.5 mb-3">
                  <StatBar label="VPIP" value={challenge.villain.vpip} color="#22c55e" />
                  <StatBar label="PFR" value={challenge.villain.pfr} max={40} color="#3b82f6" />
                </div>
                <p className="text-gray-400 text-xs">{challenge.villain.description}</p>
                <p className="text-yellow-400/80 text-xs mt-1 italic">💡 {challenge.villain.tendency}</p>
              </div>

              {/* Context */}
              <div className="rounded-xl p-3 space-y-1.5 text-xs mb-4" style={{ background: '#1a4a2e33', border: '1px solid #1a4a2e' }}>
                <div className="flex justify-between">
                  <span className="text-gray-400">Format</span>
                  <span className="text-white">{challenge.context.gameType === 'cash' ? '💵 Cash Game' : '🏆 Tournoi'} — Blindes {challenge.context.blinds}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Position</span>
                  <span className="text-white">{challenge.context.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Stacks effectifs</span>
                  <span className="text-white">{challenge.context.effectiveStack}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Street</span>
                  <span className="text-white capitalize">{challenge.context.street}</span>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-5">{challenge.context.action}</p>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setScreen('challenge')}
                className="w-full py-3 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}
              >
                Relever le défi <ChevronRight size={16} />
              </motion.button>
            </motion.div>
          )}

          {screen === 'challenge' && (
            <motion.div key="challenge"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="p-5"
            >
              {/* Cards display */}
              <div className="rounded-xl p-4 mb-4" style={{ background: '#1a4a2e55', border: '1px solid #1a4a2e' }}>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1.5">Votre main</p>
                    <div className="flex gap-1.5">
                      {challenge.context.heroHand.map((c, i) => <PokerCardSmall key={i} value={c} />)}
                    </div>
                  </div>
                  {challenge.context.board.length > 0 && (
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs mb-1.5">Board — {challenge.context.street}</p>
                      <div className="flex gap-1 flex-wrap">
                        {challenge.context.board.map((c, i) => <PokerCardSmall key={i} value={c} />)}
                      </div>
                    </div>
                  )}
                  {challenge.context.board.length === 0 && (
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs mb-1.5">Preflop</p>
                      <div className="flex gap-1">
                        <PokerCardSmall value="" hidden />
                        <PokerCardSmall value="" hidden />
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <span>Pot : {challenge.context.pot}</span>
                  <span>·</span>
                  <span>{challenge.context.position}</span>
                </div>
              </div>

              <p className="text-white font-semibold text-sm mb-4">{challenge.question}</p>

              {/* Options */}
              <div className="space-y-2 mb-4">
                {challenge.options.map((opt, i) => {
                  let style = 'border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-yellow-500/50';
                  if (selected === i && !confirmed) style = 'border border-yellow-500 bg-yellow-500/10 text-white';
                  if (confirmed && selected === i) {
                    style = opt.isCorrect
                      ? 'border border-green-500 bg-green-500/15 text-green-300'
                      : 'border border-red-500 bg-red-500/15 text-red-300';
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
                className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: selected !== null ? 'linear-gradient(to right, #ca8a04, #eab308)' : 'rgba(255,255,255,0.1)', color: selected !== null ? '#000' : '#6b7280' }}
              >
                {confirmed ? (isCorrect ? '✓ Correct !' : '✗ Incorrect') : 'Valider ma réponse'}
              </motion.button>
            </motion.div>
          )}

          {screen === 'result' && (
            <motion.div key="result"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="p-5"
            >
              {/* Result header */}
              <div className={`rounded-xl p-4 mb-4 text-center ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                  className="text-4xl mb-2"
                >
                  {isCorrect ? '✅' : '❌'}
                </motion.div>
                <p className={`font-bold text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? 'Bonne réponse !' : 'Pas tout à fait...'}
                </p>
                {isCorrect && (
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <Trophy size={14} className="text-yellow-400" />
                    <span className="text-yellow-400 text-xs font-bold">+{challenge.xp} XP</span>
                  </div>
                )}
              </div>

              {/* Selected answer explanation */}
              {selected !== null && (
                <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-xs text-gray-400 mb-1">Ta réponse — {challenge.options[selected].label}</p>
                  <p className="text-gray-300 text-sm">{challenge.options[selected].explanation}</p>
                </div>
              )}

              {/* Math note */}
              {challenge.mathNote && (
                <div className="rounded-xl p-3 mb-3 bg-blue-500/10 border border-blue-500/20">
                  <p className="text-blue-400 text-xs font-medium mb-1">🔢 Le calcul</p>
                  <p className="text-gray-300 text-sm">{challenge.mathNote}</p>
                </div>
              )}

              {/* Lesson */}
              <div className="rounded-xl p-3 mb-5 bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-1 mb-1">
                  <Brain size={12} className="text-yellow-400" />
                  <p className="text-yellow-400 text-xs font-medium">Leçon clé</p>
                </div>
                <p className="text-gray-200 text-sm">{challenge.lesson}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-sm text-black"
                style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}
              >
                Fermer
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
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
  if (loading || !challenge) return null;
  const levelMeta = LEVEL_LABELS[challenge.level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={!isCompleted ? { scale: 1.02 } : {}}
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: 'linear-gradient(135deg, #0d1f0d, #1a3a1a)', border: '1px solid #c9a84c40' }}
      onClick={!isCompleted ? onOpen : undefined}
    >
      {/* Gold glow */}
      <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at top right, #c9a84c, transparent 60%)' }} />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-base">🎯</div>
            <div>
              <p className="text-yellow-400 font-bold text-sm">Défi du Jour</p>
              <p className="text-gray-500 text-xs">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 rounded-full px-2.5 py-1">
              <Flame size={13} className="text-orange-400" />
              <span className="text-orange-400 text-xs font-bold">{streak} jours</span>
            </div>
          )}
        </div>

        {isCompleted ? (
          <div className={`rounded-xl p-3 text-center ${wasCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
            <p className="text-lg mb-1">{wasCorrect ? '✅' : '❌'}</p>
            <p className={`text-sm font-semibold ${wasCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {wasCorrect ? 'Bravo ! Défi du jour réussi.' : 'Défi tenté — reviens demain !'}
            </p>
            {wasCorrect && <p className="text-yellow-400 text-xs mt-1">+{challenge.xp} XP gagnés</p>}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: levelMeta.color + '20', color: levelMeta.color }}>
                {levelMeta.label}
              </span>
              <span className="text-gray-500 text-xs">{TYPE_LABELS[challenge.type]}</span>
            </div>
            <p className="text-white font-semibold text-sm mb-3">{challenge.title}</p>
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
                  Jouer →
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
