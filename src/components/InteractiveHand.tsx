'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PokerCard from './PokerCard';
import { Card } from '@/lib/poker-data';

export interface HandScenario {
  id: string;
  title: string;
  description: string;
  position: string;
  stack: string;
  heroHand: Card[];
  board: Card[];
  potSize: string;
  villainAction: string;
  options: {
    label: string;
    action: 'fold' | 'call' | 'raise' | 'check';
    isCorrect: boolean;
    explanation: string;
  }[];
}

const SAMPLE_SCENARIOS: HandScenario[] = [
  {
    id: 'scenario-1',
    title: 'Flush Draw au Flop',
    description: 'Vous êtes en position (BTN). L\'adversaire mise 2/3 du pot sur ce flop humide.',
    position: 'BTN (Button)',
    stack: '100 BB',
    heroHand: [
      { rank: 'A', suit: '♥', isRed: true },
      { rank: '8', suit: '♥', isRed: true },
    ],
    board: [
      { rank: 'K', suit: '♥', isRed: true },
      { rank: '7', suit: '♥', isRed: true },
      { rank: '2', suit: '♦', isRed: true },
    ],
    potSize: '20 BB',
    villainAction: 'Bet 13 BB (2/3 pot)',
    options: [
      { label: 'Fold', action: 'fold', isCorrect: false, explanation: 'Trop tight ! Vous avez un flush draw avec le nut flush draw (A♥). Pot odds correctes + pot equity élevée.' },
      { label: 'Call', action: 'call', isCorrect: true, explanation: 'Correct ! Call avec 9 outs flush + nut draw. Pot odds ~29% vs équité ~36% sur 2 streets = call très rentable.' },
      { label: 'Raise (Semi-bluff)', action: 'raise', isCorrect: true, explanation: 'Aussi correct ! Raise 2.5-3x la mise adverse. Vous avez la meilleure draw + fold equity. Très puissant en position.' },
      { label: 'Check', action: 'check', isCorrect: false, explanation: 'Ce n\'est pas possible ici : l\'adversaire vient de bet. Vous devez choisir entre fold, call, ou raise.' },
    ],
  },
  {
    id: 'scenario-2',
    title: 'Top Pair sur Board Humide',
    description: 'Vous avez ouvert UTG, un joueur appelle en CO. Board vient dangereux. Il check.',
    position: 'UTG (Early Position)',
    stack: '100 BB',
    heroHand: [
      { rank: 'A', suit: '♠', isRed: false },
      { rank: 'K', suit: '♦', isRed: true },
    ],
    board: [
      { rank: 'K', suit: '♥', isRed: true },
      { rank: 'J', suit: '♥', isRed: true },
      { rank: '10', suit: '♣', isRed: false },
    ],
    potSize: '14 BB',
    villainAction: 'Check',
    options: [
      { label: 'Bet 1/3 pot', action: 'raise', isCorrect: false, explanation: 'Trop petit sur ce board. Vous donnez des odds correctes aux draws flush et straight.' },
      { label: 'Bet 2/3 à 3/4 pot', action: 'call', isCorrect: true, explanation: 'Correct ! Sur ce board très connecté, bettez large pour protéger votre top pair top kicker contre les nombreux draws.' },
      { label: 'Check (slow play)', action: 'check', isCorrect: false, explanation: 'Dangereux ! Ce board est trop humide pour slow play. Q, 9, A♥, tout peut vous écraser au turn.' },
      { label: 'All-in', action: 'raise', isCorrect: false, explanation: 'Overbet au flop sans raison précise. Gardez de la valeur pour les streets suivantes.' },
    ],
  },
  {
    id: 'scenario-3',
    title: 'Bluff ou Value ?',
    description: 'River. Vous avez rate votre draw. Board paie bien un bluff.',
    position: 'CO (Cutoff)',
    stack: '80 BB restants',
    heroHand: [
      { rank: 'Q', suit: '♦', isRed: true },
      { rank: 'J', suit: '♦', isRed: true },
    ],
    board: [
      { rank: 'A', suit: '♣', isRed: false },
      { rank: 'K', suit: '♦', isRed: true },
      { rank: '8', suit: '♦', isRed: true },
      { rank: '2', suit: '♠', isRed: false },
      { rank: '7', suit: '♣', isRed: false },
    ],
    potSize: '40 BB',
    villainAction: 'Check',
    options: [
      { label: 'Bluff pot bet', action: 'raise', isCorrect: false, explanation: 'Trop gros pour un bluff pur ici. Vous n\'avez pas de blockers As. Overbet expose trop de chips.' },
      { label: 'Bluff 2/3 pot', action: 'call', isCorrect: true, explanation: 'Acceptable ! Vous représentez un flush (rate) ou un straight. Le board A-K suggère vous pouviez avoir ces draws depuis la position CO.' },
      { label: 'Check (give up)', action: 'check', isCorrect: true, explanation: 'Aussi correct. Vous n\'avez rien : sans fold equity élevée et sans blockers, abandonner est raisonnable.' },
      { label: 'Small bet 1/4 pot', action: 'call', isCorrect: false, explanation: 'Trop petite : ne force pas les bonnes mains à folder et donne des odds correctes à la plupart.' },
    ],
  },
];

