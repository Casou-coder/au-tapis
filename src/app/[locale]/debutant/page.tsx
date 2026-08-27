'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, ArrowRight } from 'lucide-react';
import PokerCard from '@/components/PokerCard';
import { InteractiveHandTrainer } from '@/components/InteractiveHand';
import { HandPlayer, MultiHandPlayer } from '@/components/HandPlayer';
import { XpToast } from '@/components/XpToast';
import { HAND_RANKINGS, POSITIONS, QUIZ_QUESTIONS } from '@/lib/poker-data';
import InlineQuiz from '@/components/InlineQuiz';
import { ALL_HAND_SCRIPTS } from '@/lib/hand-scripts';
import { useProgress } from '@/hooks/useProgress';
import { useLocale } from 'next-intl';

const MODULES_FR = [
  { id: 'regles', title: 'Les Règles', icon: '📖', color: '#27ae60' },
  { id: 'mains', title: 'Force des mains', icon: '🃏', color: '#27ae60' },
  { id: 'positions', title: 'Les Positions', icon: '📍', color: '#27ae60' },
  { id: 'actions', title: 'Les Actions', icon: '⚡', color: '#27ae60' },
  { id: 'selection', title: 'Sélection de mains', icon: '🎯', color: '#27ae60' },
  { id: 'trainer', title: 'Jouer des mains', icon: '🎮', color: '#27ae60' },
  { id: 'main-guidee', title: 'Main Guidée', icon: '🃏', color: '#27ae60' },
  { id: 'quiz', title: 'Quiz Final', icon: '🏆', color: '#27ae60' },
];

const MODULES_EN = [
  { id: 'regles', title: 'The Rules', icon: '📖', color: '#27ae60' },
  { id: 'mains', title: 'Hand Rankings', icon: '🃏', color: '#27ae60' },
  { id: 'positions', title: 'Positions', icon: '📍', color: '#27ae60' },
  { id: 'actions', title: 'Actions', icon: '⚡', color: '#27ae60' },
  { id: 'selection', title: 'Hand Selection', icon: '🎯', color: '#27ae60' },
  { id: 'trainer', title: 'Play Hands', icon: '🎮', color: '#27ae60' },
  { id: 'main-guidee', title: 'Guided Hand', icon: '🃏', color: '#27ae60' },
  { id: 'quiz', title: 'Final Quiz', icon: '🏆', color: '#27ae60' },
];

