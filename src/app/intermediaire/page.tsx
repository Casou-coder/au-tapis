'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { HandPlayer } from '@/components/HandPlayer';
import { HAND_SCRIPTS } from '@/lib/hand-scripts';
import { OUTS_TABLE, POT_ODDS_TABLE, STARTING_HANDS, QUIZ_QUESTIONS } from '@/lib/poker-data';

const MODULES = [
  { id: 'potodds', title: 'Pot Odds', icon: '📊', desc: 'Calcul de rentabilité des calls' },
  { id: 'ev', title: 'Valeur Attendue (EV)', icon: '🧮', desc: 'Mathématiques du poker' },
  { id: 'outs', title: 'Outs & Équité', icon: '🎲', desc: 'Probabilités de compléter les draws' },
  { id: 'hands', title: 'Hand Selection', icon: '🃏', desc: 'Chart de sélection GTO' },
  { id: 'cbet', title: 'Continuation Bet', icon: '💥', desc: 'L\'arme principale post-flop' },
  { id: 'bluff', title: 'Semi-Bluff', icon: '🎭', desc: 'Bluffer avec des outs' },
  { id: 'main-guidee', title: 'Main Guidée', icon: '🃏', desc: 'Jouez une vraie main guidée' },
  { id: 'quiz', title: 'Quiz', icon: '🏆', desc: 'Testez vos connaissances' },
];

