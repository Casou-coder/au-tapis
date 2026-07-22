'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { QUIZ_QUESTIONS } from '@/lib/poker-data';
import { useProgress } from '@/hooks/useProgress';

const MODULES = [
  { id: 'solvers', title: 'Solver Thinking', icon: '🤖', desc: 'Raisonner comme un GTO solver' },
  { id: 'balanced', title: 'Ranges Balancées', icon: '⚖️', desc: 'Construire des ranges parfaitement équilibrées' },
  { id: 'exploitation', title: 'Exploitation Avancée', icon: '🎯', desc: 'Exploiter les tendances adverses' },
  { id: 'hud', title: 'HUD & Stats', icon: '📊', desc: 'Lire et utiliser les statistiques' },
  { id: 'mental', title: 'Mental Game', icon: '🧠', desc: 'Psychologie et gestion du tilt' },
  { id: 'selection', title: 'Table Selection', icon: '🪑', desc: 'Choisir les meilleures tables' },
  { id: 'study', title: 'Study Routines', icon: '📚', desc: 'Comment progresser efficacement' },
  { id: 'quiz', title: 'Quiz Expert', icon: '👑', desc: 'Le test ultime' },
];

export default function ExpertPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const { completeLevel } = useProgress();

  const complete = (id: string) => {
    const next = new Set([...completedModules, id]);
    setCompletedModules(next);
    if (next.size === MODULES.length) completeLevel('expert');
    setActiveModule(null);
  };

  const progress = (completedModules.size / MODULES.length) * 100;

  if (activeModule) {
    const props = { onComplete: () => complete(activeModule), onBack: () => setActiveModule(null) };
    if (activeModule === 'solvers') return <SolversModule {...props} />;
    if (activeModule === 'balanced') return <BalancedModule {...props} />;
    if (activeModule === 'exploitation') return <ExploitationModule {...props} />;
    if (activeModule === 'hud') return <HUDModule {...props} />;
    if (activeModule === 'mental') return <MentalModule {...props} />;
    if (activeModule === 'selection') return <TableSelectionModule {...props} />;
    if (activeModule === 'study') return <StudyModule {...props} />;
    if (activeModule === 'quiz') return <ExpertQuizModule {...props} />;
  }

  return (
    <div className="min-h-screen bg-[#060d08]">
      <Navigation />
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <Link href="/" className="text-yellow-400 text-sm flex items-center gap-1 mb-4 hover:text-yellow-300">
              <ChevronLeft size={16} /> Accueil
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⚡</span>
              <div>
                <p className="text-yellow-400 text-sm font-medium">Niveau 4</p>
                <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Expert</h1>
              </div>
            </div>
            <p className="text-gray-400 mt-2">Le summum de la maîtrise. Terminez pour débloquer le niveau Professionnel.</p>

            <div className="mt-4 p-3 rounded-xl bg-yellow-900/20 border border-yellow-600/30 text-sm">
              <span className="text-yellow-400">🏆 Récompense :</span>
              <span className="text-gray-300 ml-2">Terminer ce niveau débloque le niveau Professionnel avec les mains légendaires.</span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{completedModules.size}/{MODULES.length} modules</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #92400e, #d97706, #fbbf24)' }} initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODULES.map((mod, i) => {
              const done = completedModules.has(mod.id);
              const locked = i > 0 && !completedModules.has(MODULES[i - 1].id);
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
                  {!locked && !done && <div className="flex items-center gap-1 text-yellow-400 text-sm mt-2"><span>Commencer</span><ArrowRight size={14} /></div>}
                  {locked && <p className="text-gray-600 text-sm mt-1">🔒 Module précédent requis</p>}
                </motion.button>
              );
            })}
          </div>

          {completedModules.size === MODULES.length && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 rounded-2xl border border-red-500/40 bg-red-900/20 text-center pulse-gold">
              <div className="text-5xl mb-3">👑</div>
              <h3 className="text-2xl font-bold text-white mb-2">Niveau Expert complété !</h3>
              <p className="text-yellow-400 font-medium mb-1">Vous avez débloqué le niveau Professionnel !</p>
              <p className="text-gray-400 mb-5">Accédez aux mains légendaires, aux stratégies des champions et aux secrets du plus haut niveau.</p>
              <Link href="/professionnel" className="inline-flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all glow-gold">
                Entrer au niveau Professionnel 👑 <ChevronRight size={20} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExpertModuleLayout({ children, title, icon, onBack, onComplete }: { children: React.ReactNode; title: string; icon: string; onBack: () => void; onComplete: () => void; }) {
  return (
    <div className="min-h-screen bg-[#060d08]">
      <Navigation />
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6">
              <ChevronLeft size={16} /> Retour
            </button>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">{icon}</span>
              <h1 className="text-xl font-bold text-yellow-400">{title}</h1>
            </div>
            <div className="bg-[#0d0e08] border border-yellow-900/30 rounded-2xl p-6 min-h-[400px] mb-4">{children}</div>
            <button onClick={onComplete} className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 transition-all">✓ Module terminé</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SolversModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  return (
    <ExpertModuleLayout title="Solver Thinking" icon="🤖" onBack={onBack} onComplete={onComplete}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Raisonner comme un Solver</h2>
      <p className="text-gray-400 text-sm mb-5">Les solvers (PioSOLVER, GTO+) ont révolutionné le poker moderne. Comprendre leur logique vous place à un niveau différent.</p>

      <div className="space-y-3 mb-5">
        {[
          { title: 'Les solvers calculent le Nash Equilibrium', detail: 'Pour chaque situation, le solver trouve la stratégie qui maximise le gain contre toute stratégie adverse. C\'est le GTO parfait.', icon: '🔢' },
          { title: 'Chaque décision a une fréquence', detail: 'Le solver ne dit pas "toujours bet" mais "bet 67% du temps, check 33%". Cette randomisation vous rend imprévisible.', icon: '🎲' },
          { title: 'Le contexte change tout', detail: 'Une même main peut être value-bet en check-raise et bluff en lead selon la texture du board et les ranges en jeu.', icon: '🌍' },
          { title: 'Apprenez les nœuds, pas les solutions', detail: 'Il est impossible de mémoriser toutes les solutions. Comprenez les principes : polarisation, sizing, range advantage.', icon: '🌳' },
        ].map((item, i) => (
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
        <p className="text-yellow-400 font-medium text-sm mb-2">🤖 Outils recommandés</p>
        <div className="space-y-1 text-sm">
          <div className="text-gray-300">PioSOLVER — Standard de l&apos;industrie pour les pros</div>
          <div className="text-gray-300">GTO+ — Plus abordable, très puissant</div>
          <div className="text-gray-300">Simple GTO Trainer — Pour pratiquer les spots GTO</div>
          <div className="text-gray-300">Poker Snowie — IA accessible pour débutants avancés</div>
        </div>
      </div>
    </ExpertModuleLayout>
  );
}

function BalancedModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  return (
    <ExpertModuleLayout title="Ranges Balancées" icon="⚖️" onBack={onBack} onComplete={onComplete}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Construire des Ranges Parfaites</h2>
      <p className="text-gray-400 text-sm mb-5">Une range balancée est <strong className="text-white">non-exploitable</strong>. Elle contient le bon ratio value/bluff pour chaque sizing.</p>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-5">
        <p className="text-yellow-300 font-medium mb-2">La règle alpha</p>
        <p className="text-gray-300 text-sm">Le ratio optimal bluff/value dépend de la taille de mise :</p>
        <div className="mt-2 space-y-1 font-mono text-sm">
          <div className="flex justify-between"><span className="text-gray-400">1/3 pot</span><span className="text-white">1 bluff : 2 value</span></div>
          <div className="flex justify-between"><span className="text-gray-400">1/2 pot</span><span className="text-white">1 bluff : 2 value</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Pot</span><span className="text-white">1 bluff : 2 value</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Overbet (2x)</span><span className="text-white">1 bluff : 1.3 value</span></div>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { spot: 'River value betting', balance: 'Pour chaque 2 value bets, incluez 1 bluff de même sizing', example: 'Set = value, A-high flush blocker = bluff' },
          { spot: '3-betting pre-flop', balance: '~2/3 value (QQ+, AKs) + 1/3 bluffs (A5s, A4s, K5s)', example: 'Ratio qui vous rend non-foldable et non-exploitable' },
          { spot: 'Check-raising flop', balance: 'Mixes top set, flush draws, OESD avec bottom pair bluffs', example: 'Incluez toujours les 2 pôles extrêmes' },
          { spot: 'Donk betting', balance: 'Rare en GTO — réservé à des situations très spécifiques', example: 'Paired boards où vous avez trips et l\'adversaire non' },
        ].map((item, i) => (
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
  return (
    <ExpertModuleLayout title="Exploitation Avancée" icon="🎯" onBack={onBack} onComplete={onComplete}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Exploiter les Tendances Adverses</h2>
      <p className="text-gray-400 text-sm mb-5">Contre des adversaires avec des failles, abandonnez le GTO et <strong className="text-white">exploitez au maximum</strong>.</p>

      <div className="space-y-3">
        {[
          {
            flaw: 'Fold trop souvent face aux bets',
            color: '#27ae60', bg: 'bg-green-900/20 border-green-600/30',
            exploit: 'Augmentez votre fréquence de bluff drastiquement. Bet/bet/bet sur toutes les streets.',
            example: 'Si fold to flop bet > 65% → C-bet 100% de votre range'
          },
          {
            flaw: 'Call trop souvent (calling station)',
            color: '#e74c3c', bg: 'bg-red-900/20 border-red-600/30',
            exploit: 'Coupez tous les bluffs. Value-bet thin avec des mains marginales.',
            example: 'Middle pair devient value-bet 3 streets si l\'adversaire ne fold jamais'
          },
          {
            flaw: '3-bet trop souvent / trop rarement',
            color: '#3498db', bg: 'bg-blue-900/20 border-blue-600/30',
            exploit: '3-bet trop souvent → 4-bet-call range. 3-bet trop peu → fold defend moins, steal plus.',
            example: '3-bet% > 12% → votre 4-bet range s\'élargit'
          },
          {
            flaw: 'Never bluffs / always bluffs',
            color: '#8e44ad', bg: 'bg-purple-900/20 border-purple-600/30',
            exploit: 'Never bluffs → foldez vos bluff-catchers en face de bets. Always bluffs → call-down avec tout.',
            example: 'Identifiez les tendances sur 100+ mains'
          },
          {
            flaw: 'Overlimp / limpe trop',
            color: '#c9a84c', bg: 'bg-yellow-900/20 border-yellow-600/30',
            exploit: 'Iso-raise large avec vos bonnes mains pour jouer HU en position.',
            example: 'Face à un limp, raise 4-5x BB avec vos broadways et paires moyennes'
          },
        ].map((item, i) => (
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
  return (
    <ExpertModuleLayout title="HUD & Stats" icon="📊" onBack={onBack} onComplete={onComplete}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Lire les Statistiques</h2>
      <p className="text-gray-400 text-sm mb-5">Les HUDs (Heads-Up Display) affichent les stats adverses. En ligne, c&apos;est un outil incontournable au haut niveau.</p>

      <div className="space-y-2">
        {[
          { stat: 'VPIP', full: 'Voluntarily Put Money In Pot', range: '15-25% = tight-aggressive', interpretation: 'Mesure combien souvent il joue. >30% = loose, <15% = nit' },
          { stat: 'PFR', full: 'Pre-Flop Raise', range: '10-20% = TAG idéal', interpretation: 'Combien souvent il relance pré-flop. PFR/VPIP ratio = agressivité' },
          { stat: '3-bet%', full: 'Three-Bet Percentage', range: '5-8% = équilibré', interpretation: '<4% = trop tight, >12% = trop light. Ajustez votre defense en conséquence' },
          { stat: 'Fold to C-bet', full: 'Fold to Continuation Bet', range: '45-55% = normal', interpretation: '>65% = bluffez souvent. <40% = arrêtez de bluffer' },
          { stat: 'AF', full: 'Aggression Factor', range: '2-4 = TAG', interpretation: 'Ratio bets/raises vs calls. Haut = agressif, bas = passif/calling station' },
          { stat: 'W$SD', full: 'Won $ at Showdown', range: '50-55% = gagnant', interpretation: '<45% = trop souvent au showdown avec mauvaises mains' },
          { stat: 'WtSD', full: 'Went to Showdown %', range: '25-30% = normal', interpretation: 'Trop haut = calling station, trop bas = fold trop souvent la rivière' },
        ].map((item, i) => (
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
  return (
    <ExpertModuleLayout title="Mental Game" icon="🧠" onBack={onBack} onComplete={onComplete}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Le Mental Game de Champion</h2>
      <p className="text-gray-400 text-sm mb-5">Le tilt coûte plus cher que toutes les erreurs techniques réunies. Maîtrisez votre mental.</p>

      <div className="space-y-3 mb-5">
        <h3 className="font-bold text-white">Types de tilt</h3>
        {[
          { type: 'Tilt de colère', trigger: 'Bad beat, sucout', response: 'Pause immédiate, respiration, walk' },
          { type: 'Tilt de frustration', trigger: 'Série de mauvais résultats', response: 'Stop-loss session, review les mains' },
          { type: 'Tilt de vengeance', trigger: 'Manque de respect perçu', response: 'Jeu vs un adversaire spécifique' },
          { type: 'Tilt de euphorie', trigger: 'Grosse victoire', response: 'Trop confiant, loose play' },
          { type: 'Tilt de désespoir', trigger: 'Gros downswing', response: 'Descendre de limites, break' },
        ].map((item, i) => (
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
        <h3 className="font-bold text-white">Outils de gestion mentale</h3>
        {[
          { tool: 'Stop-loss quotidien', detail: 'Définissez un maximum de pertes par session (ex: 3 buy-ins). Au-delà, stop obligatoire.' },
          { tool: 'Session review', detail: 'Après chaque session, analysez vos erreurs à tête reposée, jamais directement après une perte.' },
          { tool: 'Processus vs résultat', detail: 'Évaluez vos décisions sur leur qualité, pas sur le résultat. Un fold correct est +EV même si l\'adversaire avait les bluffs.' },
          { tool: 'Méditation et préparation', detail: 'Phil Ivey, Daniel Negreanu utilisent des routines de préparation. Votre état mental avant la session est crucial.' },
        ].map((item, i) => (
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
  return (
    <ExpertModuleLayout title="Table Selection" icon="🪑" onBack={onBack} onComplete={onComplete}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Choisir les Meilleures Tables</h2>
      <p className="text-gray-400 text-sm mb-5">La table selection est souvent <strong className="text-white">plus importante que la skill</strong>. Jouer contre des fish est la clé de la rentabilité.</p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-green-900/20 border border-green-600/30">
          <h4 className="text-green-400 font-bold text-sm mb-2">Bonne table ✅</h4>
          <ul className="text-gray-400 text-xs space-y-1">
            <li>• VPIP moyen &gt; 28%</li>
            <li>• Beaucoup de limpers</li>
            <li>• Pots multi-way fréquents</li>
            <li>• Stack taille variable</li>
            <li>• Vous connaissez les adversaires</li>
          </ul>
        </div>
        <div className="p-3 rounded-xl bg-red-900/20 border border-red-600/30">
          <h4 className="text-red-400 font-bold text-sm mb-2">Mauvaise table ❌</h4>
          <ul className="text-gray-400 text-xs space-y-1">
            <li>• Pleine de regs connus</li>
            <li>• VPIP moyen &lt; 18%</li>
            <li>• Tout le monde fold/raise</li>
            <li>• Pots heads-up seulement</li>
            <li>• Vous êtes le fish</li>
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { tip: 'Seat selection', detail: 'Asseyez-vous à gauche des fish (ils agissent avant vous post-flop) et à droite des agressifs (vous voyez leurs actions).' },
          { tip: 'Lobby observation', detail: 'Avant de join une table, observez le VPIP moyen et les pot sizes. Tables avec gros pots = action + fish.' },
          { tip: 'Ne soyez pas le fish', detail: 'Si vous ne savez pas qui est le fish à la table après 30 min, c\'est vous. Changez de table sans hésiter.' },
          { tip: 'Quitter la bonne table aussi', detail: 'Si les fish partent et ne restent que des regs solides, levez-vous. Pas d\'ego ici.' },
        ].map((item, i) => (
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
  return (
    <ExpertModuleLayout title="Study Routines" icon="📚" onBack={onBack} onComplete={onComplete}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Comment Progresser</h2>
      <p className="text-gray-400 text-sm mb-5">Les meilleurs joueurs passent autant de temps à étudier qu&apos;à jouer. Voici comment structurer votre apprentissage.</p>

      <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-600/30 mb-5">
        <p className="text-yellow-400 font-medium mb-2">La règle 50/50</p>
        <p className="text-gray-300 text-sm">Pour chaque heure de jeu, passez une heure à étudier. Les pros élites étudient parfois plus qu&apos;ils ne jouent.</p>
      </div>

      <div className="space-y-3">
        {[
          {
            phase: 'Session review (post-session)',
            time: '30-60 min',
            tasks: ['Exportez les mains clés en HH', 'Identifiez 2-3 spots difficiles', 'Notez vos doutes et questions'],
            color: '#27ae60',
          },
          {
            phase: 'Solver work',
            time: '1-2h / semaine',
            tasks: ['Importez les spots difficiles dans PioSOLVER', 'Analysez les nodes clés', 'Mémorisez les fréquences importantes'],
            color: '#3498db',
          },
          {
            phase: 'Range construction',
            time: '30 min / semaine',
            tasks: ['Révisez les charts pré-flop', 'Travaillez les défenses de BB', 'Pratiquez les spots 3-bet'],
            color: '#8e44ad',
          },
          {
            phase: 'Database analysis',
            time: '1h / semaine',
            tasks: ['Cherchez vos leaks dans les stats', 'Comparez vos stats aux benchmarks', 'Identifiez les spots non-rentables'],
            color: '#c9a84c',
          },
        ].map((item, i) => (
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
  const questions = QUIZ_QUESTIONS.filter(q => q.level === 'expert');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!questions.length) return (
    <ExpertModuleLayout title="Quiz Expert" icon="👑" onBack={onBack} onComplete={onComplete}>
      <div className="text-center py-12">
        <div className="text-5xl mb-4">⚡</div>
        <p className="text-gray-400">Quiz Expert complété !</p>
        <button onClick={onComplete} className="mt-4 bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold">Terminer ✓</button>
      </div>
    </ExpertModuleLayout>
  );

  const q = questions[current];
  const handleAnswer = (i: number) => { if (selected !== null) return; setSelected(i); if (i === q.correctIndex) setScore(s => s + 1); };
  const next = () => { if (current < questions.length - 1) { setCurrent(c => c + 1); setSelected(null); } else setFinished(true); };

  return (
    <ExpertModuleLayout title="Quiz Expert" icon="👑" onBack={onBack} onComplete={onComplete}>
      {finished ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">⚡</div>
          <h2 className="text-2xl font-bold text-white mb-2">{score}/{questions.length}</h2>
          <p className="text-gray-400 mb-4">{score === questions.length ? 'Parfait ! Vous êtes au niveau expert.' : 'Presque ! Continuez à travailler.'}</p>
          <button onClick={onComplete} className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold">Terminer le niveau ✓</button>
        </div>
      ) : (
        <div>
          <div className="text-sm text-gray-500 mb-3">Question {current + 1}/{questions.length}</div>
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
          {selected !== null && <button onClick={next} className="w-full py-3 rounded-xl font-bold text-white bg-yellow-600">{current === questions.length - 1 ? 'Voir résultats' : 'Suivant'}</button>}
        </div>
      )}
    </ExpertModuleLayout>
  );
}