interface InteractiveHandProps {
  scenario?: HandScenario;
  onComplete?: () => void;
}

export default function InteractiveHand({ scenario, onComplete }: InteractiveHandProps) {
  const sc = scenario || SAMPLE_SCENARIOS[0];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showBoard, setShowBoard] = useState(false);

  const handleSelect = (i: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(i);
  };

  const selected = selectedOption !== null ? sc.options[selectedOption] : null;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a1410] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-green-900/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white">{sc.title}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{sc.position} · Stack: {sc.stack}</p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <div>Pot: <span className="text-white font-bold">{sc.potSize}</span></div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-5 felt-bg">
        {/* Hero cards */}
        <div className="text-center mb-6">
          <p className="text-green-400 text-xs mb-2 uppercase tracking-wide">Vos cartes</p>
          <div className="flex justify-center gap-2">
            {sc.heroHand.map((card, i) => (
              <PokerCard key={i} card={card} size="lg" delay={i * 0.15} />
            ))}
          </div>
        </div>

        {/* Board */}
        <div className="text-center mb-4">
          <p className="text-white/50 text-xs mb-2 uppercase tracking-wide">Board</p>
          <div className="flex justify-center gap-1.5 flex-wrap">
            {sc.board.map((card, i) => (
              <PokerCard key={i} card={card} size="md" delay={i * 0.1 + 0.3} />
            ))}
          </div>
        </div>

        {/* Villain action */}
        <div className="text-center">
          <span className="inline-block bg-black/40 border border-white/20 rounded-full px-3 py-1 text-white/70 text-xs">
            Adversaire: <strong className="text-white">{sc.villainAction}</strong>
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 pt-4">
        <p className="text-gray-400 text-sm">{sc.description}</p>
      </div>

      {/* Options */}
      <div className="p-5">
        <p className="text-gray-500 text-xs mb-3 uppercase tracking-wide">Quelle action choisissez-vous ?</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {sc.options.map((opt, i) => {
            let cls = 'border-white/10 bg-white/5 hover:border-white/20';
            if (selectedOption !== null) {
              if (i === selectedOption && opt.isCorrect) cls = 'border-green-500 bg-green-900/30';
              else if (i === selectedOption && !opt.isCorrect) cls = 'border-red-500 bg-red-900/30';
              else if (opt.isCorrect) cls = 'border-green-500/40 bg-green-900/10';
              else cls = 'border-white/5 opacity-40';
            }
            return (
              <motion.button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selectedOption !== null}
                whileHover={selectedOption === null ? { scale: 1.02 } : {}}
                whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                className={`p-3 rounded-xl border text-left transition-all font-medium text-sm ${cls}`}
              >
                {opt.label}
                {selectedOption !== null && opt.isCorrect && (
                  <span className="ml-1 text-green-400">✓</span>
                )}
                {selectedOption === i && !opt.isCorrect && (
                  <span className="ml-1 text-red-400">✗</span>
                )}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border ${selected.isCorrect ? 'bg-green-900/20 border-green-600/30' : 'bg-red-900/20 border-red-600/30'}`}
            >
              <div className={`text-sm font-bold mb-1 ${selected.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {selected.isCorrect ? '✅ Bonne décision !' : '❌ Pas optimal'}
              </div>
              <p className="text-gray-300 text-sm">{selected.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {selected && onComplete && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onComplete}
            className="w-full mt-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-white text-sm font-medium"
          >
            Suivant →
          </motion.button>
        )}
      </div>
    </div>
  );
}

export function InteractiveHandTrainer() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const handleComplete = () => {
    setCompleted(prev => new Set([...prev, currentScenario]));
    if (currentScenario < SAMPLE_SCENARIOS.length - 1) {
      setCurrentScenario(c => c + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {SAMPLE_SCENARIOS.map((sc, i) => (
          <button
            key={i}
            onClick={() => setCurrentScenario(i)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentScenario === i ? 'bg-green-700 text-white' :
              completed.has(i) ? 'bg-green-900/30 text-green-400 border border-green-700/30' :
              'bg-white/5 text-gray-500 hover:text-gray-300'
            }`}
          >
            Main {i + 1}
            {completed.has(i) && ' ✓'}
          </button>
        ))}
      </div>
      <InteractiveHand
        key={currentScenario}
        scenario={SAMPLE_SCENARIOS[currentScenario]}
        onComplete={currentScenario < SAMPLE_SCENARIOS.length - 1 ? handleComplete : undefined}
      />
    </div>
  );
}
