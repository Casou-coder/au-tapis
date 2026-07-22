'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Grid3x3, Coins, Brain, Target, TrendingUp, ChevronRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

// ─── Types ───────────────────────────────────────────────────────────────────

type ToolId = 'texture' | 'bankroll' | 'bounty' | 'ranges' | 'equity-quiz' | 'objectifs';

interface Tool {
  id: ToolId;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  tag?: string;
}

const TOOLS: Tool[] = [
  { id: 'texture', title: 'Texture de Board', description: 'Analysez n\'importe quel flop : sécheresse, draws possibles, avantage de range.', icon: <Grid3x3 size={20} />, category: 'Équité', tag: 'Nouveau' },
  { id: 'equity-quiz', title: 'Estimateur d\'Équité', description: 'Entraînez votre intuition en estimant l\'équité de matchups classiques.', icon: <Target size={20} />, category: 'Équité' },
  { id: 'bounty', title: 'Convertisseur Bounty KO', description: 'Calculez la valeur réelle d\'une prime en tournoi PKO et son impact sur vos décisions.', icon: <Coins size={20} />, category: 'Tournoi' },
  { id: 'ranges', title: 'Constructeur de Range', description: 'Construisez et visualisez vos ranges preflop sur la grille 13×13.', icon: <Grid3x3 size={20} />, category: 'Ranges' },
  { id: 'bankroll', title: 'Calculateur de Bankroll', description: 'Trouvez la limite adaptée à votre bankroll et votre profil de risque.', icon: <TrendingUp size={20} />, category: 'Mental & Gestion' },
  { id: 'objectifs', title: 'Mes Objectifs Poker', description: 'Définissez vos objectifs et générez un plan de progression personnalisé.', icon: <Brain size={20} />, category: 'Mental & Gestion' },
];

const CATEGORIES = ['Tous', 'Équité', 'Tournoi', 'Ranges', 'Mental & Gestion'];

// ─── Board Texture Tool ──────────────────────────────────────────────────────

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS = ['♠', '♥', '♦', '♣'];

function BoardCard({ value, onRemove }: { value: string; onRemove: () => void }) {
  const suit = value.slice(-1);
  const rank = value.slice(0, -1);
  const isRed = suit === '♥' || suit === '♦';
  return (
    <button onClick={onRemove} className="group relative w-10 h-14 rounded-lg bg-white flex flex-col items-center justify-center shadow-lg hover:opacity-80 transition-opacity">
      <span className={`text-xs font-bold leading-none ${isRed ? 'text-red-600' : 'text-gray-900'}`}>{rank}</span>
      <span className={`text-base leading-none ${isRed ? 'text-red-600' : 'text-gray-900'}`}>{suit}</span>
      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-xs items-center justify-center hidden group-hover:flex">×</span>
    </button>
  );
}

function analyzeBoard(cards: string[]) {
  if (cards.length < 3) return null;
  const suits = cards.map(c => c.slice(-1));
  const ranks = cards.map(c => {
    const r = c.slice(0, -1);
    return RANKS.indexOf(r);
  });

  const suitCounts: Record<string, number> = {};
  suits.forEach(s => { suitCounts[s] = (suitCounts[s] || 0) + 1; });
  const maxSuit = Math.max(...Object.values(suitCounts));

  const sortedRanks = [...ranks].sort((a, b) => a - b);
  const gaps = sortedRanks.slice(1).map((r, i) => r - sortedRanks[i]);
  const maxGap = Math.max(...gaps);
  const hasConnected = gaps.some(g => g === 1);
  const hasOneGap = gaps.some(g => g === 2);

  const highCards = ranks.filter(r => r <= 3).length; // A, K, Q, J

  let wetness = 0;
  if (maxSuit >= 2) wetness += 2;
  if (maxSuit >= 3) wetness += 2;
  if (hasConnected) wetness += 3;
  if (hasOneGap) wetness += 1;
  if (highCards === 0) wetness += 1;

  const texture = wetness >= 6 ? 'Très humide' : wetness >= 4 ? 'Humide' : wetness >= 2 ? 'Moyen' : 'Sec';
  const textureColor = wetness >= 6 ? '#ef4444' : wetness >= 4 ? '#f97316' : wetness >= 2 ? '#eab308' : '#22c55e';

  const flushDraw = maxSuit === 2 ? 'Bicolore (flush draw possible)' : maxSuit === 3 ? 'Tricolore (flush draw fort)' : 'Rainbow (pas de flush draw)';
  const straightDraw = hasConnected ? 'OE Straight Draw possible' : hasOneGap ? 'Gutshot draw possible' : maxGap <= 4 ? 'Quelques draws' : 'Pas de draw direct';

  const topRankIdx = Math.min(...ranks);
  const topRank = RANKS[topRankIdx];

  const rangeAdvantage = highCards >= 2 ? 'Avantage pour le 3-betteur (plus de broadways)' :
    ranks.some(r => r >= 8) ? 'Avantage pour le défenseur de blind (plus de paires connectées)' :
    'Advantage modéré — dépend des positions';

  return { texture, textureColor, wetness, flushDraw, straightDraw, topRank, rangeAdvantage, highCards };
}

