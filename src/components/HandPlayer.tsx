'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Trophy, Brain, RotateCcw, CheckCircle, XCircle, Target } from 'lucide-react';
import type { HandScript, HandStep } from '@/lib/hand-scripts';

// ─── Card component ───────────────────────────────────────────────────────────

function Card({ value, hidden, small }: { value: string; hidden?: boolean; small?: boolean }) {
  const size = small ? 'w-8 h-11 text-[10px]' : 'w-10 h-14 text-xs';
  if (hidden) {
    return (
      <div className={`${size} rounded-lg flex items-center justify-center text-white shadow-lg`}
        style={{ background: 'linear-gradient(135deg, #1a3a8f, #0d2060)' }}>
        ♠
      </div>
    );
  }
  const suit = value.slice(-1);
  const rank = value.slice(0, -1);
  const isRed = suit === '♥' || suit === '♦';
  return (
    <motion.div
      initial={{ scale: 0, rotateY: -90 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
      className={`${size} rounded-lg bg-white flex flex-col items-center justify-center shadow-md font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}
    >
      <span className="leading-none">{rank}</span>
      <span className="leading-none">{suit}</span>
    </motion.div>
  );
}

// ─── Street badge ─────────────────────────────────────────────────────────────

const STREET_COLORS: Record<string, string> = {
  preflop: '#6b7280',
  flop: '#22c55e',
  turn: '#3b82f6',
  river: '#f59e0b',
};
const STREET_LABELS: Record<string, string> = {
  preflop: 'Préflop',
  flop: 'Flop',
  turn: 'Turn',
  river: 'River',
};

// ─── Progress dots ────────────────────────────────────────────────────────────

function ProgressDots({ total, current, results }: { total: number; current: number; results: boolean[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < results.length;
        const correct = results[i];
        return (
          <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${
            i === current && !done ? 'ring-2 ring-white/40 ring-offset-1 ring-offset-transparent' : ''
          } ${
            done ? (correct ? 'bg-green-400' : 'bg-red-400') : i < current ? 'bg-white/30' : 'bg-white/10'
          }`} />
        );
      })}
    </div>
  );
}

// ─── Multi-script picker ──────────────────────────────────────────────────────

interface MultiHandPlayerProps {
  scripts: HandScript[];
  onComplete: (score: number) => void;
  onBack: () => void;
}

const LEVEL_COLORS: Record<string, string> = {
  debutant: '#22c55e',
  intermediaire: '#3b82f6',
  avance: '#a855f7',
  expert: '#eab308',
  professionnel: '#ef4444',
};