export default function DebutantPage() {
  const locale = useLocale();
  const isEn = locale === 'en';
  const MODULES = isEn ? MODULES_EN : MODULES_FR;

  const [activeModule, setActiveModule] = useState<string | null>(null);
  const { progress, completeModule, completeLevel, addXp } = useProgress();
  const [xpToast, setXpToast] = useState<number | null>(null);

  const isDone = (modId: string) => !!progress.completedModules[`debutant-${modId}`];
  const completedCount = MODULES.filter(m => isDone(m.id)).length;

  const complete = (id: string, xp = 50) => {
    completeModule(`debutant-${id}`);
    addXp(xp);
    setXpToast(xp);
    if (MODULES.every(m => m.id === id || isDone(m.id))) completeLevel('debutant');
    setActiveModule(null);
  };

  if (activeModule) {
    const props = { onComplete: () => complete(activeModule), onBack: () => setActiveModule(null) };
    if (activeModule === 'regles') return <ReglesModule {...props} />;
    if (activeModule === 'mains') return <MainsModule {...props} />;
    if (activeModule === 'positions') return <PositionsModule {...props} />;
    if (activeModule === 'actions') return <ActionsModule {...props} />;
    if (activeModule === 'selection') return <SelectionModule {...props} />;
    if (activeModule === 'trainer') return <TrainerModule {...props} />;
    if (activeModule === 'main-guidee') return (
      <div className="min-h-screen bg-[#060d08]">
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setActiveModule(null)} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">
              <ChevronLeft size={16} /> {isEn ? 'Back to modules' : 'Retour aux modules'}
            </button>
            <MultiHandPlayer scripts={ALL_HAND_SCRIPTS['debutant']} onComplete={(score) => complete(activeModule, 50 + (score >= 4 ? 150 : score >= 3 ? 100 : score >= 2 ? 50 : 0))} onBack={() => setActiveModule(null)} />
          </div>
        </div>
      </div>
    );
    if (activeModule === 'quiz') return <QuizModule {...props} />;
  }

  const progressPct = (completedCount / MODULES.length) * 100;

  return (
    <div className="min-h-screen bg-[#060d08]">
      <AnimatePresence>{xpToast !== null && <XpToast amount={xpToast} onDone={() => setXpToast(null)} />}</AnimatePresence>
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <Link href="/" className="text-green-400 text-sm flex items-center gap-1 mb-4 hover:text-green-300">
              <ChevronLeft size={16} /> {isEn ? 'Home' : 'Accueil'}
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🌱</span>
              <div>
                <p className="text-green-400 text-sm font-medium">{isEn ? 'Level 1' : 'Niveau 1'}</p>
                <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'Beginner' : 'Débutant'}</h1>
              </div>
            </div>
            <p className="text-gray-400 mt-2">{isEn ? 'Master the fundamentals of Texas Hold\'em Poker.' : 'Maîtrisez les fondamentaux du Texas Hold\'em Poker.'}</p>

            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{completedCount}/{MODULES.length} {isEn ? 'modules completed' : 'modules terminés'}</span>
                <span>{Math.round(progressPct)}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-700 to-green-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODULES.map((mod, i) => {
              const done = isDone(mod.id);
              const locked = i > 0 && !isDone(MODULES[i - 1].id);
              return (
                <motion.button
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => !locked && setActiveModule(mod.id)}
                  className={`relative text-left p-5 rounded-2xl border transition-all ${
                    done
                      ? 'border-green-500/50 bg-green-900/20'
                      : locked
                        ? 'border-gray-800 bg-gray-900/30 opacity-50 cursor-not-allowed'
                        : 'border-green-600/30 bg-green-900/10 hover:border-green-500/60 hover:bg-green-900/20 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{mod.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-400 font-medium">{isEn ? 'Module' : 'Module'} {i + 1}</span>
                        {done && <CheckCircle size={16} className="text-green-400" />}
                      </div>
                      <h3 className="font-bold text-white">{mod.title}</h3>
                    </div>
                  </div>
                  {!locked && !done && (
                    <div className="flex items-center gap-1 text-green-400 text-sm mt-1">
                      <span>{isEn ? 'Start' : 'Commencer'}</span>
                      <ArrowRight size={14} />
                    </div>
                  )}
                  {done && <p className="text-green-400 text-sm">✓ {isEn ? 'Done' : 'Terminé'}</p>}
                  {locked && <p className="text-gray-600 text-sm">🔒 {isEn ? 'Complete the previous module' : 'Terminez le module précédent'}</p>}
                </motion.button>
              );
            })}
          </div>

          {completedCount === MODULES.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 rounded-2xl border border-blue-500/40 bg-blue-900/20 text-center"
            >
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">{isEn ? 'Beginner level completed!' : 'Niveau Débutant complété !'}</h3>
              <p className="text-gray-400 mb-4">{isEn ? 'You master the fundamentals. Move on to the next step.' : 'Vous maîtrisez les fondamentaux. Passez à l\'étape suivante.'}</p>
              <Link
                href="/intermediaire"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                {isEn ? 'Intermediate Level' : 'Niveau Intermédiaire'} <ChevronRight size={18} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MODULE: RULES ─────────────────────────────────────────────────────────────

function ReglesModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: isEn ? 'Texas Hold\'em' : 'Le Texas Hold\'em',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            {isEn
              ? <><strong className="text-white">Texas Hold&apos;em</strong> is the most played form of poker in the world. The goal is simple: form the best 5-card combination using your 2 hole cards and the 5 community cards.</>
              : <>Le <strong className="text-white">Texas Hold&apos;em</strong> est la forme de poker la plus jouée au monde. L&apos;objectif est simple : former la meilleure combinaison de 5 cartes en utilisant vos 2 cartes privées et les 5 cartes communes.</>
            }
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl mb-2">🃏</div>
              <h4 className="font-bold text-white mb-1">{isEn ? 'Your cards (hole cards)' : 'Vos cartes (hole cards)'}</h4>
              <p className="text-gray-400 text-sm">{isEn ? '2 face-down cards, visible only to you.' : '2 cartes face cachée, uniquement visibles par vous.'}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl mb-2">🎴</div>
              <h4 className="font-bold text-white mb-1">{isEn ? 'Community cards (board)' : 'Les cartes communes (board)'}</h4>
              <p className="text-gray-400 text-sm">{isEn ? '5 cards shared by all players, revealed progressively.' : '5 cartes partagées par tous les joueurs, révélées progressivement.'}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: isEn ? 'How a Hand Plays Out' : 'Le Déroulement d\'une main',
      content: (
        <div className="space-y-3">
          {(isEn
            ? [
              { phase: 'Pre-flop', desc: 'Deal 2 hole cards. First betting round.' },
              { phase: 'Flop', desc: 'First 3 community cards revealed. Second betting round.' },
              { phase: 'Turn', desc: '4th community card revealed. Third betting round.' },
              { phase: 'River', desc: '5th and final community card. Last betting round.' },
              { phase: 'Showdown', desc: 'Cards revealed. Best hand wins the pot.' },
            ]
            : [
              { phase: 'Pré-flop', desc: 'Distribution des 2 cartes privées. Premier tour d\'enchères.' },
              { phase: 'Flop', desc: '3 premières cartes communes révélées. Deuxième tour d\'enchères.' },
              { phase: 'Turn', desc: '4e carte commune révélée. Troisième tour d\'enchères.' },
              { phase: 'River', desc: '5e et dernière carte commune. Tour d\'enchères final.' },
              { phase: 'Showdown', desc: 'Révélation des cartes. Le meilleur combinaison gagne le pot.' },
            ]
          ).map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-sm font-bold text-white shrink-0">{i + 1}</div>
              <div>
                <h4 className="font-bold text-white">{s.phase}</h4>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: isEn ? 'The Blinds' : 'Les Blinds',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            {isEn
              ? <>Before each hand, two players must post forced bets called <strong className="text-white">blinds</strong>.</>
              : <>Avant chaque main, deux joueurs doivent poster des mises obligatoires appelées <strong className="text-white">blinds</strong>.</>
            }
          </p>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-600/30">
              <h4 className="font-bold text-yellow-400 mb-1">Small Blind (SB)</h4>
              <p className="text-gray-300 text-sm">{isEn ? 'Forced bet from the player to the left of the dealer. Generally half the big blind.' : 'Mise obligatoire du joueur à gauche du dealer. Généralement la moitié du big blind.'}</p>
            </div>
            <div className="p-4 rounded-xl bg-orange-900/20 border border-orange-600/30">
              <h4 className="font-bold text-orange-400 mb-1">Big Blind (BB)</h4>
              <p className="text-gray-300 text-sm">{isEn ? 'Forced bet from the player to the left of the SB. This is the table\'s base bet (e.g. €1/€2 = SB €1 / BB €2).' : 'Mise obligatoire du joueur à gauche du SB. C\'est la mise de base de la table (ex: 1€/2€ = SB 1€ / BB 2€).'}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-600/30">
              <h4 className="font-bold text-blue-400 mb-1">{isEn ? 'The Dealer Button (BTN)' : 'Le Dealer Button (BTN)'}</h4>
              <p className="text-gray-300 text-sm">{isEn ? 'The button marks the virtual dealer. It rotates clockwise each hand.' : 'Le bouton marque le dealer fictif. Il tourne à chaque main dans le sens des aiguilles d\'une montre.'}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: isEn ? 'The Goal of the Game' : 'L\'objectif du jeu',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            {isEn ? <>{`You can win in `}<strong className="text-white">two ways</strong>:</> : <>Vous pouvez gagner de <strong className="text-white">deux façons</strong> :</>}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-green-900/20 border border-green-600/30 text-center">
              <div className="text-3xl mb-2">🃏</div>
              <h4 className="font-bold text-green-400 mb-1">{isEn ? 'Best hand' : 'Meilleure main'}</h4>
              <p className="text-gray-400 text-sm">{isEn ? 'At showdown, have the best 5-card combination.' : 'Au showdown, avoir la meilleure combinaison de 5 cartes.'}</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-600/30 text-center">
              <div className="text-3xl mb-2">🎭</div>
              <h4 className="font-bold text-purple-400 mb-1">{isEn ? 'Make them fold' : 'Faire folder'}</h4>
              <p className="text-gray-400 text-sm">{isEn ? 'Bet in a way that forces all opponents to fold.' : 'Miser de manière à forcer tous les adversaires à abandonner.'}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-gray-300 text-sm">
              <strong className="text-yellow-400">{isEn ? 'Important:' : 'Important :'}</strong> {isEn ? 'You do NOT need to have the best hand to win. Bluffing is a valid and fundamental poker strategy.' : 'Vous n\'avez PAS besoin d\'avoir la meilleure main pour gagner. Le bluff est une stratégie valide et fondamentale du poker.'}
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <ModuleLayout title={isEn ? 'Poker Rules' : 'Les Règles du Poker'} icon="📖" color="#27ae60" onBack={onBack} step={step} totalSteps={steps.length} onComplete={onComplete} onNext={() => step < steps.length - 1 ? setStep(s => s + 1) : onComplete()} onPrev={() => step > 0 ? setStep(s => s - 1) : onBack()} isLastStep={step === steps.length - 1} quizKey="debutant-regles">
      <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        {steps[step].title}
      </h2>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          {steps[step].content}
        </motion.div>
      </AnimatePresence>
    </ModuleLayout>
  );
}

// ── MODULE: HANDS ─────────────────────────────────────────────────────────────

function MainsModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [selectedHand, setSelectedHand] = useState(0);
  const hand = HAND_RANKINGS[selectedHand];

  return (
    <ModuleLayout title={isEn ? 'Hand Rankings' : 'Force des Mains'} icon="🃏" color="#27ae60" onBack={onBack} step={0} totalSteps={1} onComplete={onComplete} onNext={onComplete} onPrev={onBack} isLastStep quizKey="debutant-mains">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
        {isEn ? 'Hand Hierarchy' : 'Hiérarchie des mains'}
      </h2>
      <p className="text-gray-400 text-sm mb-6">{isEn ? 'Click each hand to see details. From strongest to weakest.' : 'Cliquez sur chaque main pour voir les détails. Du plus fort au plus faible.'}</p>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {HAND_RANKINGS.map((h, i) => (
          <button
            key={i}
            onClick={() => setSelectedHand(i)}
            className={`text-left p-2.5 rounded-xl border transition-all ${
              selectedHand === i
                ? 'border-green-500 bg-green-900/30'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{h.emoji}</span>
              <div>
                <div className="text-xs text-gray-500">#{h.rank}</div>
                <div className="text-white text-sm font-medium">{h.name}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedHand}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-5 rounded-2xl border border-green-500/30 bg-green-900/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{hand.emoji}</span>
            <div>
              <h3 className="font-bold text-white text-lg">{hand.name}</h3>
              <p className="text-green-400 text-xs">{hand.nameEn}</p>
            </div>
          </div>

          <div className="flex gap-1 mb-4 flex-wrap">
            {hand.example.map((card, i) => (
              <PokerCard key={i} card={card} size="sm" delay={i * 0.1} />
            ))}
          </div>

          <p className="text-gray-300 text-sm mb-3">{hand.description}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-gray-500 text-xs">{isEn ? 'Probability' : 'Probabilité'}</div>
              <div className="text-white font-bold">{hand.probability}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-gray-500 text-xs">{isEn ? 'Frequency' : 'Fréquence'}</div>
              <div className="text-white font-bold text-xs">{hand.frequency}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </ModuleLayout>
  );
}

// ── MODULE: POSITIONS ─────────────────────────────────────────────────────────

function PositionsModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [selected, setSelected] = useState(0);
  const pos = POSITIONS[selected];

  const colorMap = { bad: '#e74c3c', neutral: '#f39c12', good: '#3498db', best: '#27ae60' };
  const labelMap = isEn
    ? { bad: 'Poor', neutral: 'Neutral', good: 'Good', best: 'Excellent' }
    : { bad: 'Mauvaise', neutral: 'Neutre', good: 'Bonne', best: 'Excellente' };

  return (
    <ModuleLayout title={isEn ? 'Positions' : 'Les Positions'} icon="📍" color="#27ae60" onBack={onBack} step={0} totalSteps={1} onComplete={onComplete} onNext={onComplete} onPrev={onBack} isLastStep quizKey="debutant-positions">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'Positions at the Table' : 'Les Positions à la Table'}</h2>
      <p className="text-gray-400 text-sm mb-4">{isEn ? 'Your position determines when you act. Later = better.' : 'Votre position détermine quand vous agissez. Plus tard = mieux.'}</p>

      <div className="relative w-full h-40 mb-6 felt-bg rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="absolute inset-4 rounded-2xl border-2 border-white/20 flex items-center justify-center">
          <span className="text-white/40 text-sm">TABLE</span>
        </div>
        {POSITIONS.map((p, i) => {
          const angle = (i / POSITIONS.length) * 2 * Math.PI - Math.PI / 2;
          const x = 50 + 42 * Math.cos(angle);
          const y = 50 + 38 * Math.sin(angle);
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${selected === i ? 'scale-125 z-10' : 'scale-100'}`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                selected === i ? 'border-green-400 bg-green-700' : 'border-white/30 bg-black/50'
              }`} style={{ color: selected === i ? '#fff' : colorMap[pos.advantage] }}>
                {p.abbr}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={selected} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-5 rounded-2xl border bg-white/5" style={{ borderColor: colorMap[pos.advantage] + '50' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: colorMap[pos.advantage] + '30', color: colorMap[pos.advantage] }}>
              {pos.abbr}
            </div>
            <div>
              <h3 className="font-bold text-white">{pos.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: colorMap[pos.advantage] + '20', color: colorMap[pos.advantage] }}>
                {isEn ? '' : 'Position '}{labelMap[pos.advantage]}{isEn ? ' position' : ''}
              </span>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-3">{pos.description}</p>
          <div className="bg-black/30 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">{isEn ? 'Recommended strategy' : 'Stratégie recommandée'}</div>
            <p className="text-white text-sm">{pos.strategy}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </ModuleLayout>
  );
}