export default function IntermediairePage() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const complete = (id: string) => { setCompletedModules(prev => new Set([...prev, id])); setActiveModule(null); };
  const progress = (completedModules.size / MODULES.length) * 100;

  if (activeModule) {
    const props = { onComplete: () => complete(activeModule), onBack: () => setActiveModule(null) };
    if (activeModule === 'potodds') return <PotOddsModule {...props} />;
    if (activeModule === 'ev') return <EVModule {...props} />;
    if (activeModule === 'outs') return <OutsModule {...props} />;
    if (activeModule === 'hands') return <HandsModule {...props} />;
    if (activeModule === 'cbet') return <CBetModule {...props} />;
    if (activeModule === 'bluff') return <BluffModule {...props} />;
    if (activeModule === 'main-guidee') return (
      <div className="min-h-screen bg-[#060d08]">
        <Navigation />
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setActiveModule(null)} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">
              <ChevronLeft size={16} /> Retour aux modules
            </button>
            <HandPlayer script={HAND_SCRIPTS['intermediaire']} onComplete={() => complete(activeModule)} onBack={() => setActiveModule(null)} />
          </div>
        </div>
      </div>
    );
    if (activeModule === 'quiz') return <IntermQuizModule {...props} />;
  }

  return (
    <div className="min-h-screen bg-[#060d08]">
      <Navigation />
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <Link href="/" className="text-blue-400 text-sm flex items-center gap-1 mb-4 hover:text-blue-300">
              <ChevronLeft size={16} /> Accueil
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🎯</span>
              <div>
                <p className="text-blue-400 text-sm font-medium">Niveau 2</p>
                <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>Intermédiaire</h1>
              </div>
            </div>
            <p className="text-gray-400 mt-2">Maîtrisez les mathématiques du poker et la stratégie post-flop.</p>
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{completedModules.size}/{MODULES.length} modules</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-blue-700 to-blue-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODULES.map((mod, i) => {
              const done = completedModules.has(mod.id);
              const locked = i > 0 && !completedModules.has(MODULES[i - 1].id);
              return (
                <motion.button key={mod.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  onClick={() => !locked && setActiveModule(mod.id)}
                  className={`text-left p-5 rounded-2xl border transition-all ${done ? 'border-blue-500/50 bg-blue-900/20' : locked ? 'border-gray-800 bg-gray-900/30 opacity-50 cursor-not-allowed' : 'border-blue-600/30 bg-blue-900/10 hover:border-blue-500/60 cursor-pointer'}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{mod.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-blue-400">Module {i + 1}</span>
                        {done && <CheckCircle size={16} className="text-blue-400" />}
                      </div>
                      <h3 className="font-bold text-white">{mod.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">{mod.desc}</p>
                  {!locked && !done && <div className="flex items-center gap-1 text-blue-400 text-sm mt-2"><span>Commencer</span><ArrowRight size={14} /></div>}
                  {locked && <p className="text-gray-600 text-sm mt-1">🔒 Module précédent requis</p>}
                </motion.button>
              );
            })}
          </div>

          {completedModules.size === MODULES.length && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 rounded-2xl border border-purple-500/40 bg-purple-900/20 text-center">
              <div className="text-4xl mb-3">🔮</div>
              <h3 className="text-xl font-bold text-white mb-2">Niveau Intermédiaire complété !</h3>
              <p className="text-gray-400 mb-4">Vous maîtrisez les maths du poker. Cap sur le niveau Avancé !</p>
              <Link href="/avance" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-700 to-purple-600 text-white font-bold px-6 py-3 rounded-xl">
                Niveau Avancé <ChevronRight size={18} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── POT ODDS MODULE ───────────────────────────────────────────────────────────

function PotOddsModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [pot, setPot] = useState(100);
  const [callAmount, setCallAmount] = useState(50);

  const potOddsPercent = Math.round((callAmount / (pot + callAmount)) * 100);

  return (
    <LevelModuleLayout title="Pot Odds" icon="📊" color="#3498db" onBack={onBack} onComplete={onComplete}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Les Pot Odds</h2>
      <p className="text-gray-400 text-sm mb-6">Le pot odds est le ratio entre ce que vous risquez et ce que vous pouvez gagner. Si votre équité &gt; pot odds%, le call est rentable.</p>

      {/* Interactive calculator */}
      <div className="p-5 rounded-2xl bg-blue-900/20 border border-blue-600/30 mb-6">
        <h3 className="font-bold text-blue-300 mb-4">Calculateur interactif</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-500 text-xs">Taille du pot (€)</label>
            <input type="range" min={10} max={500} value={pot} onChange={e => setPot(+e.target.value)} className="w-full mt-1 accent-blue-500" />
            <div className="text-white font-bold text-lg">{pot}€</div>
          </div>
          <div>
            <label className="text-gray-500 text-xs">Mise à caller (€)</label>
            <input type="range" min={5} max={pot} value={Math.min(callAmount, pot)} onChange={e => setCallAmount(+e.target.value)} className="w-full mt-1 accent-blue-500" />
            <div className="text-white font-bold text-lg">{callAmount}€</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-black/30 rounded-xl p-3">
            <div className="text-gray-500 text-xs">Pot total si call</div>
            <div className="text-white font-bold">{pot + callAmount}€</div>
          </div>
          <div className="bg-black/30 rounded-xl p-3">
            <div className="text-gray-500 text-xs">Ratio</div>
            <div className="text-white font-bold">{Math.round(pot / callAmount)}:1</div>
          </div>
          <div className="bg-blue-700/30 rounded-xl p-3 border border-blue-500/50">
            <div className="text-blue-300 text-xs">Équité requise</div>
            <div className="text-blue-200 font-bold text-xl">{potOddsPercent}%</div>
          </div>
        </div>

        <div className={`mt-4 p-3 rounded-xl text-sm ${potOddsPercent < 20 ? 'bg-green-900/30 text-green-300 border border-green-700/30' : potOddsPercent < 35 ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30' : 'bg-red-900/30 text-red-300 border border-red-700/30'}`}>
          {potOddsPercent < 20 ? '✅ Pot odds très favorables — la plupart des draws sont rentables ici' :
            potOddsPercent < 35 ? '⚡ Pot odds corrects — flush draw et OESD rentables' :
              '⚠️ Pot odds défavorables — besoin d\'une main forte ou de très bons draws'}
        </div>
      </div>

      <h3 className="font-bold text-white mb-3">Table de référence rapide</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-white/10">
              <th className="text-left py-2 pr-4">Sizing</th>
              <th className="text-left py-2 pr-4">Équité requise</th>
              <th className="text-left py-2">Interprétation</th>
            </tr>
          </thead>
          <tbody>
            {POT_ODDS_TABLE.map((row, i) => (
              <tr key={i} className="border-b border-white/5">
                <td className="py-2 pr-4 text-white font-mono">{row.sizing}</td>
                <td className="py-2 pr-4 text-blue-400 font-bold">{row.breakEven}</td>
                <td className="py-2 text-gray-400 text-xs">{row.interpretation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LevelModuleLayout>
  );
}

// ── EV MODULE ─────────────────────────────────────────────────────────────────

function EVModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [winProb, setWinProb] = useState(35);
  const [winAmount, setWinAmount] = useState(200);
  const [loseAmount, setLoseAmount] = useState(100);

  const ev = (winProb / 100) * winAmount - ((100 - winProb) / 100) * loseAmount;

  return (
    <LevelModuleLayout title="Valeur Attendue (EV)" icon="🧮" color="#3498db" onBack={onBack} onComplete={onComplete}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Expected Value (EV)</h2>
      <p className="text-gray-400 text-sm mb-4">
        L&apos;EV est le gain moyen d&apos;une décision répétée des milliers de fois. <strong className="text-white">EV+ = décision rentable à long terme</strong>.
      </p>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-5">
        <code className="text-green-300 text-sm">EV = (P(gagner) × Gain) - (P(perdre) × Perte)</code>
      </div>

      <div className="p-5 rounded-2xl bg-blue-900/20 border border-blue-600/30 mb-6">
        <h3 className="font-bold text-blue-300 mb-4">Simulateur EV</h3>
        <div className="space-y-4">
          {[
            { label: 'Probabilité de gagner', value: winProb, setter: setWinProb, min: 1, max: 99, suffix: '%', color: '#2ecc71' },
            { label: 'Gain si victoire (€)', value: winAmount, setter: setWinAmount, min: 10, max: 1000, suffix: '€', color: '#3498db' },
            { label: 'Perte si défaite (€)', value: loseAmount, setter: setLoseAmount, min: 5, max: 500, suffix: '€', color: '#e74c3c' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{item.label}</span>
                <span className="font-bold" style={{ color: item.color }}>{item.value}{item.suffix}</span>
              </div>
              <input type="range" min={item.min} max={item.max} value={item.value} onChange={e => item.setter(+e.target.value)} className="w-full" style={{ accentColor: item.color }} />
            </div>
          ))}
        </div>

        <div className={`mt-5 p-4 rounded-xl text-center border ${ev > 0 ? 'bg-green-900/30 border-green-600/40' : 'bg-red-900/30 border-red-600/40'}`}>
          <div className="text-gray-400 text-sm mb-1">Expected Value</div>
          <div className={`text-4xl font-bold ${ev > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {ev > 0 ? '+' : ''}{ev.toFixed(2)}€
          </div>
          <div className="text-gray-500 text-sm mt-1">
            {ev > 0 ? 'Décision rentable à long terme ✅' : 'Décision perdante à long terme ❌'}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-white">Exemples concrets</h3>
        {[
          { situation: 'Call avec flush draw (pot 100€, call 33€)', ev: '+5.20', positive: true, detail: 'Équité 36% vs pot odds 25% = EV+' },
          { situation: 'Call top pair face à un all-in sur river', ev: '-12.50', positive: false, detail: 'Adversaire range trop forte, call –EV' },
          { situation: 'Bluff river avec la meilleure texture', ev: '+18.00', positive: true, detail: 'Fold equity élevé = bluff rentable' },
        ].map((ex, i) => (
          <div key={i} className={`p-3 rounded-xl border ${ex.positive ? 'bg-green-900/10 border-green-700/30' : 'bg-red-900/10 border-red-700/30'}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white text-sm font-medium">{ex.situation}</p>
                <p className="text-gray-500 text-xs mt-0.5">{ex.detail}</p>
              </div>
              <span className={`font-bold text-lg ${ex.positive ? 'text-green-400' : 'text-red-400'}`}>{ex.ev}€</span>
            </div>
          </div>
        ))}
      </div>
    </LevelModuleLayout>
  );
}

// ── OUTS MODULE ───────────────────────────────────────────────────────────────

function OutsModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [outs, setOuts] = useState(9);
  const selected = OUTS_TABLE.find(r => r.outs === outs) || OUTS_TABLE[8];

  return (
    <LevelModuleLayout title="Outs & Équité" icon="🎲" color="#3498db" onBack={onBack} onComplete={onComplete}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Calculer vos Outs</h2>
      <p className="text-gray-400 text-sm mb-4">
        Un <strong className="text-white">out</strong> est une carte qui améliore votre main pour la rendre gagnante. Connaître vos outs = calculer vos chances.
      </p>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-5">
        <p className="text-green-300 text-sm font-mono">Règle des 2 et 4 :</p>
        <p className="text-gray-300 text-sm mt-1">Outs × 4 = équité sur 2 streets (flop → river)</p>
        <p className="text-gray-300 text-sm">Outs × 2 = équité sur 1 street (turn → river)</p>
      </div>

      <div className="p-5 rounded-2xl bg-blue-900/20 border border-blue-600/30 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-blue-300 font-medium">Nombre d&apos;outs : <span className="text-white font-bold text-xl">{outs}</span></span>
          <span className="text-gray-500 text-sm">{selected.note}</span>
        </div>
        <input type="range" min={1} max={17} value={outs} onChange={e => setOuts(+e.target.value)} className="w-full mb-4 accent-blue-500" />
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-black/30 rounded-xl p-3">
            <div className="text-gray-500 text-xs">Turn + River</div>
            <div className="text-blue-400 font-bold text-2xl">{selected.turnAndRiver}</div>
            <div className="text-gray-600 text-xs">({outs} × 4)</div>
          </div>
          <div className="bg-black/30 rounded-xl p-3">
            <div className="text-gray-500 text-xs">River seulement</div>
            <div className="text-blue-300 font-bold text-2xl">{selected.river}</div>
            <div className="text-gray-600 text-xs">({outs} × 2)</div>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-white mb-3">Types de draws communs</h3>
      <div className="space-y-2">
        {[
          { draw: 'Gutshot (inside straight)', outs: 4, desc: 'Une seule carte comble votre quinte' },
          { draw: 'Open-Ended Straight Draw (OESD)', outs: 8, desc: '2 cartes possibles pour compléter la quinte' },
          { draw: 'Flush Draw', outs: 9, desc: '9 cartes de la même couleur restantes' },
          { draw: 'OESD + Flush Draw (Combo)', outs: 15, desc: 'La draw la plus puissante possible' },
          { draw: 'Overcards (AK sur board bas)', outs: 6, desc: '3 As + 3 Rois = 6 outs pour paire top' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-blue-700/30 flex items-center justify-center text-blue-300 font-bold text-sm shrink-0">{item.outs}</div>
            <div>
              <div className="text-white text-sm font-medium">{item.draw}</div>
              <div className="text-gray-500 text-xs">{item.desc}</div>
            </div>
            <div className="ml-auto text-blue-400 text-sm font-bold">{item.outs * 4}%</div>
          </div>
        ))}
      </div>
    </LevelModuleLayout>
  );
}

// ── HANDS MODULE ──────────────────────────────────────────────────────────────

function HandsModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [filter, setFilter] = useState<string>('all');
  const cats = ['all', 'premium', 'strong', 'playable', 'speculative', 'weak'];
  const colors: Record<string, string> = { premium: '#c9a84c', strong: '#27ae60', playable: '#3498db', speculative: '#8e44ad', weak: '#e74c3c' };
  const labels: Record<string, string> = { premium: 'Premium', strong: 'Forte', playable: 'Jouable', speculative: 'Spéculative', weak: 'Faible' };

  const filtered = filter === 'all' ? STARTING_HANDS : STARTING_HANDS.filter(h => h.category === filter);

  return (
    <LevelModuleLayout title="Hand Selection Chart" icon="🃏" color="#3498db" onBack={onBack} onComplete={onComplete}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Sélection de Mains</h2>
      <p className="text-gray-400 text-sm mb-4">Chart de référence pour la sélection de mains pré-flop. Filtrez par catégorie.</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${filter === c ? 'text-white border-transparent' : 'border-white/10 text-gray-400 hover:text-white'}`}
            style={{ background: filter === c ? (c === 'all' ? '#334155' : colors[c]) : 'transparent' }}>
            {c === 'all' ? 'Toutes' : labels[c]}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filtered.map((hand, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
            <div className="w-12 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm text-white" style={{ background: colors[hand.category] + '30', borderWidth: 1, borderColor: colors[hand.category] + '50', borderStyle: 'solid' }}>
              {hand.hand}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{hand.action}</div>
              <div className="text-gray-500 text-xs truncate">{hand.note}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Équité vs random</div>
              <div className="font-bold text-sm" style={{ color: colors[hand.category] }}>{hand.equity}%</div>
            </div>
          </div>
        ))}
      </div>
    </LevelModuleLayout>
  );
}

// ── CBET MODULE ───────────────────────────────────────────────────────────────

function CBetModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: 'Qu\'est-ce que la Continuation Bet ?',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">La <strong className="text-white">C-bet</strong> (continuation bet) consiste à miser après avoir relancé pré-flop, peu importe si le flop vous aide.</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-green-900/20 border border-green-600/30">
              <h4 className="font-bold text-green-400 text-sm mb-1">Raisons de C-bet</h4>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>✓ Vous avez l&apos;initiative</li><li>✓ Représenter une main forte</li><li>✓ Prendre le pot rapidement</li><li>✓ Protéger vos bonnes mains</li>
              </ul>
            </div>
            <div className="p-3 rounded-xl bg-red-900/20 border border-red-600/30">
              <h4 className="font-bold text-red-400 text-sm mb-1">Ne pas C-bet si</h4>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>✗ Board très favorable à l&apos;adversaire</li><li>✗ Joueurs multiples (multiway)</li><li>✗ Vous avez un bon showdown value</li><li>✗ Adversaire appelle trop</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Taille et fréquence de la C-bet',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Dry board (K-7-2)', size: '1/3 à 1/2 pot', freq: '~80%', reason: 'Board peu connecté, miss beaucoup l\'adversaire' },
              { label: 'Wet board (J-T-9)', size: '2/3 à pot', freq: '~40%', reason: 'Board connecté, adverse a beaucoup d\'équité' },
              { label: 'Monotone board (A♥6♥2♥)', size: '1/3 pot ou check', freq: '~35%', reason: 'Board de flush, difficile à représenter' },
              { label: 'Paired board (K-K-7)', size: '1/3 à 1/2 pot', freq: '~60%', reason: 'Bon pour blocker + représenter trip K' },
            ].map((b, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-blue-400 text-xs font-bold mb-1">{b.label}</h4>
                <div className="text-white text-sm">Taille: <strong>{b.size}</strong></div>
                <div className="text-white text-sm">Fréquence: <strong>{b.freq}</strong></div>
                <p className="text-gray-500 text-xs mt-1">{b.reason}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Check-Raise : La réponse à la C-bet',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">Quand votre adversaire C-bet, vous pouvez <strong className="text-white">check-raise</strong> pour reprendre l&apos;initiative.</p>
          <div className="space-y-3">
            {[
              { hand: 'Top pair ou mieux', action: 'Check-raise pour value', icon: '💰' },
              { hand: 'Draw fort (flush + straight)', action: 'Check-raise semi-bluff', icon: '🎭' },
              { hand: 'Main faible sans outs', action: 'Généralement fold', icon: '🗑️' },
              { hand: 'Main moyenne (middle pair)', action: 'Call et réévaluer', icon: '👍' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="text-white text-sm font-medium">{item.hand}</div>
                  <div className="text-gray-400 text-xs">{item.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <LevelModuleLayout title="Continuation Bet" icon="💥" color="#3498db" onBack={onBack} onComplete={onComplete}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>{steps[step].title}</h2>
        <span className="text-gray-500 text-sm">{step + 1}/{steps.length}</span>
      </div>
      <div className="h-1 bg-gray-800 rounded-full mb-5">
        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          {steps[step].content}
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-3 mt-6">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : onBack()} className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onComplete()} className="flex-1 py-2.5 rounded-xl font-bold text-white transition-all" style={{ background: step === steps.length - 1 ? '#c9a84c' : '#3498db' }}>
          {step === steps.length - 1 ? '✓ Terminer' : 'Suivant'}
        </button>
      </div>
    </LevelModuleLayout>
  );
}

// ── BLUFF MODULE ──────────────────────────────────────────────────────────────

function BluffModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  return (
    <LevelModuleLayout title="Semi-Bluff" icon="🎭" color="#3498db" onBack={onBack} onComplete={onComplete}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>L&apos;Art du Semi-Bluff</h2>
      <p className="text-gray-400 text-sm mb-5">Le semi-bluff est un bluff avec une main qui peut encore s&apos;améliorer. C&apos;est l&apos;arme la plus puissante du joueur intermédiaire.</p>

      <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-600/30 mb-5">
        <p className="text-blue-300 font-medium mb-2">Pourquoi le semi-bluff est meilleur qu&apos;un bluff pur ?</p>
        <p className="text-gray-300 text-sm">Vous pouvez gagner de <strong className="text-white">deux façons</strong> : en faisant folder maintenant, ou en complétant votre draw. Un bluff pur ne gagne que si l&apos;adversaire fold.</p>
      </div>

      <div className="space-y-3 mb-5">
        <h3 className="font-bold text-white">Meilleures situations de semi-bluff</h3>
        {[
          { hand: 'Flush draw (9 outs)', equity: '36%', foldEquity: 'Élevée', rating: 5, desc: 'La combinaison parfaite : forte équité + pression' },
          { hand: 'OESD + flush draw (15 outs)', equity: '54%', foldEquity: 'Très élevée', rating: 5, desc: 'Souvent FAVORI contre top pair !' },
          { hand: 'Open-ended straight draw (8 outs)', equity: '32%', foldEquity: 'Bonne', rating: 4, desc: 'Bon semi-bluff, surtout heads-up' },
          { hand: 'Overcards + gutshot (7 outs)', equity: '28%', foldEquity: 'Correcte', rating: 3, desc: 'Acceptable si fold equity élevée' },
          { hand: 'Gutshot seul (4 outs)', equity: '16%', foldEquity: 'Doit être forte', rating: 2, desc: 'Semi-bluff risqué, besoin de fold equity' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-white text-sm font-medium">{item.hand}</span>
                <span className="text-gray-500 text-xs">· Équité {item.equity}</span>
              </div>
              <p className="text-gray-500 text-xs">{item.desc}</p>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className={`w-2 h-4 rounded-sm ${j < item.rating ? 'bg-blue-500' : 'bg-gray-700'}`} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-600/30">
        <p className="text-yellow-400 font-medium mb-1">💡 Règle d&apos;or</p>
        <p className="text-gray-300 text-sm">
          Ne semi-bluffez jamais sans au moins <strong className="text-white">6 outs</strong>, sauf si la fold equity est exceptionnellement élevée. Et toujours misez un montant cohérent avec la story que vous racontez.
        </p>
      </div>
    </LevelModuleLayout>
  );
}

// ── QUIZ MODULE ───────────────────────────────────────────────────────────────

function IntermQuizModule({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const questions = QUIZ_QUESTIONS.filter(q => q.level === 'intermediaire');
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
    if (current < questions.length - 1) { setCurrent(c => c + 1); setSelected(null); }
    else setFinished(true);
  };

  return (
    <LevelModuleLayout title="Quiz Intermédiaire" icon="🏆" color="#3498db" onBack={onBack} onComplete={onComplete}>
      {finished ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">{score === questions.length ? '🏆' : '🎯'}</div>
          <h2 className="text-3xl font-bold text-white mb-2">{score}/{questions.length}</h2>
          <p className="text-gray-400 mb-6">{score === questions.length ? 'Parfait !' : 'Continuez à pratiquer.'}</p>
          <button onClick={onComplete} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            Terminer le module ✓
          </button>
        </div>
      ) : (
        <div>
          <div className="text-sm text-gray-500 mb-3">Question {current + 1}/{questions.length}</div>
          <h2 className="text-lg font-bold text-white mb-5">{q.question}</h2>
          <div className="space-y-3 mb-5">
            {q.options.map((opt, i) => {
              let cls = 'border-white/10 bg-white/5';
              if (selected !== null) cls = i === q.correctIndex ? 'border-green-500 bg-green-900/30' : i === selected ? 'border-red-500 bg-red-900/30' : 'border-white/5 bg-white/3 opacity-50';
              return (
                <button key={i} onClick={() => handleAnswer(i)} className={`w-full text-left p-3 rounded-xl border transition-all ${cls}`}>
                  <span className="text-gray-300 text-sm">{opt}</span>
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 rounded-xl border mb-4 ${selected === q.correctIndex ? 'bg-green-900/20 border-green-600/30' : 'bg-red-900/20 border-red-600/30'}`}>
                <p className="text-gray-300 text-sm">{q.explanation}</p>
              </motion.div>
            </AnimatePresence>
          )}
          {selected !== null && (
            <button onClick={next} className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors">
              {current === questions.length - 1 ? 'Voir les résultats' : 'Question suivante'}
            </button>
          )}
        </div>
      )}
    </LevelModuleLayout>
  );
}

// ── SHARED LAYOUT ─────────────────────────────────────────────────────────────

function LevelModuleLayout({ children, title, icon, color, onBack, onComplete }: {
  children: React.ReactNode; title: string; icon: string; color: string;
  onBack: () => void; onComplete: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#060d08]">
      <Navigation />
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">
              <ChevronLeft size={16} /> Retour
            </button>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">{icon}</span>
              <h1 className="text-xl font-bold" style={{ color }}>{title}</h1>
            </div>
            <div className="bg-[#0a1410] border border-white/10 rounded-2xl p-6 min-h-[400px] mb-4">
              {children}
            </div>
            <button onClick={onComplete} className="w-full py-3 rounded-xl font-bold text-white transition-all" style={{ background: color }}>
              ✓ Module terminé
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