export function MultiHandPlayer({ scripts, onComplete, onBack }: MultiHandPlayerProps) {
  const [selected, setSelected] = useState<HandScript | null>(null);

  if (selected) {
    return (
      <HandPlayer
        script={selected}
        onComplete={onComplete}
        onBack={() => setSelected(null)}
      />
    );
  }

  const color = LEVEL_COLORS[scripts[0]?.level] ?? '#eab308';

  return (
    <div className="max-w-xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: color + '20' }}>
            <Target size={16} style={{ color }} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color }}>Mains Guidées</p>
            <p className="text-white text-sm font-medium">{scripts.length} mains disponibles</p>
          </div>
        </div>

        <div className="space-y-3">
          {scripts.map((script, i) => (
            <motion.button
              key={script.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(script)}
              className="w-full text-left rounded-2xl p-4 border transition-all group"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color + '40'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: color + '20', color }}>
                      Main {i + 1}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{script.setup.position}</span>
                    <div className="flex gap-0.5">
                      {script.setup.heroHand.map((c, j) => {
                        const suit = c.slice(-1);
                        const isRed = suit === '♥' || suit === '♦';
                        return (
                          <span key={j} className={`text-xs font-bold ${isRed ? 'text-red-400' : 'text-white'}`}>{c}</span>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-white font-semibold text-sm mb-0.5">{script.title}</p>
                  <p className="text-gray-500 text-xs">{script.concept}</p>
                </div>
                <div className="ml-3 flex flex-col items-end gap-1.5 shrink-0">
                  <span className="flex items-center gap-1 text-xs" style={{ color }}>
                    <Trophy size={11} />
                    {script.xp} XP
                  </span>
                  <ChevronRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-white/5">
                <span className="text-xs text-gray-600">{script.villain.emoji} vs {script.villain.name}</span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-600">{script.steps.length} décisions</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface HandPlayerProps {
  script: HandScript;
  onComplete: (score: number) => void;
  onBack: () => void;
}

type Phase = 'intro' | 'playing' | 'answered' | 'result';

export function HandPlayer({ script, onComplete, onBack }: HandPlayerProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [revealedBoard, setRevealedBoard] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStep: HandStep = script.steps[stepIndex];
  const totalSteps = script.steps.length;
  const score = results.filter(Boolean).length;

  // Reveal board cards progressively when step changes
  useEffect(() => {
    if (phase !== 'playing' && phase !== 'answered') return;
    setRevealedBoard([]);
    const cards = currentStep.board;
    cards.forEach((_, i) => {
      setTimeout(() => setRevealedBoard(prev => [...prev, cards[i]]), i * 150);
    });
  }, [stepIndex, phase, currentStep.board]);

  function start() {
    setPhase('playing');
    setStepIndex(0);
    setSelected(null);
    setResults([]);
  }

  function handleSelect(idx: number) {
    if (phase !== 'playing') return;
    setSelected(idx);
    setPhase('answered');
    const isOptimal = currentStep.options[idx].isOptimal;
    setResults(prev => [...prev, isOptimal]);
  }

  function nextStep() {
    if (stepIndex + 1 >= totalSteps) {
      setPhase('result');
      onComplete(score + (currentStep.options[selected!]?.isOptimal ? 1 : 0));
      return;
    }
    setStepIndex(i => i + 1);
    setSelected(null);
    setPhase('playing');
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function restart() {
    setPhase('intro');
    setStepIndex(0);
    setSelected(null);
    setResults([]);
    setRevealedBoard([]);
  }

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: '#0d1f0d', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Target size={16} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wide">Main Guidée</p>
                <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {script.title}
                </h2>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              <span className="text-white font-medium">Concept : </span>{script.concept}
            </p>
          </div>

          {/* Setup */}
          <div className="p-5 space-y-4">
            {/* Hero hand */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-gray-400 text-xs mb-2">Ta main</p>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {script.setup.heroHand.map((c, i) => <Card key={i} value={c} />)}
                </div>
                <div className="text-sm text-gray-300 space-y-0.5">
                  <p><span className="text-gray-500">Position :</span> {script.setup.position}</p>
                  <p><span className="text-gray-500">Blindes :</span> {script.setup.blinds}</p>
                  <p><span className="text-gray-500">Stack :</span> {script.setup.effectiveStack}</p>
                  <p><span className="text-gray-500">Format :</span> {script.setup.gameType === 'cash' ? '💵 Cash Game' : '🏆 Tournoi'}</p>
                </div>
              </div>
            </div>

            {/* Villain */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-gray-400 text-xs mb-2">Ton adversaire</p>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{script.villain.emoji}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{script.villain.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{script.villain.style}</span>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-gray-400 mb-2">
                <span>VPIP <span className="text-white font-mono">{script.villain.vpip}%</span></span>
                <span>PFR <span className="text-white font-mono">{script.villain.pfr}%</span></span>
              </div>
              <p className="text-gray-400 text-xs">{script.villain.description}</p>
              <p className="text-yellow-400/80 text-xs mt-1 italic">💡 {script.villain.tendency}</p>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 bg-white/3 rounded-lg p-3">
              <Brain size={14} className="text-yellow-400 shrink-0" />
              <p>{totalSteps} décisions à prendre. Tu joueras la main du début à la fin et recevras des explications à chaque étape.</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={start}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}
            >
              Jouer la main <ChevronRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const finalScore = results.filter(Boolean).length;
    const pct = Math.round((finalScore / totalSteps) * 100);
    const perfect = finalScore === totalSteps;
    const good = pct >= 75;

    return (
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: '#0d1f0d', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="p-6 text-center border-b border-white/10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 250, delay: 0.1 }}
              className="text-5xl mb-3"
            >
              {perfect ? '🏆' : good ? '✅' : '📚'}
            </motion.div>
            <h3 className="text-white font-bold text-xl mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
              {perfect ? 'Main parfaite !' : good ? 'Bien joué !' : 'Continue à apprendre'}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-3xl font-bold" style={{ color: perfect ? '#eab308' : good ? '#22c55e' : '#ef4444' }}>
                {finalScore}/{totalSteps}
              </span>
              <span className="text-gray-400 text-sm">décisions optimales</span>
            </div>

            {/* Score dots */}
            <div className="flex justify-center gap-2 mt-3">
              {results.map((r, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${r ? 'bg-green-400' : 'bg-red-400'}`} />
              ))}
            </div>

            {/* XP */}
            <div className="mt-3 inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1">
              <Trophy size={13} className="text-yellow-400" />
              <span className="text-yellow-400 text-sm font-bold">+{Math.round(script.xp * (finalScore / totalSteps))} XP</span>
            </div>
          </div>

          {/* Lesson */}
          <div className="p-5">
            <div className="rounded-xl p-4 mb-4 bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-1.5 mb-2">
                <Brain size={14} className="text-yellow-400" />
                <p className="text-yellow-400 text-xs font-semibold">La leçon de cette main</p>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{script.lesson}</p>
            </div>

            {/* Step recap */}
            <div className="space-y-2 mb-4">
              {script.steps.map((step, i) => {
                const wasOptimal = results[i];
                const chosen = i < results.length ? step.options.find(o => o.isOptimal === wasOptimal && (wasOptimal || step.options.indexOf(o) >= 0)) : null;
                const optimal = step.options.find(o => o.isOptimal);
                return (
                  <div key={i} className={`rounded-lg p-3 text-xs ${wasOptimal ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {wasOptimal ? <CheckCircle size={12} className="text-green-400" /> : <XCircle size={12} className="text-red-400" />}
                      <span className="text-gray-300 font-medium capitalize">{STREET_LABELS[step.street]}</span>
                    </div>
                    {!wasOptimal && optimal && (
                      <p className="text-gray-400">Optimal : <span className="text-white">{optimal.label}</span></p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={restart}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition-colors text-sm"
              >
                <RotateCcw size={14} /> Rejouer
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onBack}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-black"
                style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}
              >
                Terminer
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── PLAYING / ANSWERED ─────────────────────────────────────────────────────
  const streetColor = STREET_COLORS[currentStep.street];

  return (
    <div className="max-w-xl mx-auto" ref={containerRef}>
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: '#0d1f0d', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {/* Header */}
          <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: streetColor + '20', color: streetColor }}
              >
                {STREET_LABELS[currentStep.street]}
              </span>
              <span className="text-gray-500 text-xs">Étape {stepIndex + 1}/{totalSteps}</span>
            </div>
            <ProgressDots total={totalSteps} current={stepIndex} results={results} />
          </div>

          <div className="p-5 space-y-4">
            {/* Table visuelle */}
            <div
              className="rounded-xl p-4"
              style={{ background: 'linear-gradient(135deg, #0f2d0f, #1a4a2e)', border: '1px solid #1a4a2e' }}
            >
              {/* Board */}
              <div className="text-center mb-3">
                {currentStep.board.length === 0 ? (
                  <p className="text-gray-600 text-xs">Préflop, pas de board</p>
                ) : (
                  <div>
                    <p className="text-gray-500 text-xs mb-1.5">Board</p>
                    <div className="flex justify-center gap-1.5">
                      {revealedBoard.map((c, i) => <Card key={i} value={c} />)}
                    </div>
                  </div>
                )}
              </div>

              {/* Info bar */}
              <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                <span>Pot : <span className="text-white font-mono">{currentStep.pot}</span></span>
                <div className="flex gap-1.5">
                  {script.setup.heroHand.map((c, i) => <Card key={i} value={c} small />)}
                </div>
                <span>Stack : <span className="text-white font-mono">{currentStep.heroStack}</span></span>
              </div>
            </div>

            {/* Villain */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-2xl">{script.villain.emoji}</span>
              <div className="flex-1">
                <p className="text-white text-xs font-medium">{script.villain.name}</p>
                <p className="text-gray-400 text-xs">{currentStep.narrative}</p>
              </div>
            </div>

            {/* Question */}
            <p className="text-white font-semibold text-sm">{currentStep.question}</p>

            {/* Lesson hint */}
            {currentStep.lessonHint && phase === 'playing' && (
              <div className="flex items-start gap-2 text-xs text-gray-500 italic">
                <Brain size={12} className="text-gray-600 mt-0.5 shrink-0" />
                <span>{currentStep.lessonHint}</span>
              </div>
            )}

            {/* Options */}
            <div className="space-y-2">
              {currentStep.options.map((opt, i) => {
                const isSelected = selected === i;
                let bg = 'rgba(255,255,255,0.05)';
                let border = 'rgba(255,255,255,0.1)';
                let textColor = '#9ca3af';
                let icon = null;

                if (phase === 'answered' && isSelected) {
                  if (opt.isOptimal) {
                    bg = 'rgba(34,197,94,0.12)';
                    border = '#22c55e';
                    textColor = '#86efac';
                    icon = <CheckCircle size={14} className="text-green-400 shrink-0" />;
                  } else {
                    bg = 'rgba(239,68,68,0.12)';
                    border = '#ef4444';
                    textColor = '#fca5a5';
                    icon = <XCircle size={14} className="text-red-400 shrink-0" />;
                  }
                } else if (phase === 'answered' && opt.isOptimal) {
                  bg = 'rgba(34,197,94,0.06)';
                  border = 'rgba(34,197,94,0.4)';
                  textColor = '#6ee7b7';
                }

                return (
                  <div key={i}>
                    <motion.button
                      whileTap={phase === 'playing' ? { scale: 0.98 } : {}}
                      onClick={() => handleSelect(i)}
                      disabled={phase === 'answered'}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                      style={{ background: bg, border: `1px solid ${border}`, color: textColor }}
                    >
                      <span className="flex items-start gap-2">
                        <span className="text-gray-500 shrink-0 font-mono text-xs mt-0.5">{['A', 'B', 'C', 'D'][i]}.</span>
                        <span className="flex-1">{opt.label}</span>
                        {icon}
                      </span>
                    </motion.button>

                    {/* Feedback */}
                    <AnimatePresence>
                      {phase === 'answered' && isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="mx-1 mt-1 p-3 rounded-b-xl text-xs leading-relaxed"
                            style={{
                              background: opt.isOptimal ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                              borderLeft: `2px solid ${opt.isOptimal ? '#22c55e' : '#ef4444'}`,
                              color: '#d1d5db',
                            }}
                          >
                            {opt.feedback}
                          </div>
                        </motion.div>
                      )}
                      {phase === 'answered' && !isSelected && opt.isOptimal && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.25, delay: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="mx-1 mt-1 p-3 rounded-b-xl text-xs leading-relaxed"
                            style={{
                              background: 'rgba(34,197,94,0.06)',
                              borderLeft: '2px solid rgba(34,197,94,0.5)',
                              color: '#9ca3af',
                            }}
                          >
                            <span className="text-green-400 font-medium">✓ Meilleur move : </span>{opt.feedback}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Next button */}
            {phase === 'answered' && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.97 }}
                onClick={nextStep}
                className="w-full py-3 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 mt-2"
                style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}
              >
                {stepIndex + 1 >= totalSteps ? 'Voir le résultat' : 'Décision suivante'}
                <ChevronRight size={16} />
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