// ── MODULE: ACTIONS ───────────────────────────────────────────────────────────

function ActionsModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [step, setStep] = useState(0);

  const actions = isEn
    ? [
      {
        name: 'Fold', color: '#e74c3c', icon: '🗑️',
        description: 'Discard your hand. You only lose what you\'ve already bet. Use this when your hand is weak or conditions are unfavorable.',
        when: 'When your hand is weak, pot odds are unfavorable, or you face a big raise you can\'t justify calling.',
        mistake: 'Folding too rarely (calling station) or too often (too tight).',
      },
      {
        name: 'Check', color: '#3498db', icon: '✋',
        description: 'Pass without betting. Only possible if nobody has bet yet in the current round. Gives you a free card.',
        when: 'When your hand is medium and you want to see the next card for free, or to control the pot.',
        mistake: 'Checking too often with strong hands (excessive slow play).',
      },
      {
        name: 'Call', color: '#f39c12', icon: '👍',
        description: 'Match the opponent\'s bet. You stay in the hand by paying the required amount. Neither aggressive nor passive.',
        when: 'When you have enough equity to justify the call according to pot odds.',
        mistake: 'Calling too often with weak hands = calling station.',
      },
      {
        name: 'Bet', color: '#27ae60', icon: '💰',
        description: 'Place the first bet in a betting round. A proactive action that builds the pot and can force opponents to fold.',
        when: 'For value (you have a good hand) or to bluff (represent a good hand).',
        mistake: 'Betting inconsistent sizes that reveal the strength of your hand.',
      },
      {
        name: 'Raise', color: '#8e44ad', icon: '🚀',
        description: 'Increase a player\'s existing bet. Shows strength and builds the pot. The most powerful action.',
        when: 'With a very strong hand (value), or as a semi-bluff with strong draws.',
        mistake: 'Raising too small (min-raise) or too large without a reason.',
      },
      {
        name: 'All-In', color: '#c9a84c', icon: '👑',
        description: 'Bet all your chips at once. Terminal action: you can\'t act again. Can serve as ultimate value or extreme bluff.',
        when: 'When you have the nuts (best possible hand), for protection against draws, or as a calculated bluff.',
        mistake: 'Going all-in too often or with marginal hands without analysis.',
      },
    ]
    : [
      {
        name: 'Fold (Se coucher)', color: '#e74c3c', icon: '🗑️',
        description: 'Abandonner sa main. Vous perdez uniquement ce que vous avez déjà misé. À utiliser quand votre main est faible ou que les conditions sont défavorables.',
        when: 'Quand votre main est faible, les pot odds défavorables, ou face à une grosse relance que vous ne pouvez pas justifier.',
        mistake: 'Se coucher trop peu (calling station) ou trop souvent (trop serré).',
      },
      {
        name: 'Check (Checker)', color: '#3498db', icon: '✋',
        description: 'Passer la main sans miser. Uniquement possible si personne n\'a encore misé dans le tour actuel. Ça vous donne une carte gratuite.',
        when: 'Quand votre main est moyenne et vous voulez voir la suite gratuitement, ou pour contrôler le pot.',
        mistake: 'Checker trop souvent avec de bonnes mains (slow play excessif).',
      },
      {
        name: 'Call (Suivre)', color: '#f39c12', icon: '👍',
        description: 'Égaler la mise de l\'adversaire. Vous restez dans la main en payant le montant requis. Ni agressif ni passif.',
        when: 'Quand vous avez assez d\'équité pour justifier le call selon les pot odds.',
        mistake: 'Caller trop souvent avec des mains faibles = calling station.',
      },
      {
        name: 'Bet (Miser)', color: '#27ae60', icon: '💰',
        description: 'Placer la première mise dans un tour d\'enchères. C\'est une action proactive qui construit le pot et peut forcer les adversaires à fold.',
        when: 'Pour value (vous avez une bonne main) ou pour bluffer (représenter une bonne main).',
        mistake: 'Miser des montants incohérents qui révèlent la force de votre main.',
      },
      {
        name: 'Raise (Relancer)', color: '#8e44ad', icon: '🚀',
        description: 'Augmenter la mise d\'un joueur qui a déjà bet. Montre de la force et construit le pot. C\'est l\'action la plus puissante.',
        when: 'Avec une très bonne main (value), ou comme semi-bluff avec des draws forts.',
        mistake: 'Relancer des montants trop petits (min-raise) ou trop gros sans raison.',
      },
      {
        name: 'All-In', color: '#c9a84c', icon: '👑',
        description: 'Miser tous vos jetons d\'un coup. Action terminale : vous ne pouvez plus agir. Peut servir comme value ultime ou bluff extrême.',
        when: 'Quand vous avez la nuts (meilleure main possible), en protection contre les draws, ou comme bluff calculé.',
        mistake: 'All-in trop souvent ou avec des mains marginales sans analyse.',
      },
    ];

  const a = actions[step];

  return (
    <ModuleLayout title={isEn ? 'Actions' : 'Les Actions'} icon="⚡" color="#27ae60" onBack={onBack} step={step} totalSteps={actions.length} onComplete={onComplete} onNext={() => step < actions.length - 1 ? setStep(s => s + 1) : onComplete()} onPrev={() => step > 0 ? setStep(s => s - 1) : onBack()} isLastStep={step === actions.length - 1} quizKey="debutant-actions">
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{a.icon}</span>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)', color: a.color }}>{a.name}</h2>
          </div>

          <p className="text-gray-300 leading-relaxed">{a.description}</p>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-gray-500 mb-1">{isEn ? '✅ When to use it' : '✅ Quand l\'utiliser'}</div>
            <p className="text-gray-300 text-sm">{a.when}</p>
          </div>

          <div className="p-4 rounded-xl bg-red-900/20 border border-red-800/30">
            <div className="text-xs text-gray-500 mb-1">{isEn ? '⚠️ Common mistake' : '⚠️ Erreur fréquente'}</div>
            <p className="text-gray-300 text-sm">{a.mistake}</p>
          </div>

          <div className="flex gap-1.5">
            {actions.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} className={`flex-1 h-1.5 rounded-full transition-colors ${i === step ? 'bg-green-400' : i < step ? 'bg-green-700' : 'bg-gray-700'}`} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </ModuleLayout>
  );
}

