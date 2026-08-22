'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { MultiHandPlayer } from '@/components/HandPlayer';
import { XpToast } from '@/components/XpToast';
import { ALL_HAND_SCRIPTS } from '@/lib/hand-scripts';
import { QUIZ_QUESTIONS } from '@/lib/poker-data';
import InlineQuiz from '@/components/InlineQuiz';
import { useProgress } from '@/hooks/useProgress';
import { useLocale } from 'next-intl';

const MODULES_FR = [
  { id: 'solvers', title: 'Raisonnement Solver', icon: '🤖', desc: 'Raisonner comme un GTO solver' },
  { id: 'balanced', title: 'Ranges Balancées', icon: '⚖️', desc: 'Construire des ranges parfaitement équilibrées' },
  { id: 'exploitation', title: 'Exploitation Avancée', icon: '🎯', desc: 'Exploiter les tendances adverses' },
  { id: 'hud', title: 'HUD & Stats', icon: '📊', desc: 'Lire et utiliser les statistiques' },
  { id: 'mental', title: 'Jeu Mental', icon: '🧠', desc: 'Psychologie et gestion du tilt' },
  { id: 'selection', title: 'Sélection de Table', icon: '🪑', desc: 'Choisir les meilleures tables' },
  { id: 'study', title: "Routines d'Étude", icon: '📚', desc: 'Comment progresser efficacement' },
  { id: 'main-guidee', title: 'Main Guidée', icon: '🃏', desc: 'Naviguez un set sur board connecté' },
  { id: 'quiz', title: 'Quiz Expert', icon: '👑', desc: 'Le test ultime' },
];

const MODULES_EN = [
  { id: 'solvers', title: 'Solver Thinking', icon: '🤖', desc: 'Reason like a GTO solver' },
  { id: 'balanced', title: 'Balanced Ranges', icon: '⚖️', desc: 'Build perfectly balanced ranges' },
  { id: 'exploitation', title: 'Advanced Exploitation', icon: '🎯', desc: 'Exploit opponent tendencies' },
  { id: 'hud', title: 'HUD & Stats', icon: '📊', desc: 'Read and use statistics' },
  { id: 'mental', title: 'Mental Game', icon: '🧠', desc: 'Psychology and tilt management' },
  { id: 'selection', title: 'Table Selection', icon: '🪑', desc: 'Choose the best tables' },
  { id: 'study', title: 'Study Routines', icon: '📚', desc: 'How to improve efficiently' },
  { id: 'main-guidee', title: 'Guided Hand', icon: '🃏', desc: 'Navigate a set on a connected board' },
  { id: 'quiz', title: 'Expert Quiz', icon: '👑', desc: 'The ultimate test' },
];