function BoardTextureTool() {
  const [board, setBoard] = useState<string[]>([]);
  const [pickRank, setPickRank] = useState<string | null>(null);
  const usedCards = new Set(board);

  function addCard(suit: string) {
    if (!pickRank || board.length >= 5) return;
    const card = pickRank + suit;
    if (usedCards.has(card)) return;
    setBoard(prev => [...prev, card]);
    setPickRank(null);
  }

  const analysis = analyzeBoard(board);

  return (
    <div className="space-y-5">
      {/* Board display */}
      <div>
        <p className="text-gray-400 text-sm mb-2">Board (3 à 5 cartes) — cliquez pour retirer</p>
        <div className="flex gap-2 items-center min-h-[56px] flex-wrap">
          {board.map((c, i) => <BoardCard key={i} value={c} onRemove={() => setBoard(prev => prev.filter((_, j) => j !== i))} />)}
          {board.length < 5 && (
            <button onClick={() => setPickRank(null)} className="w-10 h-14 rounded-lg border-2 border-dashed border-white/20 text-gray-600 text-xl hover:border-yellow-500/50 hover:text-yellow-500 transition-colors">
              +
            </button>
          )}
        </div>
      </div>

      {/* Card picker */}
      {board.length < 5 && (
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {!pickRank ? (
            <>
              <p className="text-gray-400 text-xs mb-2">1. Choisissez une valeur</p>
              <div className="flex flex-wrap gap-1.5">
                {RANKS.map(r => (
                  <button key={r} onClick={() => setPickRank(r)}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all">
                    {r}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-xs mb-2">2. Choisissez une couleur pour le <strong className="text-white">{pickRank}</strong></p>
              <div className="flex gap-3">
                {SUITS.map(s => {
                  const card = pickRank + s;
                  const used = usedCards.has(card);
                  const isRed = s === '♥' || s === '♦';
                  return (
                    <button key={s} onClick={() => addCard(s)} disabled={used}
                      className={`w-12 h-16 rounded-lg font-bold text-xl flex flex-col items-center justify-center transition-all ${used ? 'opacity-20 cursor-not-allowed bg-white/5' : 'bg-white hover:scale-105'} ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
                      <span className="text-xs leading-none">{pickRank}</span>
                      <span className="text-lg leading-none">{s}</span>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setPickRank(null)} className="mt-2 text-gray-500 text-xs hover:text-gray-300 transition-colors">← Annuler</button>
            </>
          )}
        </div>
      )}

      {/* Analysis */}
      {analysis && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="rounded-xl p-4" style={{ background: analysis.textureColor + '15', border: `1px solid ${analysis.textureColor}30` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold">Texture : {analysis.texture}</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-sm" style={{ background: i < analysis.wetness / 2 ? analysis.textureColor : 'rgba(255,255,255,0.1)' }} />
                ))}
              </div>
            </div>
          </div>

          {[
            { label: 'Top Pair', value: analysis.topRank },
            { label: 'Flush Draw', value: analysis.flushDraw },
            { label: 'Straight Draw', value: analysis.straightDraw },
            { label: 'Range Advantage', value: analysis.rangeAdvantage },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start text-sm py-2 border-b border-white/5">
              <span className="text-gray-400 w-36 shrink-0">{label}</span>
              <span className="text-gray-200 text-right">{value}</span>
            </div>
          ))}

          <button onClick={() => { setBoard([]); setPickRank(null); }}
            className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
            Réinitialiser
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Equity Quiz ─────────────────────────────────────────────────────────────

const EQUITY_MATCHUPS = [
  { hero: ['A♠', 'A♦'], villain: ['K♠', 'K♦'], equity: 82, label: 'AA vs KK' },
  { hero: ['A♠', 'K♠'], villain: ['Q♦', 'Q♣'], equity: 46, label: 'AKs vs QQ' },
  { hero: ['7♠', '7♦'], villain: ['A♣', 'K♦'], equity: 55, label: '77 vs AKo' },
  { hero: ['J♠', 'T♠'], villain: ['A♦', 'A♣'], equity: 23, label: 'JTs vs AA' },
  { hero: ['A♣', 'Q♦'], villain: ['A♠', 'K♠'], equity: 28, label: 'AQo vs AKs' },
  { hero: ['5♣', '5♦'], villain: ['A♠', 'K♣'], equity: 55, label: '55 vs AKo' },
  { hero: ['K♣', 'Q♠'], villain: ['J♦', 'J♣'], equity: 44, label: 'KQo vs JJ' },
  { hero: ['9♦', '8♦'], villain: ['A♣', 'A♥'], equity: 21, label: '98s vs AA' },
  { hero: ['A♦', 'J♦'], villain: ['K♠', 'Q♣'], equity: 60, label: 'AJs vs KQo' },
  { hero: ['2♣', '2♦'], villain: ['A♠', 'Q♦'], equity: 50, label: '22 vs AQo' },
];

function CardSmall({ v }: { v: string }) {
  const suit = v.slice(-1);
  const rank = v.slice(0, -1);
  const isRed = suit === '♥' || suit === '♦';
  return (
    <div className={`w-8 h-11 rounded-md bg-white flex flex-col items-center justify-center shadow font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
      <span className="text-[10px] leading-none">{rank}</span>
      <span className="text-sm leading-none">{suit}</span>
    </div>
  );
}

function EquityQuizTool() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * EQUITY_MATCHUPS.length));
  const [guess, setGuess] = useState(50);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState<{ total: number; count: number }>({ total: 0, count: 0 });

  const matchup = EQUITY_MATCHUPS[idx];
  const diff = Math.abs(guess - matchup.equity);
  const pts = Math.max(0, 100 - diff * 3);

  function reveal() {
    setRevealed(true);
    setScore(s => ({ total: s.total + pts, count: s.count + 1 }));
  }

  function next() {
    let next = Math.floor(Math.random() * EQUITY_MATCHUPS.length);
    while (next === idx) next = Math.floor(Math.random() * EQUITY_MATCHUPS.length);
    setIdx(next);
    setGuess(50);
    setRevealed(false);
  }

  return (
    <div className="space-y-5">
      {score.count > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Score moyen</span>
          <span className="text-yellow-400 font-bold">{Math.round(score.total / score.count)}/100</span>
        </div>
      )}

      <div className="rounded-xl p-5 text-center" style={{ background: '#1a4a2e55', border: '1px solid #1a4a2e' }}>
        <p className="text-gray-400 text-xs mb-4">Estimez l'équité de HERO preflop</p>
        <div className="flex items-center justify-center gap-8">
          <div>
            <p className="text-green-400 text-xs mb-2">HERO</p>
            <div className="flex gap-1.5">{matchup.hero.map((c, i) => <CardSmall key={i} v={c} />)}</div>
          </div>
          <span className="text-gray-500 font-bold">VS</span>
          <div>
            <p className="text-red-400 text-xs mb-2">VILLAIN</p>
            <div className="flex gap-1.5">{matchup.villain.map((c, i) => <CardSmall key={i} v={c} />)}</div>
          </div>
        </div>
      </div>

      {!revealed ? (
        <>
          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Votre estimation</span>
              <span className="text-white font-bold">{guess}%</span>
            </div>
            <input type="range" min={0} max={100} value={guess} onChange={e => setGuess(Number(e.target.value))}
              className="w-full accent-yellow-500" />
            <div className="flex justify-between text-xs text-gray-600 mt-1"><span>0%</span><span>50%</span><span>100%</span></div>
          </div>
          <button onClick={reveal}
            className="w-full py-3 rounded-xl font-bold text-sm text-black"
            style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}>
            Révéler l'équité réelle
          </button>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="rounded-xl p-4" style={{ background: pts >= 80 ? '#22c55e15' : pts >= 50 ? '#eab30815' : '#ef444415', border: `1px solid ${pts >= 80 ? '#22c55e30' : pts >= 50 ? '#eab30830' : '#ef444430'}` }}>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Équité réelle : <strong className="text-white">{matchup.equity}%</strong></span>
              <span className="text-gray-300">Votre estimation : <strong className="text-white">{guess}%</strong></span>
            </div>
            <div className="h-2 rounded-full bg-white/10 mb-2">
              <div className="h-full rounded-full" style={{ width: `${matchup.equity}%`, background: '#22c55e' }} />
            </div>
            <p className={`text-sm font-bold ${pts >= 80 ? 'text-green-400' : pts >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {pts >= 80 ? '🎯 Excellent !' : pts >= 50 ? '👍 Pas mal !' : '📚 À travailler'} — {pts}/100 pts (écart : {diff}%)
            </p>
          </div>
          <button onClick={next}
            className="w-full py-3 rounded-xl font-bold text-sm text-black"
            style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}>
            Prochain matchup →
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── KO Bounty Calculator ────────────────────────────────────────────────────

function BountyTool() {
  const [buyin, setBuyin] = useState(50);
  const [bounty, setBounty] = useState(25);
  const [stacksBB, setStacksBB] = useState(30);
  const [bountyCollected, setBountyCollected] = useState(0);

  const effectiveBounty = bountyCollected > 0
    ? bounty * (1 + bountyCollected * 0.5)
    : bounty;

  const bountyInBB = (effectiveBounty / buyin) * 100;
  const callThreshold = bountyInBB / stacksBB;
  const expandedRange = callThreshold > 0.3 ? 'Large (55+, A9o+, KTo+)' : callThreshold > 0.15 ? 'Normale (+10% combos)' : 'Peu modifiée';

  return (
    <div className="space-y-4">
      {[
        { label: 'Buy-in total (€)', value: buyin, set: setBuyin, min: 5, max: 5000, step: 5 },
        { label: 'Prime de base (€)', value: bounty, set: setBounty, min: 1, max: 2500, step: 5 },
        { label: 'Taille des stacks (BB)', value: stacksBB, set: setStacksBB, min: 5, max: 200, step: 5 },
        { label: 'Primes déjà collectées', value: bountyCollected, set: setBountyCollected, min: 0, max: 10, step: 1 },
      ].map(({ label, value, set, min, max, step }) => (
        <div key={label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">{label}</span>
            <span className="text-white font-mono">{label.includes('€') ? `${value}€` : value}</span>
          </div>
          <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))}
            className="w-full accent-yellow-500" />
        </div>
      ))}

      <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h4 className="text-white font-semibold text-sm mb-3">Résultats</h4>
        {[
          { label: 'Prime effective', value: `${effectiveBounty.toFixed(2)}€`, note: bountyCollected > 0 ? '(progressive)' : '' },
          { label: 'Prime en BB', value: `${bountyInBB.toFixed(1)} BB`, note: 'valeur lors d\'un all-in' },
          { label: 'Impact sur call range', value: expandedRange, note: '' },
          { label: 'Seuil de profitabilité', value: `${(callThreshold * 100).toFixed(0)}% equity min.`, note: 'pour appeler un push' },
        ].map(({ label, value, note }) => (
          <div key={label} className="flex justify-between items-start text-sm py-1.5 border-b border-white/5 last:border-0">
            <span className="text-gray-400">{label}</span>
            <span className="text-right">
              <span className="text-white font-medium">{value}</span>
              {note && <span className="text-gray-500 text-xs ml-1">{note}</span>}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-3 bg-yellow-500/10 border border-yellow-500/20 text-xs text-gray-300">
        💡 En PKO progressif, la prime double à chaque élimination. Appeler un push devient profitable plus tôt quand la prime est élevée.
      </div>
    </div>
  );
}

// ─── Range Builder ───────────────────────────────────────────────────────────

const RANGE_RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const COMBOS: Record<string, number> = {};
RANGE_RANKS.forEach((r1, i) => {
  RANGE_RANKS.forEach((r2, j) => {
    if (i === j) COMBOS[r1 + r2] = 6; // paires
    else if (i < j) COMBOS[r1 + r2 + 's'] = 4; // suited
    else COMBOS[r2 + r1 + 'o'] = 12; // offsuit
  });
});

const TOTAL_COMBOS = 1326;

function RangeBuilder() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dragging, setDragging] = useState(false);

  function getCellKey(i: number, j: number): string {
    const r1 = RANGE_RANKS[i], r2 = RANGE_RANKS[j];
    if (i === j) return r1 + r2;
    if (i < j) return r1 + r2 + 's';
    return r2 + r1 + 'o';
  }

  function toggle(key: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const totalCombos = [...selected].reduce((sum, k) => sum + (COMBOS[k] ?? 0), 0);
  const pct = ((totalCombos / TOTAL_COMBOS) * 100).toFixed(1);

  function loadPreset(preset: string) {
    const presets: Record<string, string[]> = {
      '': [],
      'UTG': ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AQs', 'AJs', 'KQs', 'AKo', 'AQo'],
      'BTN': ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'T9s', '98s', '87s', '76s', '65s', 'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', 'QJo'],
      '3-bet': ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AQs', 'AKo', 'A5s', 'A4s'],
    };
    setSelected(new Set(presets[preset] || []));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-gray-400 text-xs">Preset :</span>
        {['UTG', 'BTN', '3-bet'].map(p => (
          <button key={p} onClick={() => loadPreset(p)}
            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs hover:bg-white/10 transition-colors">
            {p}
          </button>
        ))}
        <button onClick={() => setSelected(new Set())} className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-colors">
          Reset
        </button>
        <span className="ml-auto text-yellow-400 font-bold text-sm">{pct}% — {totalCombos} combos</span>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="grid" style={{ gridTemplateColumns: `repeat(13, minmax(0, 1fr))`, gap: '2px' }}>
            {RANGE_RANKS.map((_, i) =>
              RANGE_RANKS.map((_, j) => {
                const key = getCellKey(i, j);
                const isSel = selected.has(key);
                const isPair = i === j;
                const isSuited = i < j;
                const bg = isSel ? (isPair ? '#eab308' : isSuited ? '#3b82f6' : '#6b7280') : 'rgba(255,255,255,0.06)';
                return (
                  <button
                    key={`${i}-${j}`}
                    onMouseDown={() => { setDragging(true); toggle(key); }}
                    onMouseEnter={() => { if (dragging) toggle(key); }}
                    onMouseUp={() => setDragging(false)}
                    title={key}
                    className="w-7 h-7 rounded-sm text-[9px] font-bold transition-colors hover:opacity-80 select-none"
                    style={{ background: bg, color: isSel ? '#000' : '#4b5563' }}
                  >
                    {key.replace('o', '').replace('s', '')}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: '#eab308', display: 'inline-block' }} />Paires</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: '#3b82f6', display: 'inline-block' }} />Suited</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm" style={{ background: '#6b7280', display: 'inline-block' }} />Offsuit</span>
      </div>
    </div>
  );
}

// ─── Bankroll Calculator ─────────────────────────────────────────────────────

const STAKES = [
  { label: 'NL2 (0.01/0.02€)', bi: 2, level: 'Grand Débutant' },
  { label: 'NL5 (0.02/0.05€)', bi: 5, level: 'Débutant' },
  { label: 'NL10 (0.05/0.10€)', bi: 10, level: 'Intermédiaire' },
  { label: 'NL25 (0.10/0.25€)', bi: 25, level: 'Intermédiaire+' },
  { label: 'NL50 (0.25/0.50€)', bi: 50, level: 'Avancé' },
  { label: 'NL100 (0.50/1€)', bi: 100, level: 'Expert' },
  { label: 'NL200 (1/2€)', bi: 200, level: 'Semi-Pro' },
];

function BankrollTool() {
  const [bankroll, setBankroll] = useState(200);
  const [risk, setRisk] = useState<'safe' | 'normal' | 'agg'>('normal');
  const [winrate, setWinrate] = useState(5);

  const biNeeded = risk === 'safe' ? 40 : risk === 'normal' ? 25 : 15;

  const recommended = STAKES.filter(s => bankroll >= s.bi * biNeeded);
  const current = recommended[recommended.length - 1];
  const moveUp = STAKES.find(s => s.bi * biNeeded > bankroll && s.bi * biNeeded <= bankroll * 2);

  const hoursToMoveUp = moveUp && winrate > 0
    ? Math.round(((moveUp.bi * biNeeded - bankroll) / (winrate / 100 * (current?.bi ?? 10) * 100)) * 100) / 100
    : null;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Ma bankroll</span>
          <span className="text-white font-mono">{bankroll}€</span>
        </div>
        <input type="range" min={20} max={10000} step={20} value={bankroll} onChange={e => setBankroll(Number(e.target.value))} className="w-full accent-yellow-500" />
      </div>

      <div>
        <p className="text-gray-400 text-sm mb-2">Profil de risque</p>
        <div className="flex gap-2">
          {([['safe', '🛡 Conservateur', '40 BI'], ['normal', '⚖ Normal', '25 BI'], ['agg', '🔥 Agressif', '15 BI']] as const).map(([val, label, bi]) => (
            <button key={val} onClick={() => setRisk(val)}
              className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
              style={{ background: risk === val ? '#c9a84c20' : 'rgba(255,255,255,0.05)', border: `1px solid ${risk === val ? '#c9a84c50' : 'rgba(255,255,255,0.1)'}`, color: risk === val ? '#c9a84c' : '#6b7280' }}>
              {label}<br /><span className="opacity-60">{bi}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Win rate estimé</span>
          <span className="text-white font-mono">{winrate} BB/100</span>
        </div>
        <input type="range" min={0} max={20} step={1} value={winrate} onChange={e => setWinrate(Number(e.target.value))} className="w-full accent-yellow-500" />
      </div>

      {current && (
        <div className="rounded-xl p-4 space-y-2" style={{ background: '#c9a84c15', border: '1px solid #c9a84c30' }}>
          <p className="text-yellow-400 font-bold text-sm">✅ Limite recommandée</p>
          <p className="text-white font-bold">{current.label}</p>
          <p className="text-gray-400 text-xs">Niveau : {current.level} — {biNeeded} buy-ins minimum</p>
          {moveUp && <p className="text-gray-300 text-xs mt-1">Prochain palier : {moveUp.label} à {moveUp.bi * biNeeded}€ de bankroll</p>}
          {hoursToMoveUp && winrate > 0 && (
            <p className="text-gray-400 text-xs">Environ {hoursToMoveUp}h de jeu pour monter (à {winrate} BB/100)</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Objectifs ───────────────────────────────────────────────────────────────

function ObjectifsTool() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const questions = [
    { key: 'level', label: 'Ton niveau actuel ?', options: ['Grand débutant', 'Débutant', 'Intermédiaire', 'Avancé', 'Expert'] },
    { key: 'goal', label: 'Ton objectif principal ?', options: ['Battre mes amis', 'Être profitable en cash game', 'Finir ITM en tournoi', 'Devenir semi-pro', 'WSOP / EPT'] },
    { key: 'time', label: 'Heures d\'étude par semaine ?', options: ['< 1h', '1-3h', '3-7h', '7h+'] },
    { key: 'weakness', label: 'Ta plus grande faiblesse ?', options: ['Calculs de pot odds', 'Lecture des adversaires', 'Gestion du tilt', 'Stratégie post-flop', 'Sélection de mains'] },
  ];

  const plans: Record<string, string[]> = {
    'Grand débutant': ['Maîtriser les 10 forces de mains', 'Jouer uniquement les meilleures mains preflop (top 15%)', 'Apprendre les pot odds basiques'],
    'Débutant': ['Finir le niveau Débutant d\'Au Tapis', 'Faire 5000 mains en NL2', 'Étudier les positions et la sélection de mains'],
    'Intermédiaire': ['Intégrer les calculs EV dans chaque décision', 'Analyser 3 sessions par semaine', 'Travailler la c-bet selectivité'],
    'Avancé': ['Commencer l\'analyse solver', 'Étudier les ranges GTO preflop', 'Travailler les spots ICM en tournoi'],
    'Expert': ['Run It Once Elite membership', 'Review de sessions avec un tracker (HM3/PT4)', 'Étudier GTO Wizard tous les jours'],
  };

  if (done) {
    const plan = plans[answers.level] ?? [];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="rounded-xl p-4" style={{ background: '#1a4a2e55', border: '1px solid #1a4a2e' }}>
          <p className="text-green-400 font-bold mb-3">🎯 Ton plan personnalisé</p>
          <div className="space-y-2">
            {plan.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-yellow-400 mt-0.5">{i + 1}.</span>
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-gray-400 space-y-1">
          <p>Objectif : <span className="text-white">{answers.goal}</span></p>
          <p>Faiblesse : <span className="text-white">{answers.weakness}</span></p>
          <p>Temps : <span className="text-white">{answers.time} d'étude/semaine</span></p>
        </div>
        <button onClick={() => { setStep(0); setAnswers({}); setDone(false); }} className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
          Recommencer
        </button>
      </motion.div>
    );
  }

  const q = questions[step];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 mb-2">
        {questions.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i <= step ? '#c9a84c' : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>
      <p className="text-white font-semibold text-sm">{q.label}</p>
      <div className="space-y-2">
        {q.options.map(opt => (
          <button key={opt} onClick={() => {
            setAnswers(prev => ({ ...prev, [q.key]: opt }));
            if (step < questions.length - 1) setStep(s => s + 1);
            else setDone(true);
          }}
            className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TOOL_COMPONENTS: Record<ToolId, React.ReactNode> = {
  texture: <BoardTextureTool />,
  'equity-quiz': <EquityQuizTool />,
  bounty: <BountyTool />,
  ranges: <RangeBuilder />,
  bankroll: <BankrollTool />,
  objectifs: <ObjectifsTool />,
};

export default function OutilsPage() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  const filtered = activeCategory === 'Tous' ? TOOLS : TOOLS.filter(t => t.category === activeCategory);
  const activeMeta = TOOLS.find(t => t.id === activeTool);

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Outils Poker
          </h1>
          <p className="text-gray-400">Calculateurs, analyseurs et entraîneurs pour améliorer votre jeu — directement dans le navigateur.</p>
        </motion.div>

        {/* Also link to existing calculator */}
        <div className="mb-6 p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <Calculator size={18} className="text-yellow-400" />
            <div>
              <p className="text-white text-sm font-semibold">Calculatrice d'Équité Monte Carlo</p>
              <p className="text-gray-500 text-xs">Simulez l'équité de deux mains avec 2000 runouts</p>
            </div>
          </div>
          <Link href="/calculateur" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-black" style={{ background: 'linear-gradient(to right, #ca8a04, #eab308)' }}>
            Ouvrir <ChevronRight size={13} />
          </Link>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{ background: activeCategory === cat ? '#c9a84c20' : 'rgba(255,255,255,0.05)', border: `1px solid ${activeCategory === cat ? '#c9a84c50' : 'rgba(255,255,255,0.1)'}`, color: activeCategory === cat ? '#c9a84c' : '#6b7280' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Tools grid */}
        {!activeTool ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tool, i) => (
              <motion.button
                key={tool.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTool(tool.id)}
                className="text-left p-5 rounded-2xl transition-all group"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-yellow-400" style={{ background: '#c9a84c20' }}>
                    {tool.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tool.tag && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20">{tool.tag}</span>}
                    <span className="text-xs text-gray-600">{tool.category}</span>
                  </div>
                </div>
                <p className="text-white font-semibold text-sm mb-1 group-hover:text-yellow-400 transition-colors">{tool.title}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{tool.description}</p>
                <div className="flex items-center gap-1 mt-3 text-yellow-500/60 text-xs group-hover:text-yellow-400 transition-colors">
                  Ouvrir <ChevronRight size={12} />
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-white transition-colors text-sm">
                ← Retour
              </button>
              <span className="text-gray-600">/</span>
              <span className="text-white font-semibold text-sm">{activeMeta?.title}</span>
            </div>

            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-yellow-400" style={{ background: '#c9a84c20' }}>
                  {activeMeta?.icon}
                </div>
                <div>
                  <h2 className="text-white font-bold">{activeMeta?.title}</h2>
                  <p className="text-gray-500 text-xs">{activeMeta?.description}</p>
                </div>
              </div>
              {TOOL_COMPONENTS[activeTool]}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