// ── MODULE: SELECTION ─────────────────────────────────────────────────────────

function SelectionModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';

  const groups = isEn
    ? [
      { category: 'Premium Hands', color: '#c9a84c', bg: 'bg-yellow-900/20 border-yellow-600/30', hands: ['AA', 'KK', 'QQ', 'JJ', 'AKs'], action: 'Always raise, rarely limp', advice: 'These hands are so strong they deserve to build a big pot from the start.' },
      { category: 'Strong Hands', color: '#27ae60', bg: 'bg-green-900/20 border-green-600/30', hands: ['TT', 'AQs', 'AKo', '99', 'AJs'], action: 'Generally raise', advice: 'Good hands: play them aggressively but be cautious facing re-raises.' },
      { category: 'Playable Hands', color: '#3498db', bg: 'bg-blue-900/20 border-blue-600/30', hands: ['88', 'KQs', 'AQo', 'JTs', 'KJs'], action: 'Raise in position, careful OOP', advice: 'These hands are good in position. Be more careful when acting first.' },
      { category: 'Avoid as a beginner', color: '#e74c3c', bg: 'bg-red-900/20 border-red-600/30', hands: ['72o', '93o', '84o', '52o'], action: 'Generally fold', advice: 'These hands rarely win and play poorly postflop. Except BB defense, avoid them.' },
    ]
    : [
      { category: 'Mains Premium', color: '#c9a84c', bg: 'bg-yellow-900/20 border-yellow-600/30', hands: ['AA', 'KK', 'QQ', 'JJ', 'AKs'], action: 'Toujours relancer, rarement limper', advice: 'Ces mains sont si fortes qu\'elles méritent de construire un gros pot dès le départ.' },
      { category: 'Mains Fortes', color: '#27ae60', bg: 'bg-green-900/20 border-green-600/30', hands: ['TT', 'AQs', 'AKo', '99', 'AJs'], action: 'Relancer en général', advice: 'Bonnes mains, jouez-les agressivement mais soyez prudent face aux re-raises.' },
      { category: 'Mains Jouables', color: '#3498db', bg: 'bg-blue-900/20 border-blue-600/30', hands: ['88', 'KQs', 'AQo', 'JTs', 'KJs'], action: 'Relancer en position, attention OOP', advice: 'Ces mains sont bonnes en position. Soyez plus prudent quand vous agissez en premier.' },
      { category: 'À éviter en début', color: '#e74c3c', bg: 'bg-red-900/20 border-red-600/30', hands: ['72o', '93o', '84o', '52o'], action: 'Généralement folder', advice: 'Ces mains gagnent rarement et jouent mal post-flop. Sauf en défense de BB, évitez.' },
    ];

  return (
    <ModuleLayout title={isEn ? 'Hand Selection' : 'Sélection de mains'} icon="🎯" color="#27ae60" onBack={onBack} step={0} totalSteps={1} onComplete={onComplete} onNext={onComplete} onPrev={onBack} isLastStep quizKey="debutant-selection">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'Which Hands to Play?' : 'Quelles mains jouer ?'}</h2>
      <p className="text-gray-400 text-sm mb-4">{isEn ? 'As a beginner, adopt a tight (selective) and aggressive approach.' : 'En débutant, adoptez une approche serrée (sélective) et agressive.'}</p>

      <div className="space-y-3">
        {groups.map((group, i) => (
          <div key={i} className={`p-4 rounded-xl border ${group.bg}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold" style={{ color: group.color }}>{group.category}</h4>
              <span className="text-xs text-gray-500">{group.action}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {group.hands.map(h => (
                <span key={h} className="bg-black/40 px-2 py-0.5 rounded text-sm font-mono text-white border border-white/10">{h}</span>
              ))}
              {i < 2 && <span className="text-gray-500 text-sm">{isEn ? 'and more...' : 'et plus...'}</span>}
            </div>
            <p className="text-gray-400 text-xs">{group.advice}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-yellow-400 text-sm font-medium mb-1">💡 {isEn ? 'Beginner golden rule' : 'Règle d\'or du débutant'}</p>
        <p className="text-gray-300 text-sm">
          {isEn
            ? <>Play only <strong className="text-white">15-20% of your hands</strong>. Patience is the first skill to master. Every hand you correctly fold is a long-term profit.</>
            : <>Jouez entre <strong className="text-white">15-20% de vos mains</strong> seulement. La patience est la première compétence à maîtriser. Chaque main que vous foldez correctement est un profit à long terme.</>
          }
        </p>
      </div>
    </ModuleLayout>
  );
}

// ── MODULE: QUIZ ──────────────────────────────────────────────────────────────

function QuizModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const questions = QUIZ_QUESTIONS.filter(q => q.level === 'debutant');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correctIndex) setScore(s => s + 1);
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <ModuleLayout title={isEn ? 'Final Quiz' : 'Quiz Final'} icon="🏆" color="#27ae60" onBack={onBack} step={questions.length} totalSteps={questions.length} onComplete={onComplete} onNext={onComplete} onPrev={onBack} isLastStep>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">{score === questions.length ? '🏆' : score >= questions.length / 2 ? '🎯' : '📚'}</div>
          <h2 className="text-3xl font-bold text-white mb-2">{score}/{questions.length}</h2>
          <p className="text-gray-400 mb-6">
            {isEn
              ? (score === questions.length ? 'Perfect! You have mastered the fundamentals.' : score >= questions.length / 2 ? 'Well done! A few revisions and you\'ll be ready.' : 'Review the modules to consolidate your foundations.')
              : (score === questions.length ? 'Parfait ! Vous maîtrisez les fondamentaux.' : score >= questions.length / 2 ? 'Bien joué ! Quelques révisions et vous serez prêt.' : 'Repassez les modules pour consolider vos bases.')
            }
          </p>
          <div className="w-32 h-32 mx-auto rounded-full border-4 border-green-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-green-400">{Math.round((score / questions.length) * 100)}%</span>
          </div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout title={isEn ? 'Final Quiz' : 'Quiz Final'} icon="🏆" color="#27ae60" onBack={onBack} step={current} totalSteps={questions.length} onComplete={onComplete} onNext={next} onPrev={() => { setCurrent(c => c - 1); setSelected(null); }} isLastStep={current === questions.length - 1 && selected !== null}>
      <div className="mb-2 text-sm text-gray-500">{isEn ? 'Question' : 'Question'} {current + 1}/{questions.length}</div>
      <h2 className="text-lg font-bold text-white mb-6">{q.question}</h2>

      <div className="space-y-3 mb-6">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex;
          const isSelected = i === selected;
          let cls = 'border-white/10 bg-white/5 hover:border-white/20';
          if (selected !== null) {
            if (isCorrect) cls = 'border-green-500 bg-green-900/30';
            else if (isSelected) cls = 'border-red-500 bg-red-900/30';
          }
          return (
            <button key={i} onClick={() => handleAnswer(i)} className={`w-full text-left p-4 rounded-xl border transition-all ${cls}`}>
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold ${selected !== null && isCorrect ? 'border-green-400 text-green-400' : selected !== null && isSelected ? 'border-red-400 text-red-400' : 'border-gray-600 text-gray-400'}`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-gray-300">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl border ${selected === q.correctIndex ? 'bg-green-900/20 border-green-600/30' : 'bg-red-900/20 border-red-600/30'}`}>
          <div className="text-sm font-medium mb-1" style={{ color: selected === q.correctIndex ? '#2ecc71' : '#e74c3c' }}>
            {selected === q.correctIndex ? (isEn ? '✅ Correct!' : '✅ Correct !') : (isEn ? '❌ Incorrect' : '❌ Incorrect')}
          </div>
          <p className="text-gray-300 text-sm">{q.explanation}</p>
        </motion.div>
      )}
    </ModuleLayout>
  );
}