export default function ExpertPage() {
  const locale = useLocale();
  const isEn = locale === 'en';
  const MODULES = isEn ? MODULES_EN : MODULES_FR;

  const [activeModule, setActiveModule] = useState<string | null>(null);
  const { progress, completeModule, completeLevel, addXp } = useProgress();
  const [xpToast, setXpToast] = useState<number | null>(null);
  const isDone = (modId: string) => !!progress.completedModules[`expert-${modId}`];
  const completedCount = MODULES.filter(m => isDone(m.id)).length;
  const complete = (id: string, xp = 50) => {
    completeModule(`expert-${id}`);
    addXp(xp);
    setXpToast(xp);
    if (MODULES.every(m => m.id === id || isDone(m.id))) completeLevel('expert');
    setActiveModule(null);
  };
  const progressPct = (completedCount / MODULES.length) * 100;

  if (activeModule) {
    const props = { onComplete: () => complete(activeModule), onBack: () => setActiveModule(null) };
    if (activeModule === 'solvers') return <SolversModule {...props} />;
    if (activeModule === 'balanced') return <BalancedModule {...props} />;
    if (activeModule === 'exploitation') return <ExploitationModule {...props} />;
    if (activeModule === 'hud') return <HUDModule {...props} />;
    if (activeModule === 'mental') return <MentalModule {...props} />;
    if (activeModule === 'selection') return <TableSelectionModule {...props} />;
    if (activeModule === 'study') return <StudyModule {...props} />;
    if (activeModule === 'main-guidee') return (
      <div className="min-h-screen bg-[#060d08]">
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setActiveModule(null)} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">
              <ChevronLeft size={16} /> {isEn ? 'Back to modules' : 'Retour aux modules'}
            </button>
            <MultiHandPlayer scripts={ALL_HAND_SCRIPTS['expert']} onComplete={(score) => complete(activeModule, 50 + (score >= 4 ? 150 : score >= 3 ? 100 : score >= 2 ? 50 : 0))} onBack={() => setActiveModule(null)} />
          </div>
        </div>
      </div>
    );
    if (activeModule === 'quiz') return <ExpertQuizModule {...props} />;
  }

  return (
    <div className="min-h-screen bg-[#060d08]">
      <AnimatePresence>{xpToast !== null && <XpToast amount={xpToast} onDone={() => setXpToast(null)} />}</AnimatePresence>
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <Link href="/" className="text-yellow-400 text-sm flex items-center gap-1 mb-4 hover:text-yellow-300">
              <ChevronLeft size={16} /> {isEn ? 'Home' : 'Accueil'}
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⚡</span>
              <div>
                <p className="text-yellow-400 text-sm font-medium">{isEn ? 'Level 4' : 'Niveau 4'}</p>
                <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Expert</h1>
              </div>
            </div>
            <p className="text-gray-400 mt-2">{isEn ? 'The pinnacle of mastery. Complete this to unlock the Professional level.' : 'Le summum de la maîtrise. Terminez pour débloquer le niveau Professionnel.'}</p>

            <div className="mt-4 p-3 rounded-xl bg-yellow-900/20 border border-yellow-600/30 text-sm">
              <span className="text-yellow-400">🏆 {isEn ? 'Reward:' : 'Récompense :'}</span>
              <span className="text-gray-300 ml-2">{isEn ? 'Completing this level unlocks the Professional level with legendary hands.' : 'Terminer ce niveau débloque le niveau Professionnel avec les mains légendaires.'}</span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{completedCount}/{MODULES.length} {isEn ? 'modules' : 'modules'}</span>
                <span>{Math.round(progressPct)}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #92400e, #d97706, #fbbf24)' }} initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODULES.map((mod, i) => {
              const done = isDone(mod.id);
              const locked = i > 0 && !isDone(MODULES[i - 1].id);
              return (
                <motion.button key={mod.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  onClick={() => !locked && setActiveModule(mod.id)}
                  className={`text-left p-5 rounded-2xl border transition-all ${done ? 'border-yellow-500/50 bg-yellow-900/20' : locked ? 'border-gray-800 bg-gray-900/30 opacity-50 cursor-not-allowed' : 'border-yellow-600/30 bg-yellow-900/10 hover:border-yellow-500/60 cursor-pointer'}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{mod.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-yellow-400">Module {i + 1}</span>
                        {done && <CheckCircle size={16} className="text-yellow-400" />}
                      </div>
                      <h3 className="font-bold text-white">{mod.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">{mod.desc}</p>
                  {!locked && !done && <div className="flex items-center gap-1 text-yellow-400 text-sm mt-2"><span>{isEn ? 'Start' : 'Commencer'}</span><ArrowRight size={14} /></div>}
                  {locked && <p className="text-gray-600 text-sm mt-1">🔒 {isEn ? 'Previous module required' : 'Module précédent requis'}</p>}
                </motion.button>
              );
            })}
          </div>

          {completedCount === MODULES.length && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 rounded-2xl border border-red-500/40 bg-red-900/20 text-center">
              <div className="text-5xl mb-3">👑</div>
              <h3 className="text-2xl font-bold text-white mb-2">{isEn ? 'Expert level completed!' : 'Niveau Expert complété !'}</h3>
              <p className="text-yellow-400 font-medium mb-1">{isEn ? 'You have unlocked the Professional level!' : 'Vous avez débloqué le niveau Professionnel !'}</p>
              <p className="text-gray-400 mb-5">{isEn ? 'Access legendary hands, champion strategies, and the secrets of the highest level.' : 'Accédez aux mains légendaires, aux stratégies des champions et aux secrets du plus haut niveau.'}</p>
              <Link href="/professionnel" className="inline-flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
                {isEn ? 'Enter Professional Level 👑' : 'Entrer au niveau Professionnel 👑'} <ChevronRight size={20} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExpertModuleLayout({ children, title, icon, onBack, onComplete, quizKey }: { children: React.ReactNode; title: string; icon: string; onBack: () => void; onComplete: () => void; quizKey?: string; }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  return (
    <div className="min-h-screen bg-[#060d08]">
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6">
              <ChevronLeft size={16} /> {isEn ? 'Back' : 'Retour'}
            </button>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">{icon}</span>
              <h1 className="text-xl font-bold text-yellow-400">{title}</h1>
            </div>
            <div className="bg-[#0d0e08] border border-yellow-900/30 rounded-2xl p-6 min-h-[400px] mb-4">
              {children}
              {quizKey && <InlineQuiz moduleKey={quizKey} />}
            </div>
            <button onClick={onComplete} className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 transition-all">{isEn ? '✓ Module complete' : '✓ Module terminé'}</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SolversModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const items = isEn
    ? [
      { title: 'Solvers calculate Nash Equilibrium', detail: 'For each situation, the solver finds the strategy that maximizes gain against any opponent strategy. That\'s perfect GTO.', icon: '🔢' },
      { title: 'Every decision has a frequency', detail: 'The solver doesn\'t say "always bet" but "bet 67% of the time, check 33%". This randomization makes you unpredictable.', icon: '🎲' },
      { title: 'Context changes everything', detail: 'The same hand can be a value check-raise and a bluff lead depending on board texture and ranges in play.', icon: '🌍' },
      { title: 'Learn nodes, not solutions', detail: 'Memorizing all solutions is impossible. Understand the principles: polarization, sizing, range advantage.', icon: '🌳' },
    ]
    : [
      { title: 'Les solvers calculent le Nash Equilibrium', detail: 'Pour chaque situation, le solver trouve la stratégie qui maximise le gain contre toute stratégie adverse. C\'est le GTO parfait.', icon: '🔢' },
      { title: 'Chaque décision a une fréquence', detail: 'Le solver ne dit pas "toujours bet" mais "bet 67% du temps, check 33%". Cette randomisation vous rend imprévisible.', icon: '🎲' },
      { title: 'Le contexte change tout', detail: 'Une même main peut être value-bet en check-raise et bluff en lead selon la texture du board et les ranges en jeu.', icon: '🌍' },
      { title: 'Apprenez les nœuds, pas les solutions', detail: 'Il est impossible de mémoriser toutes les solutions. Comprenez les principes : polarisation, sizing, range advantage.', icon: '🌳' },
    ];

  return (
    <ExpertModuleLayout title={isEn ? 'Solver Thinking' : 'Raisonnement Solver'} icon="🤖" onBack={onBack} onComplete={onComplete} quizKey="expert-solvers">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'Thinking Like a Solver' : 'Raisonner comme un Solver'}</h2>
      <p className="text-gray-400 text-sm mb-5">{isEn ? 'Solvers (PioSOLVER, GTO+) have revolutionized modern poker. Understanding their logic puts you at a different level.' : 'Les solvers (PioSOLVER, GTO+) ont révolutionné le poker moderne. Comprendre leur logique vous place à un niveau différent.'}</p>

      <div className="space-y-3 mb-5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xl shrink-0">{item.icon}</span>
            <div>
              <div className="text-yellow-300 font-medium text-sm mb-0.5">{item.title}</div>
              <div className="text-gray-400 text-xs">{item.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-600/30">
        <p className="text-yellow-400 font-medium text-sm mb-2">🤖 {isEn ? 'Recommended tools' : 'Outils recommandés'}</p>
        <div className="space-y-1 text-sm">
          <div className="text-gray-300">PioSOLVER: {isEn ? 'industry standard for pros' : 'standard de l\'industrie pour les pros'}</div>
          <div className="text-gray-300">GTO+: {isEn ? 'more affordable, very powerful' : 'plus abordable, très puissant'}</div>
          <div className="text-gray-300">Simple GTO Trainer: {isEn ? 'to practice GTO spots' : 'pour pratiquer les spots GTO'}</div>
          <div className="text-gray-300">Poker Snowie: {isEn ? 'accessible AI for advanced beginners' : 'IA accessible pour débutants avancés'}</div>
        </div>
      </div>
    </ExpertModuleLayout>
  );
}

function BalancedModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const spots = isEn
    ? [
      { spot: 'River value betting', balance: 'For every 2 value bets, include 1 bluff of the same sizing', example: 'Set = value, A-high flush blocker = bluff' },
      { spot: 'Pre-flop 3-betting', balance: '~2/3 value (QQ+, AKs) + 1/3 bluffs (A5s, A4s, K5s)', example: 'Ratio that makes you non-foldable and non-exploitable' },
      { spot: 'Flop check-raising', balance: 'Mix top set, flush draws, OESD with bottom pair bluffs', example: 'Always include both extremes' },
      { spot: 'Donk betting', balance: 'Rare in GTO, reserved for very specific situations', example: 'Paired boards where you have trips and the opponent doesn\'t' },
    ]
    : [
      { spot: 'River value betting', balance: 'Pour chaque 2 value bets, incluez 1 bluff de même sizing', example: 'Set = value, A-high flush blocker = bluff' },
      { spot: '3-betting pre-flop', balance: '~2/3 value (QQ+, AKs) + 1/3 bluffs (A5s, A4s, K5s)', example: 'Ratio qui vous rend non-foldable et non-exploitable' },
      { spot: 'Check-raising flop', balance: 'Mixes top set, flush draws, OESD avec bottom pair bluffs', example: 'Incluez toujours les 2 pôles extrêmes' },
      { spot: 'Donk betting', balance: 'Rare en GTO, réservé à des situations très spécifiques', example: 'Paired boards où vous avez trips et l\'adversaire non' },
    ];

  return (
    <ExpertModuleLayout title={isEn ? 'Balanced Ranges' : 'Ranges Balancées'} icon="⚖️" onBack={onBack} onComplete={onComplete} quizKey="expert-balanced">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'Building Perfect Ranges' : 'Construire des Ranges Parfaites'}</h2>
      <p className="text-gray-400 text-sm mb-5">{isEn ? <>A balanced range is <strong className="text-white">unexploitable</strong>. It contains the right value/bluff ratio for each sizing.</> : <>Une range balancée est <strong className="text-white">non-exploitable</strong>. Elle contient le bon ratio value/bluff pour chaque sizing.</>}</p>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-5">
        <p className="text-yellow-300 font-medium mb-2">{isEn ? 'The alpha rule' : 'La règle alpha'}</p>
        <p className="text-gray-300 text-sm">{isEn ? 'The optimal bluff/value ratio depends on bet size:' : 'Le ratio optimal bluff/value dépend de la taille de mise :'}</p>
        <div className="mt-2 space-y-1 font-mono text-sm">
          <div className="flex justify-between"><span className="text-gray-400">1/3 pot</span><span className="text-white">1 {isEn ? 'bluff' : 'bluff'} : 2 {isEn ? 'value' : 'value'}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">1/2 pot</span><span className="text-white">1 bluff : 2 value</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Pot</span><span className="text-white">1 bluff : 2 value</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Overbet (2x)</span><span className="text-white">1 bluff : 1.3 value</span></div>
        </div>
      </div>

      <div className="space-y-3">
        {spots.map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-yellow-300 text-xs font-medium mb-1">{item.spot}</div>
            <div className="text-white text-sm mb-0.5">{item.balance}</div>
            <div className="text-gray-500 text-xs">{item.example}</div>
          </div>
        ))}
      </div>
    </ExpertModuleLayout>
  );
}

function ExploitationModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const flaws = isEn
    ? [
      { flaw: 'Folds too often to bets', color: '#27ae60', bg: 'bg-green-900/20 border-green-600/30', exploit: 'Drastically increase your bluff frequency. Bet/bet/bet on all streets.', example: 'If fold to flop bet > 65% → C-bet 100% of your range' },
      { flaw: 'Calls too often (calling station)', color: '#e74c3c', bg: 'bg-red-900/20 border-red-600/30', exploit: 'Cut all bluffs. Value-bet thin with marginal hands.', example: 'Middle pair becomes a value-bet 3 streets if the opponent never folds' },
      { flaw: '3-bets too often / too rarely', color: '#3498db', bg: 'bg-blue-900/20 border-blue-600/30', exploit: '3-bet too often → 4-bet-call range. 3-bet too little → fold defend less, steal more.', example: '3-bet% > 12% → your 4-bet range widens' },
      { flaw: 'Never bluffs / always bluffs', color: '#8e44ad', bg: 'bg-purple-900/20 border-purple-600/30', exploit: 'Never bluffs → fold your bluff-catchers vs bets. Always bluffs → call-down with everything.', example: 'Identify tendencies over 100+ hands' },
      { flaw: 'Overlimps / limps too much', color: '#c9a84c', bg: 'bg-yellow-900/20 border-yellow-600/30', exploit: 'Iso-raise large with your good hands to play HU in position.', example: 'Facing a limp, raise 4-5x BB with your broadways and medium pairs' },
    ]
    : [
      { flaw: 'Fold trop souvent face aux bets', color: '#27ae60', bg: 'bg-green-900/20 border-green-600/30', exploit: 'Augmentez votre fréquence de bluff drastiquement. Bet/bet/bet sur toutes les streets.', example: 'Si fold to flop bet > 65% → C-bet 100% de votre range' },
      { flaw: 'Call trop souvent (calling station)', color: '#e74c3c', bg: 'bg-red-900/20 border-red-600/30', exploit: 'Coupez tous les bluffs. Value-bet thin avec des mains marginales.', example: 'Middle pair devient value-bet 3 streets si l\'adversaire ne fold jamais' },
      { flaw: '3-bet trop souvent / trop rarement', color: '#3498db', bg: 'bg-blue-900/20 border-blue-600/30', exploit: '3-bet trop souvent → 4-bet-call range. 3-bet trop peu → fold defend moins, steal plus.', example: '3-bet% > 12% → votre 4-bet range s\'élargit' },
      { flaw: 'Ne bluff jamais / bluff toujours', color: '#8e44ad', bg: 'bg-purple-900/20 border-purple-600/30', exploit: 'Ne bluff jamais → foldez vos bluff-catchers en face de bets. Bluff toujours → call-down avec tout.', example: 'Identifiez les tendances sur 100+ mains' },
      { flaw: 'Overlimp / limpe trop', color: '#c9a84c', bg: 'bg-yellow-900/20 border-yellow-600/30', exploit: 'Iso-raise large avec vos bonnes mains pour jouer HU en position.', example: 'Face à un limp, raise 4-5x BB avec vos broadways et paires moyennes' },
    ];

  return (
    <ExpertModuleLayout title={isEn ? 'Advanced Exploitation' : 'Exploitation Avancée'} icon="🎯" onBack={onBack} onComplete={onComplete} quizKey="expert-exploitation">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'Exploiting Opponent Tendencies' : 'Exploiter les Tendances Adverses'}</h2>
      <p className="text-gray-400 text-sm mb-5">{isEn ? <>Against opponents with leaks, abandon GTO and <strong className="text-white">exploit to the maximum</strong>.</> : <>Contre des adversaires avec des failles, abandonnez le GTO et <strong className="text-white">exploitez au maximum</strong>.</>}</p>
      <div className="space-y-3">
        {flaws.map((item, i) => (
          <div key={i} className={`p-3 rounded-xl border ${item.bg}`}>
            <div className="text-sm font-medium mb-1" style={{ color: item.color }}>⚠️ {item.flaw}</div>
            <div className="text-white text-sm mb-0.5">→ {item.exploit}</div>
            <div className="text-gray-500 text-xs italic">{item.example}</div>
          </div>
        ))}
      </div>
    </ExpertModuleLayout>
  );
}

function HUDModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const stats = isEn
    ? [
      { stat: 'VPIP', full: 'Voluntarily Put Money In Pot', range: '15-25% = tight-aggressive', interpretation: 'Measures how often they play. >30% = loose, <15% = nit' },
      { stat: 'PFR', full: 'Pre-Flop Raise', range: '10-20% = ideal TAG', interpretation: 'How often they raise pre-flop. PFR/VPIP ratio = aggression' },
      { stat: '3-bet%', full: 'Three-Bet Percentage', range: '5-8% = balanced', interpretation: '<4% = too tight, >12% = too light. Adjust your defense accordingly' },
      { stat: 'Fold to C-bet', full: 'Fold to Continuation Bet', range: '45-55% = normal', interpretation: '>65% = bluff often. <40% = stop bluffing' },
      { stat: 'AF', full: 'Aggression Factor', range: '2-4 = TAG', interpretation: 'Ratio bets/raises vs calls. High = aggressive, low = passive/calling station' },
      { stat: 'W$SD', full: 'Won $ at Showdown', range: '50-55% = winning', interpretation: '<45% = too often at showdown with bad hands' },
      { stat: 'WtSD', full: 'Went to Showdown %', range: '25-30% = normal', interpretation: 'Too high = calling station, too low = folding river too often' },
    ]
    : [
      { stat: 'VPIP', full: 'Voluntarily Put Money In Pot', range: '15-25% = tight-aggressive', interpretation: 'Mesure combien souvent il joue. >30% = loose, <15% = nit' },
      { stat: 'PFR', full: 'Pre-Flop Raise', range: '10-20% = TAG idéal', interpretation: 'Combien souvent il relance pré-flop. PFR/VPIP ratio = agressivité' },
      { stat: '3-bet%', full: 'Three-Bet Percentage', range: '5-8% = équilibré', interpretation: '<4% = trop tight, >12% = trop light. Ajustez votre defense en conséquence' },
      { stat: 'Fold to C-bet', full: 'Fold to Continuation Bet', range: '45-55% = normal', interpretation: '>65% = bluffez souvent. <40% = arrêtez de bluffer' },
      { stat: 'AF', full: 'Aggression Factor', range: '2-4 = TAG', interpretation: 'Ratio bets/raises vs calls. Haut = agressif, bas = passif/calling station' },
      { stat: 'W$SD', full: 'Won $ at Showdown', range: '50-55% = gagnant', interpretation: '<45% = trop souvent au showdown avec mauvaises mains' },
      { stat: 'WtSD', full: 'Went to Showdown %', range: '25-30% = normal', interpretation: 'Trop haut = calling station, trop bas = fold trop souvent la rivière' },
    ];

  return (
    <ExpertModuleLayout title="HUD & Stats" icon="📊" onBack={onBack} onComplete={onComplete} quizKey="expert-hud">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'Reading Statistics' : 'Lire les Statistiques'}</h2>
      <p className="text-gray-400 text-sm mb-5">{isEn ? 'HUDs (Heads-Up Display) show opponent stats. Online, it\'s an essential tool at the high level.' : 'Les HUDs (Heads-Up Display) affichent les stats adverses. En ligne, c\'est un outil incontournable au haut niveau.'}</p>
      <div className="space-y-2">
        {stats.map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-700/30 px-2 py-0.5 rounded text-yellow-300 font-mono font-bold text-xs shrink-0">{item.stat}</div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-500 text-xs">{item.full}</div>
                <div className="text-white text-xs font-medium mt-0.5">Normal: {item.range}</div>
                <div className="text-gray-400 text-xs mt-0.5">{item.interpretation}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ExpertModuleLayout>
  );
}

function MentalModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const tiltTypes = isEn
    ? [
      { type: 'Anger tilt', trigger: 'Bad beat, suckout', response: 'Immediate break, breathe, walk' },
      { type: 'Frustration tilt', trigger: 'Series of bad results', response: 'Stop-loss session, review hands' },
      { type: 'Revenge tilt', trigger: 'Perceived disrespect', response: 'Playing against a specific opponent' },
      { type: 'Euphoria tilt', trigger: 'Big win', response: 'Overconfident, loose play' },
      { type: 'Despair tilt', trigger: 'Big downswing', response: 'Drop down in stakes, take a break' },
    ]
    : [
      { type: 'Tilt de colère', trigger: 'Bad beat, sucout', response: 'Pause immédiate, respiration, walk' },
      { type: 'Tilt de frustration', trigger: 'Série de mauvais résultats', response: 'Stop-loss session, review les mains' },
      { type: 'Tilt de vengeance', trigger: 'Manque de respect perçu', response: 'Jeu vs un adversaire spécifique' },
      { type: 'Tilt de euphorie', trigger: 'Grosse victoire', response: 'Trop confiant, jeu relâché' },
      { type: 'Tilt de désespoir', trigger: 'Gros downswing', response: 'Descendre de limites, break' },
    ];
  const tools = isEn
    ? [
      { tool: 'Daily stop-loss', detail: 'Set a maximum loss per session (e.g., 3 buy-ins). Beyond that, mandatory stop.' },
      { tool: 'Session review', detail: 'After each session, analyze your mistakes calmly, never right after a loss.' },
      { tool: 'Process vs result', detail: 'Evaluate your decisions on their quality, not the outcome. A correct fold is +EV even if the opponent was bluffing.' },
      { tool: 'Meditation and preparation', detail: 'Phil Ivey, Daniel Negreanu use preparation routines. Your mental state before the session is crucial.' },
    ]
    : [
      { tool: 'Stop-loss quotidien', detail: 'Définissez un maximum de pertes par session (ex: 3 buy-ins). Au-delà, stop obligatoire.' },
      { tool: 'Revue de session', detail: 'Après chaque session, analysez vos erreurs à tête reposée, jamais directement après une perte.' },
      { tool: 'Processus vs résultat', detail: 'Évaluez vos décisions sur leur qualité, pas sur le résultat. Un fold correct est +EV même si l\'adversaire avait les bluffs.' },
      { tool: 'Méditation et préparation', detail: 'Phil Ivey, Daniel Negreanu utilisent des routines de préparation. Votre état mental avant la session est crucial.' },
    ];

  return (
    <ExpertModuleLayout title={isEn ? 'Mental Game' : 'Jeu Mental'} icon="🧠" onBack={onBack} onComplete={onComplete} quizKey="expert-mental">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'The Champion\'s Mental Game' : 'Le Mental Game de Champion'}</h2>
      <p className="text-gray-400 text-sm mb-5">{isEn ? 'Tilt costs more than all technical mistakes combined. Master your mental game.' : 'Le tilt coûte plus cher que toutes les erreurs techniques réunies. Maîtrisez votre mental.'}</p>

      <div className="space-y-3 mb-5">
        <h3 className="font-bold text-white">{isEn ? 'Types of tilt' : 'Types de tilt'}</h3>
        {tiltTypes.map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-yellow-300 text-sm font-medium">{item.type}</div>
                <div className="text-gray-500 text-xs">Trigger: {item.trigger}</div>
              </div>
              <div className="text-green-400 text-xs text-right max-w-32">{item.response}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-white">{isEn ? 'Mental management tools' : 'Outils de gestion mentale'}</h3>
        {tools.map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-yellow-900/10 border border-yellow-800/30">
            <div className="text-white font-medium text-sm mb-0.5">{item.tool}</div>
            <div className="text-gray-400 text-xs">{item.detail}</div>
          </div>
        ))}
      </div>
    </ExpertModuleLayout>
  );
}

function TableSelectionModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const tips = isEn
    ? [
      { tip: 'Seat choice', detail: 'Sit to the left of fish (they act before you post-flop) and to the right of aggressors (you see their actions).' },
      { tip: 'Lobby observation', detail: 'Before joining a table, look at the average VPIP and pot sizes. Tables with big pots = action + fish.' },
      { tip: 'Don\'t be the fish', detail: 'If you don\'t know who the fish is after 30 min, it\'s you. Change tables without hesitation.' },
      { tip: 'Leave even a good table', detail: 'If the fish leave and only solid regs remain, get up. No ego here.' },
    ]
    : [
      { tip: 'Choix de place', detail: 'Asseyez-vous à gauche des fish (ils agissent avant vous post-flop) et à droite des agressifs (vous voyez leurs actions).' },
      { tip: 'Lobby observation', detail: 'Avant de rejoindre une table, observez le VPIP moyen et les pot sizes. Tables avec gros pots = action + fish.' },
      { tip: 'Ne soyez pas le fish', detail: 'Si vous ne savez pas qui est le fish à la table après 30 min, c\'est vous. Changez de table sans hésiter.' },
      { tip: 'Quitter la bonne table aussi', detail: 'Si les fish partent et ne restent que des regs solides, levez-vous. Pas d\'ego ici.' },
    ];

  return (
    <ExpertModuleLayout title={isEn ? 'Table Selection' : 'Sélection de Table'} icon="🪑" onBack={onBack} onComplete={onComplete} quizKey="expert-selection">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'Choosing the Best Tables' : 'Choisir les Meilleures Tables'}</h2>
      <p className="text-gray-400 text-sm mb-5">{isEn ? <>Table selection is often <strong className="text-white">more important than skill</strong>. Playing against fish is the key to profitability.</> : <>La sélection de table est souvent <strong className="text-white">plus importante que la compétence</strong>. Jouer contre des fish est la clé de la rentabilité.</>}</p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-green-900/20 border border-green-600/30">
          <h4 className="text-green-400 font-bold text-sm mb-2">{isEn ? 'Good table ✅' : 'Bonne table ✅'}</h4>
          <ul className="text-gray-400 text-xs space-y-1">
            <li>• {isEn ? 'Average VPIP > 28%' : 'VPIP moyen > 28%'}</li>
            <li>• {isEn ? 'Many limpers' : 'Beaucoup de limpers'}</li>
            <li>• {isEn ? 'Frequent multi-way pots' : 'Pots multi-way fréquents'}</li>
            <li>• {isEn ? 'Variable stack sizes' : 'Stack taille variable'}</li>
            <li>• {isEn ? 'You know the opponents' : 'Vous connaissez les adversaires'}</li>
          </ul>
        </div>
        <div className="p-3 rounded-xl bg-red-900/20 border border-red-600/30">
          <h4 className="text-red-400 font-bold text-sm mb-2">{isEn ? 'Bad table ❌' : 'Mauvaise table ❌'}</h4>
          <ul className="text-gray-400 text-xs space-y-1">
            <li>• {isEn ? 'Full of known regs' : 'Pleine de regs connus'}</li>
            <li>• {isEn ? 'Average VPIP < 18%' : 'VPIP moyen < 18%'}</li>
            <li>• {isEn ? 'Everyone folds/raises' : 'Tout le monde fold/raise'}</li>
            <li>• {isEn ? 'Heads-up pots only' : 'Pots heads-up seulement'}</li>
            <li>• {isEn ? 'You are the fish' : 'Vous êtes le fish'}</li>
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        {tips.map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-yellow-300 text-sm font-medium mb-0.5">{item.tip}</div>
            <div className="text-gray-400 text-xs">{item.detail}</div>
          </div>
        ))}
      </div>
    </ExpertModuleLayout>
  );
}

function StudyModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const phases = isEn
    ? [
      { phase: 'Session review (post-session)', time: '30-60 min', tasks: ['Export key hands to HH', 'Identify 2-3 difficult spots', 'Note your doubts and questions'], color: '#27ae60' },
      { phase: 'Solver work', time: '1-2h / week', tasks: ['Import difficult spots into PioSOLVER', 'Analyze key nodes', 'Memorize important frequencies'], color: '#3498db' },
      { phase: 'Range building', time: '30 min / week', tasks: ['Review pre-flop charts', 'Work on BB defenses', 'Practice 3-bet spots'], color: '#8e44ad' },
      { phase: 'Database analysis', time: '1h / week', tasks: ['Find your leaks in stats', 'Compare your stats to benchmarks', 'Identify unprofitable spots'], color: '#c9a84c' },
    ]
    : [
      { phase: 'Revue de session (post-session)', time: '30-60 min', tasks: ['Exportez les mains clés en HH', 'Identifiez 2-3 spots difficiles', 'Notez vos doutes et questions'], color: '#27ae60' },
      { phase: 'Travail au solver', time: '1-2h / semaine', tasks: ['Importez les spots difficiles dans PioSOLVER', 'Analysez les nodes clés', 'Mémorisez les fréquences importantes'], color: '#3498db' },
      { phase: 'Construction de range', time: '30 min / semaine', tasks: ['Révisez les charts pré-flop', 'Travaillez les défenses de BB', 'Pratiquez les spots 3-bet'], color: '#8e44ad' },
      { phase: 'Analyse de base de données', time: '1h / semaine', tasks: ['Cherchez vos leaks dans les stats', 'Comparez vos stats aux benchmarks', 'Identifiez les spots non-rentables'], color: '#c9a84c' },
    ];

  return (
    <ExpertModuleLayout title={isEn ? 'Study Routines' : "Routines d'Étude"} icon="📚" onBack={onBack} onComplete={onComplete} quizKey="expert-study">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'How to Improve' : 'Comment Progresser'}</h2>
      <p className="text-gray-400 text-sm mb-5">{isEn ? 'The best players spend as much time studying as playing. Here\'s how to structure your learning.' : "Les meilleurs joueurs passent autant de temps à étudier qu'à jouer. Voici comment structurer votre apprentissage."}</p>

      <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-600/30 mb-5">
        <p className="text-yellow-400 font-medium mb-2">{isEn ? 'The 50/50 rule' : 'La règle 50/50'}</p>
        <p className="text-gray-300 text-sm">{isEn ? 'For every hour of play, spend one hour studying. Elite pros sometimes study more than they play.' : 'Pour chaque heure de jeu, passez une heure à étudier. Les pros élites étudient parfois plus qu\'ils ne jouent.'}</p>
      </div>

      <div className="space-y-3">
        {phases.map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium" style={{ color: item.color }}>{item.phase}</h4>
              <span className="text-gray-500 text-xs">{item.time}</span>
            </div>
            <ul className="space-y-0.5">
              {item.tasks.map((t, j) => <li key={j} className="text-gray-400 text-xs flex items-start gap-1"><span className="shrink-0 mt-0.5">→</span>{t}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </ExpertModuleLayout>
  );
}

function ExpertQuizModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const questions = QUIZ_QUESTIONS.filter(q => q.level === 'expert');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!questions.length) return (
    <ExpertModuleLayout title={isEn ? 'Expert Quiz' : 'Quiz Expert'} icon="👑" onBack={onBack} onComplete={onComplete}>
      <div className="text-center py-12">
        <div className="text-5xl mb-4">⚡</div>
        <p className="text-gray-400">{isEn ? 'Expert quiz complete!' : 'Quiz Expert complété !'}</p>
        <button onClick={onComplete} className="mt-4 bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold">{isEn ? 'Complete ✓' : 'Terminer ✓'}</button>
      </div>
    </ExpertModuleLayout>
  );

  const q = questions[current];
  const handleAnswer = (i: number) => { if (selected !== null) return; setSelected(i); if (i === q.correctIndex) setScore(s => s + 1); };
  const next = () => { if (current < questions.length - 1) { setCurrent(c => c + 1); setSelected(null); } else setFinished(true); };

  return (
    <ExpertModuleLayout title={isEn ? 'Expert Quiz' : 'Quiz Expert'} icon="👑" onBack={onBack} onComplete={onComplete}>
      {finished ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">⚡</div>
          <h2 className="text-2xl font-bold text-white mb-2">{score}/{questions.length}</h2>
          <p className="text-gray-400 mb-4">{score === questions.length ? (isEn ? 'Perfect! You are at expert level.' : 'Parfait ! Vous êtes au niveau expert.') : (isEn ? 'Almost! Keep working.' : 'Presque ! Continuez à travailler.')}</p>
          <button onClick={onComplete} className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold">{isEn ? 'Complete level ✓' : 'Terminer le niveau ✓'}</button>
        </div>
      ) : (
        <div>
          <div className="text-sm text-gray-500 mb-3">{isEn ? 'Question' : 'Question'} {current + 1}/{questions.length}</div>
          <h2 className="text-base font-bold text-white mb-5">{q.question}</h2>
          <div className="space-y-3 mb-5">
            {q.options.map((opt, i) => {
              let cls = 'border-white/10 bg-white/5';
              if (selected !== null) cls = i === q.correctIndex ? 'border-green-500 bg-green-900/30' : i === selected ? 'border-red-500 bg-red-900/30' : 'border-white/5 opacity-50';
              return <button key={i} onClick={() => handleAnswer(i)} className={`w-full text-left p-3 rounded-xl border text-sm text-gray-300 transition-all ${cls}`}>{opt}</button>;
            })}
          </div>
          {selected !== null && (
            <div className={`p-3 rounded-xl border mb-4 text-sm text-gray-300 ${selected === q.correctIndex ? 'bg-green-900/20 border-green-600/30' : 'bg-red-900/20 border-red-600/30'}`}>
              {q.explanation}
            </div>
          )}
          {selected !== null && <button onClick={next} className="w-full py-3 rounded-xl font-bold text-white bg-yellow-600">{current === questions.length - 1 ? (isEn ? 'See results' : 'Voir résultats') : (isEn ? 'Next' : 'Suivant')}</button>}
        </div>
      )}
    </ExpertModuleLayout>
  );
}
