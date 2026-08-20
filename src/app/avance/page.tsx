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

const MODULES = [
  { id: 'gto', title: 'Bases du GTO', icon: '⚖️', desc: 'Game Theory Optimal : jouer sans exploits' },
  { id: 'ranges', title: 'Construction de Ranges', icon: '📐', desc: 'Penser en distributions de mains' },
  { id: 'threebets', title: '3-bets & 4-bets', icon: '🚀', desc: 'La guerre des relances' },
  { id: 'blockers', title: 'Blockers', icon: '🧱', desc: 'L\'effet de blocage avancé' },
  { id: 'icm', title: 'ICM Tournois', icon: '🏆', desc: 'La valeur des jetons en tournoi' },
  { id: 'sizing', title: 'Théorie du Bet Sizing', icon: '📏', desc: 'Optimiser vos tailles de mises' },
  { id: 'multiway', title: 'Multi-way Pots', icon: '👥', desc: 'Jouer contre plusieurs adversaires' },
  { id: 'main-guidee', title: 'Main Guidée', icon: '🃏', desc: 'Jouez un bluff complet de A à Z' },
  { id: 'quiz', title: 'Quiz Avancé', icon: '🎯', desc: 'Testez vos connaissances avancées' },
];

export default function AvancePage() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const { progress, completeModule, completeLevel, addXp } = useProgress();
  const [xpToast, setXpToast] = useState<number | null>(null);
  const isDone = (modId: string) => !!progress.completedModules[`avance-${modId}`];
  const completedCount = MODULES.filter(m => isDone(m.id)).length;
  const complete = (id: string, xp = 50) => {
    completeModule(`avance-${id}`);
    addXp(xp);
    setXpToast(xp);
    if (MODULES.every(m => m.id === id || isDone(m.id))) completeLevel('avance');
    setActiveModule(null);
  };
  const progressPct = (completedCount / MODULES.length) * 100;

  if (activeModule) {
    const props = { onComplete: () => complete(activeModule), onBack: () => setActiveModule(null) };
    if (activeModule === 'gto') return <GTOModule {...props} />;
    if (activeModule === 'ranges') return <RangesModule {...props} />;
    if (activeModule === 'threebets') return <ThreeBetsModule {...props} />;
    if (activeModule === 'blockers') return <BlockersModule {...props} />;
    if (activeModule === 'icm') return <ICMModule {...props} />;
    if (activeModule === 'sizing') return <SizingModule {...props} />;
    if (activeModule === 'multiway') return <MultiwayModule {...props} />;
    if (activeModule === 'main-guidee') return (
      <div className="min-h-screen bg-[#060d08]">
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setActiveModule(null)} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">
              <ChevronLeft size={16} /> Retour aux modules
            </button>
            <MultiHandPlayer scripts={ALL_HAND_SCRIPTS['avance']} onComplete={(score) => complete(activeModule, 50 + (score >= 4 ? 150 : score >= 3 ? 100 : score >= 2 ? 50 : 0))} onBack={() => setActiveModule(null)} />
          </div>
        </div>
      </div>
    );
    if (activeModule === 'quiz') return <AvanceQuizModule {...props} />;
  }

  return (
    <div className="min-h-screen bg-[#060d08]">
      <AnimatePresence>{xpToast !== null && <XpToast amount={xpToast} onDone={() => setXpToast(null)} />}</AnimatePresence>
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <Link href="/" className="text-purple-400 text-sm flex items-center gap-1 mb-4 hover:text-purple-300">
              <ChevronLeft size={16} /> Accueil
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🔮</span>
              <div>
                <p className="text-purple-400 text-sm font-medium">Niveau 3</p>
                <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Avancé</h1>
              </div>
            </div>
            <p className="text-gray-400 mt-2">Entrez dans le monde du GTO, des ranges et des concepts avancés.</p>
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{completedCount}/{MODULES.length} modules</span>
                <span>{Math.round(progressPct)}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-purple-700 to-purple-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.8 }} />
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
                  className={`text-left p-5 rounded-2xl border transition-all ${done ? 'border-purple-500/50 bg-purple-900/20' : locked ? 'border-gray-800 bg-gray-900/30 opacity-50 cursor-not-allowed' : 'border-purple-600/30 bg-purple-900/10 hover:border-purple-500/60 cursor-pointer'}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{mod.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-purple-400">Module {i + 1}</span>
                        {done && <CheckCircle size={16} className="text-purple-400" />}
                      </div>
                      <h3 className="font-bold text-white">{mod.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">{mod.desc}</p>
                  {!locked && !done && <div className="flex items-center gap-1 text-purple-400 text-sm mt-2"><span>Commencer</span><ArrowRight size={14} /></div>}
                  {locked && <p className="text-gray-600 text-sm mt-1">🔒 Module précédent requis</p>}
                </motion.button>
              );
            })}
          </div>
          {completedCount === MODULES.length && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 rounded-2xl border border-yellow-500/40 bg-yellow-900/20 text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">Niveau Avancé complété !</h3>
              <p className="text-gray-400 mb-4">Vous pensez comme un pro. Passez au niveau Expert !</p>
              <Link href="/expert" className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-700 to-yellow-600 text-white font-bold px-6 py-3 rounded-xl">
                Niveau Expert <ChevronRight size={18} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function AvanceModuleLayout({ children, title, icon, onBack, onComplete, quizKey }: { children: React.ReactNode; title: string; icon: string; onBack: () => void; onComplete: () => void; quizKey?: string; }) {
  return (
    <div className="min-h-screen bg-[#060d08]">
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6">
              <ChevronLeft size={16} /> Retour
            </button>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">{icon}</span>
              <h1 className="text-xl font-bold text-purple-400">{title}</h1>
            </div>
            <div className="bg-[#0a0d16] border border-purple-900/30 rounded-2xl p-6 min-h-[400px] mb-4">
              {children}
              {quizKey && <InlineQuiz moduleKey={quizKey} />}
            </div>
            <button onClick={onComplete} className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-700 to-purple-600">✓ Module terminé</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function GTOModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  return (
    <AvanceModuleLayout title="GTO Basics" icon="⚖️" onBack={onBack} onComplete={onComplete} quizKey="avance-gto">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Game Theory Optimal</h2>
      <p className="text-gray-400 text-sm mb-5">Le GTO est une stratégie qui vous rend <strong className="text-white">non-exploitable</strong>. Même si l&apos;adversaire connaît votre stratégie, il ne peut pas l&apos;exploiter.</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-600/30">
          <h3 className="font-bold text-purple-300 mb-2">GTO</h3>
          <ul className="text-gray-400 text-xs space-y-1.5">
            <li>✓ Non-exploitable</li><li>✓ Fonctionne contre tous</li><li>✓ Mix de bluffs et value</li><li>✓ Ranges balancées</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-600/30">
          <h3 className="font-bold text-blue-300 mb-2">Exploitative</h3>
          <ul className="text-gray-400 text-xs space-y-1.5">
            <li>✓ Maximise vs fish</li><li>✓ Adapté à l&apos;adversaire</li><li>⚠️ Exploitable en retour</li><li>✓ Plus profitable vs mauvais joueurs</li>
          </ul>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        <h3 className="font-bold text-white">Concepts GTO fondamentaux</h3>
        {[
          { concept: 'Polarisation', desc: 'Une range polarisée contient des très bonnes mains (value) et des bluffs. Pas de mains moyennes.' },
          { concept: 'Mixing (Fréquences)', desc: 'Avec certaines mains, vous jouez parfois bet, parfois check. Cette variance rend vos actions imprévisibles.' },
          { concept: 'Nash Equilibrium', desc: 'Point où aucun joueur ne peut améliorer son EV en changeant de stratégie. C\'est l\'objectif du GTO.' },
          { concept: 'Indifférence', desc: 'En GTO parfait, vous rendez l\'adversaire indifférent entre call et fold sur ses bluff-catchers.' },
        ].map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <h4 className="text-purple-300 font-medium text-sm mb-0.5">{item.concept}</h4>
            <p className="text-gray-400 text-xs">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-600/30">
        <p className="text-yellow-400 font-medium text-sm mb-1">💡 Conseil pratique</p>
        <p className="text-gray-300 text-sm">Contre des fish : jouez exploitative (value-bet max, bluffez peu). Contre des regs : approchez-vous du GTO. Identifiez qui est en face de vous !</p>
      </div>
    </AvanceModuleLayout>
  );
}

function RangesModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  return (
    <AvanceModuleLayout title="Construction de Ranges" icon="📐" onBack={onBack} onComplete={onComplete} quizKey="avance-ranges">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Penser en Ranges</h2>
      <p className="text-gray-400 text-sm mb-5">Ne demandez pas &quot;quelle main il a ?&quot; mais &quot;quelle est sa <strong className="text-white">range</strong> dans cette situation ?&quot;</p>

      <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-600/30 mb-5">
        <p className="text-purple-300 font-medium mb-2">Qu&apos;est-ce qu&apos;une range ?</p>
        <p className="text-gray-300 text-sm">L&apos;ensemble de toutes les mains possibles qu&apos;un joueur peut avoir dans une situation donnée, avec leur fréquence.</p>
      </div>

      <div className="space-y-3 mb-5">
        <h3 className="font-bold text-white text-sm">Réduction de range par l&apos;action</h3>
        {[
          { action: 'UTG open-raise', range: 'Environ 15% des mains : AA-66, AK-AJ, KQs-KJs, QJs, JTs', note: 'Range tight en early position' },
          { action: 'BTN open-raise', range: 'Environ 45% des mains : tous les paires, broadways, suited connectors', note: 'Range large en late position' },
          { action: '3-bet de l\'adversaire', range: 'Se resserre à ~8-12% : QQ+, AK, parfois JJ, AQs', note: 'La range se polarise' },
          { action: 'Call du flop (dry board)', range: 'Élimination des pure bluffs, garder top pair+, draws', note: 'Le call filtre les mains' },
        ].map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-purple-300 text-xs font-medium mb-1">→ {item.action}</div>
            <div className="text-white text-sm mb-0.5">{item.range}</div>
            <div className="text-gray-500 text-xs italic">{item.note}</div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <h4 className="font-bold text-white mb-2">Avantage de range</h4>
        <p className="text-gray-300 text-sm">Si votre range est plus forte que celle de l&apos;adversaire sur un board donné, vous avez un <strong className="text-purple-300">range advantage</strong>. Utilisez-le pour C-bet souvent et avec de petites tailles.</p>
      </div>
    </AvanceModuleLayout>
  );
}

function ThreeBetsModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  return (
    <AvanceModuleLayout title="3-bets & 4-bets" icon="🚀" onBack={onBack} onComplete={onComplete} quizKey="avance-threebets">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>La Guerre des Relances</h2>
      <p className="text-gray-400 text-sm mb-4">Le 3-bet est la 3e mise. Le 4-bet est la réponse au 3-bet. Ces moves définissent le haut niveau du poker moderne.</p>

      <div className="space-y-3 mb-5">
        {[
          {
            move: '3-bet pour Value',
            hands: ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AQs'],
            color: '#27ae60',
            bg: 'bg-green-900/20 border-green-600/30',
            desc: 'Vos mains les plus fortes. Objectif : construire le pot et dominer l\'adversaire.',
            sizing: '3x à 4x le open (IP), 4x à 5x (OOP)',
          },
          {
            move: '3-bet Bluff',
            hands: ['A5s', 'A4s', 'K5s', 'J9s', '65s'],
            color: '#8e44ad',
            bg: 'bg-purple-900/20 border-purple-600/30',
            desc: 'Bluffs avec blockers et bons outs. Balancez votre range pour être imprévisible.',
            sizing: 'Même taille que value pour équilibrer',
          },
          {
            move: '4-bet pour Value',
            hands: ['AA', 'KK', 'QQ', 'AKs'],
            color: '#c9a84c',
            bg: 'bg-yellow-900/20 border-yellow-600/30',
            desc: 'Répondre à un 3-bet. Rare, seulement avec des mains premium.',
            sizing: '2.5x le 3-bet',
          },
          {
            move: '4-bet Bluff (rare)',
            hands: ['AJs', 'KQs', 'A5s'],
            color: '#e74c3c',
            bg: 'bg-red-900/20 border-red-600/30',
            desc: 'Les meilleurs joueurs mélangent quelques 4-bet bluffs avec des blockers As.',
            sizing: 'Même size que value',
          },
        ].map((item, i) => (
          <div key={i} className={`p-4 rounded-xl border ${item.bg}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold" style={{ color: item.color }}>{item.move}</h4>
              <span className="text-xs text-gray-500">{item.sizing}</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {item.hands.map(h => <span key={h} className="bg-black/40 px-1.5 py-0.5 rounded text-xs font-mono text-white">{h}</span>)}
            </div>
            <p className="text-gray-400 text-xs">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-yellow-400 font-medium text-sm mb-1">🎯 Règle clé du 3-bet</p>
        <p className="text-gray-300 text-sm">Pour être en équilibre, votre range de 3-bet doit avoir environ <strong className="text-white">1 bluff pour 2 mains de valeur</strong>. Cela rend l&apos;adversaire indifférent au fold ou call.</p>
      </div>
    </AvanceModuleLayout>
  );
}

function BlockersModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  return (
    <AvanceModuleLayout title="Blockers" icon="🧱" onBack={onBack} onComplete={onComplete} quizKey="avance-blockers">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>L&apos;Effet de Blocage</h2>
      <p className="text-gray-400 text-sm mb-5">Avoir certaines cartes dans votre main <strong className="text-white">réduit le nombre de combos</strong> que peut avoir l&apos;adversaire dans sa range.</p>

      <div className="space-y-3 mb-5">
        {[
          { card: 'As dans votre main', effect: 'Réduit AA de 6 combos à 3, réduit AK de 16 à 8', use: 'Excellent bluff-blocker pré-flop et river. L\'adversaire a moins de nuts.' },
          { card: 'Roi dans votre main', effect: 'Réduit KK de 6 à 3 combos, réduit AK de 16 à 8', use: 'Bon pour 3-bet bluff : l\'adversaire a moins de KK pour re-raise.' },
          { card: 'Carte de votre couleur (flush)', effect: 'Réduit les flush draws adverses de 1', use: 'Vous bloquez une de ses outs si il a un draw.' },
          { card: 'Carte sur le board (paire)', effect: 'Avec une carte pairée, vous bloquez trips et quads adverses', use: 'Si vous avez un K et le board est KK7, l\'adversaire a moins de trips.' },
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h4 className="text-purple-300 font-medium text-sm mb-1">🃏 {item.card}</h4>
            <div className="text-white text-xs mb-1">{item.effect}</div>
            <p className="text-gray-500 text-xs">{item.use}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-600/30">
        <p className="text-purple-300 font-medium text-sm mb-2">Exemple concret : River bluff avec A♥</p>
        <p className="text-gray-300 text-sm">Board: K♥ J♥ 8♥ 4♣ 2♠</p>
        <p className="text-gray-300 text-sm mt-1">Vous avez A♥ X. Votre as bloque les flush (9 outs) adverses ET les top flush draws A♥K♥, A♥J♥. L&apos;adversaire a moins de calling hands → bluff plus efficace.</p>
      </div>
    </AvanceModuleLayout>
  );
}

function ICMModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  return (
    <AvanceModuleLayout title="ICM Tournois" icon="🏆" onBack={onBack} onComplete={onComplete} quizKey="avance-icm">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Independent Chip Model</h2>
      <p className="text-gray-400 text-sm mb-5">En tournoi, la valeur de vos jetons <strong className="text-white">n&apos;est pas linéaire</strong>. Doubler ne double pas votre prize equity : perdre tout vous élimine.</p>

      <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-600/30 mb-5">
        <p className="text-yellow-400 font-medium mb-2">Le paradoxe ICM</p>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-black/30 rounded-xl p-3">
            <div className="text-2xl mb-1">📈</div>
            <div className="text-green-400 font-bold">+100% jetons</div>
            <div className="text-gray-400 text-xs mt-0.5">≈ +70-85% prize equity</div>
          </div>
          <div className="bg-black/30 rounded-xl p-3">
            <div className="text-2xl mb-1">💀</div>
            <div className="text-red-400 font-bold">-100% jetons</div>
            <div className="text-gray-400 text-xs mt-0.5">= -100% prize equity (élimination)</div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        <h3 className="font-bold text-white text-sm">Conséquences ICM</h3>
        {[
          { scenario: 'Proche de la bulle', action: 'Foldez des mains +EV en chip EV', reason: 'La survival equity vaut trop : attendre que des petites piles s\'éliminent' },
          { scenario: 'Big stack à la bulle', action: 'Augmentez la pression, steal les blinds', reason: 'Vos jetons "coûtent moins" à risquer, small stacks veulent survivre' },
          { scenario: 'All-in préflop proche finale table', action: 'Call range plus tight qu\'en cash', reason: 'Chaque place gagnée = prize money, pas de re-buy' },
          { scenario: 'Flip 50/50 en tournoi', action: 'Évitez si chip EV neutre', reason: 'Le risque d\'élimination surpasse le gain potentiel en ICM equity' },
        ].map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-yellow-300 text-xs font-medium mb-1">{item.scenario}</div>
            <div className="text-white text-sm mb-0.5">{item.action}</div>
            <div className="text-gray-500 text-xs">{item.reason}</div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-gray-300 text-sm"><strong className="text-yellow-400">NASH Equilibrium Push/Fold :</strong> En fin de tournoi avec moins de 10BB, utilisez les charts push/fold Nash pour prendre des décisions optimales. Ce sont des tables précalculées par les solvers.</p>
      </div>
    </AvanceModuleLayout>
  );
}

function SizingModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  return (
    <AvanceModuleLayout title="Théorie du Bet Sizing" icon="📏" onBack={onBack} onComplete={onComplete} quizKey="avance-sizing">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Théorie des Tailles de Mise</h2>
      <p className="text-gray-400 text-sm mb-5">La taille de votre mise communique la <strong className="text-white">force de votre range</strong> et doit être adaptée à l&apos;objectif (value, bluff, protection).</p>

      <div className="space-y-3 mb-5">
        {[
          { size: '1/4 à 1/3 du pot', use: 'Boards secs (dry), range advantage élevé, bonne main ou bluff fréquent', optimal: 'K-7-2 rainbow, A-7-3 rainbow' },
          { size: '1/2 pot', use: 'Standard, boards neutres, value ou semi-bluff', optimal: 'Boards texturés moyens' },
          { size: '2/3 à 3/4 pot', use: 'Boards humides (wet), polarisation, protection de main', optimal: 'J-10-8 avec flush draw' },
          { size: 'Pot ou overbet (>pot)', use: 'Polarisation maximum : nuts ou bluff pur', optimal: 'River avec ou nuts ou air' },
        ].map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-purple-300 text-sm">{item.size}</span>
            </div>
            <div className="text-white text-xs mb-0.5">{item.use}</div>
            <div className="text-gray-500 text-xs">Ex: {item.optimal}</div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-600/30">
        <p className="text-purple-300 font-medium text-sm mb-2">Règle des sizing GTO</p>
        <p className="text-gray-300 text-sm">En GTO, une mise plus grande = range plus polarisée (nuts ou bluff). Une mise petite = range merged (mains moyennes à bonnes). Respectez cette logique pour être cohérent.</p>
      </div>
    </AvanceModuleLayout>
  );
}

function MultiwayModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  return (
    <AvanceModuleLayout title="Multi-way Pots" icon="👥" onBack={onBack} onComplete={onComplete} quizKey="avance-multiway">
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Pots Multi-way</h2>
      <p className="text-gray-400 text-sm mb-5">Jouer contre 2+ adversaires change complètement la stratégie. <strong className="text-white">Votre fréquence de bluff chute drastiquement.</strong></p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <div className="text-gray-500 text-xs mb-1">Chance d&apos;un fold HU</div>
          <div className="text-white font-bold text-xl">~45%</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <div className="text-gray-500 text-xs mb-1">Chance tous foldent (3 joueurs)</div>
          <div className="text-white font-bold text-xl">~9%</div>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { rule: 'Bluffez beaucoup moins', detail: 'Chaque adversaire supplémentaire réduit drastiquement la fold equity. Les bluffs perdent de leur rentabilité.' },
          { rule: 'Value-bet avec des mains plus fortes', detail: 'Avec 3 adversaires, il faut une meilleure main pour value-bet. Top pair peut être faible.' },
          { rule: 'Préférez les nuts et semi-nuts', detail: 'En multiway, focus sur les mains très fortes : two pair+, sets, flushes, straights.' },
          { rule: 'Position est encore plus précieuse', detail: 'Être en position avec 3 adversaires est un avantage massif : vous voyez tout le monde agir.' },
          { rule: 'Réduisez votre fréquence de C-bet', detail: 'En multiway, C-bettez seulement quand vous avez une main forte ou une draw très puissante.' },
        ].map((item, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-2">
              <span className="text-purple-400 text-sm font-bold shrink-0">#{i + 1}</span>
              <div>
                <div className="text-white text-sm font-medium">{item.rule}</div>
                <div className="text-gray-500 text-xs mt-0.5">{item.detail}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AvanceModuleLayout>
  );
}

function AvanceQuizModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const questions = QUIZ_QUESTIONS.filter(q => q.level === 'avance');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!questions.length) return (
    <AvanceModuleLayout title="Quiz Avancé" icon="🎯" onBack={onBack} onComplete={onComplete}>
      <div className="text-center py-12">
        <div className="text-4xl mb-3">🎯</div>
        <p className="text-gray-400">Quiz avancé terminé ! Félicitations.</p>
        <button onClick={onComplete} className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold">Terminer ✓</button>
      </div>
    </AvanceModuleLayout>
  );

  const q = questions[current];
  const handleAnswer = (i: number) => { if (selected !== null) return; setSelected(i); if (i === q.correctIndex) setScore(s => s + 1); };
  const next = () => { if (current < questions.length - 1) { setCurrent(c => c + 1); setSelected(null); } else setFinished(true); };

  return (
    <AvanceModuleLayout title="Quiz Avancé" icon="🎯" onBack={onBack} onComplete={onComplete}>
      {finished ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🔮</div>
          <h2 className="text-2xl font-bold text-white mb-2">{score}/{questions.length}</h2>
          <p className="text-gray-400 mb-4">Niveau avancé maîtrisé !</p>
          <button onClick={onComplete} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold">Terminer ✓</button>
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
          {selected !== null && <button onClick={next} className="w-full py-3 rounded-xl font-bold text-white bg-purple-600">{current === questions.length - 1 ? 'Voir résultats' : 'Suivant'}</button>}
        </div>
      )}
    </AvanceModuleLayout>
  );
}