// ── MODULE: TRAINER ───────────────────────────────────────────────────────────

function TrainerModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  return (
    <ModuleLayout title={isEn ? 'Play Hands' : 'Jouer des mains'} icon="🎮" color="#27ae60" onBack={onBack} step={0} totalSteps={1} onComplete={onComplete} onNext={onComplete} onPrev={onBack} isLastStep>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'Put it into practice!' : 'Mettez en pratique !'}</h2>
      <p className="text-gray-400 text-sm mb-5">
        {isEn ? 'Analyze these real situations. For each hand, choose the best action and find out why.' : 'Analysez ces situations réelles. Pour chaque main, choisissez la meilleure action et découvrez pourquoi.'}
      </p>
      <InteractiveHandTrainer />
    </ModuleLayout>
  );
}

// ── MODULE LAYOUT ─────────────────────────────────────────────────────────────

function ModuleLayout({
  children, title, icon, color, onBack, step, totalSteps, onComplete, onNext, onPrev, isLastStep, quizKey,
}: {
  children: React.ReactNode; title: string; icon: string; color: string;
  onBack: () => void; step: number; totalSteps: number; onComplete: () => void;
  onNext: () => void; onPrev: () => void; isLastStep?: boolean; quizKey?: string;
}) {
  const locale = useLocale();
  const isEn = locale === 'en';

  return (
    <div className="min-h-screen bg-[#060d08]">
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">
              <ChevronLeft size={16} /> {isEn ? 'Back to modules' : 'Retour aux modules'}
            </button>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">{icon}</span>
              <h1 className="text-xl font-bold" style={{ color }}>{title}</h1>
              <div className="ml-auto text-sm text-gray-500">{step + 1}/{totalSteps}</div>
            </div>

            <div className="h-1 bg-gray-800 rounded-full mb-8">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((step + 1) / totalSteps) * 100}%`, background: color }} />
            </div>

            <div className="bg-[#0a1410] border border-white/10 rounded-2xl p-6 min-h-[400px]">
              {children}
              {isLastStep && quizKey && <InlineQuiz moduleKey={quizKey} />}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={onPrev} className="flex items-center gap-1 px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all">
                <ChevronLeft size={16} /> {isEn ? 'Previous' : 'Précédent'}
              </button>
              <button
                onClick={onNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all"
                style={{ background: isLastStep ? '#c9a84c' : color }}
              >
                {isLastStep ? (isEn ? '✓ Complete module' : '✓ Terminer le module') : (isEn ? 'Next' : 'Suivant')}
                {!isLastStep && <ChevronRight size={18} />}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
