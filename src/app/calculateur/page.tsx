'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { ChevronLeft, RefreshCw, Info } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PokerCard from '@/components/PokerCard';
import { Card, Rank, Suit, OUTS_TABLE } from '@/lib/poker-data';

// ── TYPES ─────────────────────────────────────────────────────────────────────

type Street = 'preflop' | 'flop' | 'turn' | 'river';

const RANKS: Rank[] = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const SUIT_COLORS: Record<Suit, string> = { '♠': 'text-gray-900', '♥': 'text-red-500', '♦': 'text-red-500', '♣': 'text-gray-900' };

function makeCard(rank: Rank, suit: Suit): Card {
  return { rank, suit, isRed: suit === '♥' || suit === '♦' };
}

// ── EQUITY CALCULATION ────────────────────────────────────────────────────────

function rankValue(r: Rank): number {
  return ['2','3','4','5','6','7','8','9','10','J','Q','K','A'].indexOf(r);
}

function handScore(hole: Card[], board: Card[]): number {
  const all = [...hole, ...board];
  const combos = getCombinations(all, 5);
  return Math.max(...combos.map(scoreHand));
}

function getCombinations(arr: Card[], k: number): Card[][] {
  if (k === 0) return [[]];
  if (arr.length === 0) return [];
  const [first, ...rest] = arr;
  const withFirst = getCombinations(rest, k - 1).map(c => [first, ...c]);
  const withoutFirst = getCombinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

function scoreHand(cards: Card[]): number {
  const suits = cards.map(c => c.suit);
  const rankVals = cards.map(c => rankValue(c.rank)).sort((a, b) => b - a);
  const isFlush = new Set(suits).size === 1;
  const gaps = rankVals.slice(0, -1).map((r, i) => r - rankVals[i + 1]);
  const isStraight = gaps.every(g => g === 1) || (rankVals[0] === 12 && rankVals[1] === 3 && gaps.slice(1).every(g => g === 1));
  const counts = Object.values(rankVals.reduce((acc: Record<number, number>, r) => { acc[r] = (acc[r] || 0) + 1; return acc; }, {})).sort((a, b) => b - a);
  const topRank = rankVals[0];
  const encode = (base: number) => base * 1e10 + rankVals.reduce((acc, r, i) => acc + r * Math.pow(15, 4 - i), 0);

  if (isFlush && isStraight) return encode(counts[0] === 4 ? 7 : 8);
  if (counts[0] === 4) return encode(7);
  if (counts[0] === 3 && counts[1] === 2) return encode(6);
  if (isFlush) return encode(5);
  if (isStraight) return encode(4);
  if (counts[0] === 3) return encode(3);
  if (counts[0] === 2 && counts[1] === 2) return encode(2);
  if (counts[0] === 2) return encode(1);
  return encode(0);
}

function monteCarloEquity(hero: Card[], villain: Card[], board: Card[], simulations = 1000): number {
  if (hero.length < 2 || villain.length < 2) return 50;

  const used = new Set([...hero, ...villain, ...board].map(c => c.rank + c.suit));
  const deck: Card[] = [];
  for (const rank of RANKS) {
    for (const suit of SUITS) {
      const key = rank + suit;
      if (!used.has(key)) deck.push(makeCard(rank, suit));
    }
  }

  const needed = 5 - board.length;
  let wins = 0;

  for (let i = 0; i < simulations; i++) {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    const runout = shuffled.slice(0, needed);
    const finalBoard = [...board, ...runout];
    const heroScore = handScore(hero, finalBoard);
    const villainScore = handScore(villain, finalBoard);
    if (heroScore > villainScore) wins++;
    else if (heroScore === villainScore) wins += 0.5;
  }

  return Math.round((wins / simulations) * 100);
}

// ── CARD PICKER ───────────────────────────────────────────────────────────────

function CardPicker({ value, onChange, usedCards, label }: {
  value: Card | null;
  onChange: (c: Card | null) => void;
  usedCards: Card[];
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null);

  const isUsed = (r: Rank, s: Suit) =>
    usedCards.some(c => c !== value && c.rank === r && c.suit === s);

  const pick = (rank: Rank, suit: Suit) => {
    if (isUsed(rank, suit)) return;
    onChange(makeCard(rank, suit));
    setOpen(false);
    setSelectedRank(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative"
        aria-label={label}
      >
        {value ? (
          <div className="w-12 h-16 bg-white rounded-lg border-2 border-green-400 flex flex-col justify-between p-0.5 shadow-lg hover:border-green-300 transition-colors">
            <div className={`text-xs font-bold leading-none ${SUIT_COLORS[value.suit]}`}>
              <div>{value.rank}</div>
              <div>{value.suit}</div>
            </div>
            <div className={`text-xl text-center leading-none ${SUIT_COLORS[value.suit]}`}>{value.suit}</div>
          </div>
        ) : (
          <div className="w-12 h-16 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center text-gray-600 hover:border-white/40 transition-colors text-xl">
            +
          </div>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2 bg-[#0d1a10] border border-white/20 rounded-xl p-3 shadow-2xl w-64"
          >
            {/* Clear button */}
            {value && (
              <button onClick={() => { onChange(null); setOpen(false); }}
                className="w-full mb-2 py-1 text-xs text-red-400 border border-red-800/30 rounded-lg hover:bg-red-900/20 transition-colors">
                ✕ Retirer la carte
              </button>
            )}

            {!selectedRank ? (
              <>
                <p className="text-gray-500 text-xs mb-2 text-center">Choisissez un rang</p>
                <div className="grid grid-cols-7 gap-1">
                  {RANKS.map(r => (
                    <button key={r} onClick={() => setSelectedRank(r)}
                      className="py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors">
                      {r}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button onClick={() => setSelectedRank(null)}
                  className="flex items-center gap-1 text-gray-400 text-xs mb-2 hover:text-white transition-colors">
                  ← {selectedRank}
                </button>
                <p className="text-gray-500 text-xs mb-2 text-center">Choisissez une couleur</p>
                <div className="grid grid-cols-4 gap-2">
                  {SUITS.map(s => {
                    const used = isUsed(selectedRank, s);
                    return (
                      <button key={s} onClick={() => pick(selectedRank, s)} disabled={used}
                        className={`py-3 rounded-xl text-2xl font-bold transition-all ${
                          used ? 'opacity-20 cursor-not-allowed bg-white/5' :
                          'bg-white/10 hover:bg-white/20 cursor-pointer'
                        } ${SUIT_COLORS[s]}`}
                        style={{ color: s === '♥' || s === '♦' ? '#e74c3c' : '#ecf0f1' }}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── MAIN CALCULATOR ───────────────────────────────────────────────────────────

export default function CalculateurPage() {
  const [heroHand, setHeroHand] = useState<[Card | null, Card | null]>([null, null]);
  const [villainHand, setVillainHand] = useState<[Card | null, Card | null]>([null, null]);
  const [board, setBoard] = useState<(Card | null)[]>([null, null, null, null, null]);
  const [equity, setEquity] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [tab, setTab] = useState<'equity' | 'outs' | 'odds'>('equity');

  const allCards = [...heroHand, ...villainHand, ...board].filter(Boolean) as Card[];

  const setBoard1 = (i: number, card: Card | null) => {
    setBoard(prev => { const next = [...prev]; next[i] = card; return next; });
    setEquity(null);
  };

  const calculate = useCallback(() => {
    const hero = heroHand.filter(Boolean) as Card[];
    const vil = villainHand.filter(Boolean) as Card[];
    const b = board.filter(Boolean) as Card[];
    if (hero.length < 2 || vil.length < 2) return;
    setCalculating(true);
    setTimeout(() => {
      const eq = monteCarloEquity(hero, vil, b, 2000);
      setEquity(eq);
      setCalculating(false);
    }, 50);
  }, [heroHand, villainHand, board]);

  const reset = () => {
    setHeroHand([null, null]);
    setVillainHand([null, null]);
    setBoard([null, null, null, null, null]);
    setEquity(null);
  };

  const heroReady = heroHand.every(Boolean);
  const villainReady = villainHand.every(Boolean);

  return (
    <div className="min-h-screen bg-[#060d08]">
      <Navigation />
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/" className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">
              <ChevronLeft size={16} /> Accueil
            </Link>

            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
              Calculateur Poker
            </h1>
            <p className="text-gray-400 text-sm mb-6">Calculez l&apos;équité, les pot odds et vos outs en temps réel.</p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'equity', label: 'Équité HU', icon: '⚔️' },
                { id: 'outs', label: 'Table des Outs', icon: '🎲' },
                { id: 'odds', label: 'Pot Odds', icon: '📊' },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    tab === t.id ? 'bg-green-700 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* EQUITY TAB */}
            {tab === 'equity' && (
              <div className="space-y-4">
                {/* Hero */}
                <div className="p-5 rounded-2xl bg-blue-900/15 border border-blue-600/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-blue-300">🦸 Hero</h3>
                    {equity !== null && heroReady && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className={`text-2xl font-bold ${equity >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                        {equity}%
                      </motion.div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {([0, 1] as const).map(i => (
                      <CardPicker key={i} value={heroHand[i]}
                        onChange={c => { setHeroHand(prev => { const n: [Card|null,Card|null] = [...prev]; n[i] = c; return n; }); setEquity(null); }}
                        usedCards={allCards} label={`Hero carte ${i+1}`} />
                    ))}
                  </div>
                </div>

                {/* Villain */}
                <div className="p-5 rounded-2xl bg-red-900/15 border border-red-600/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-red-300">🎭 Villain</h3>
                    {equity !== null && villainReady && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className={`text-2xl font-bold ${100 - equity >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                        {100 - equity}%
                      </motion.div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {([0, 1] as const).map(i => (
                      <CardPicker key={i} value={villainHand[i]}
                        onChange={c => { setVillainHand(prev => { const n: [Card|null,Card|null] = [...prev]; n[i] = c; return n; }); setEquity(null); }}
                        usedCards={allCards} label={`Villain carte ${i+1}`} />
                    ))}
                  </div>
                </div>

                {/* Board */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="font-bold text-gray-300 mb-3">🎴 Board (optionnel)</h3>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 1, 2, 3, 4].map(i => (
                      <div key={i}>
                        {i === 3 && <div className="w-px h-full bg-white/10 mx-1" />}
                        <CardPicker value={board[i]} onChange={c => setBoard1(i, c)} usedCards={allCards} label={`Board carte ${i+1}`} />
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs mt-2">Flop = 3 cartes · Turn = 4 cartes · River = 5 cartes</p>
                </div>

                {/* Equity bar */}
                {equity !== null && heroReady && villainReady && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-blue-300">Hero {equity}%</span>
                      <span className="text-red-300">Villain {100 - equity}%</span>
                    </div>
                    <div className="h-4 rounded-full overflow-hidden bg-gray-800 flex">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${equity}%` }}
                        transition={{ duration: 0.6 }} className="h-full bg-gradient-to-r from-blue-700 to-blue-500" />
                      <div className="h-full flex-1 bg-gradient-to-r from-red-700 to-red-500" />
                    </div>
                    <p className="text-center text-gray-500 text-xs mt-2">
                      Calculé par Monte Carlo (2 000 simulations)
                    </p>
                  </motion.div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button onClick={reset} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm">
                    <RefreshCw size={15} /> Réinitialiser
                  </button>
                  <button onClick={calculate} disabled={!heroReady || !villainReady || calculating}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-white transition-all text-sm ${
                      heroReady && villainReady && !calculating
                        ? 'bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500'
                        : 'bg-gray-700 opacity-50 cursor-not-allowed'
                    }`}>
                    {calculating ? '⏳ Calcul en cours...' : '⚡ Calculer l\'équité'}
                  </button>
                </div>

                <div className="flex items-start gap-2 text-xs text-gray-600 bg-white/3 rounded-xl p-3">
                  <Info size={13} className="shrink-0 mt-0.5" />
                  <p>Sélectionnez les 2 cartes Hero et Villain, puis cliquez Calculer. Le board est optionnel — sans board, l&apos;équité est calculée preflop sur toutes les runouts possibles.</p>
                </div>
              </div>
            )}

            {/* OUTS TAB */}
            {tab === 'outs' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-green-900/20 border border-green-600/30 mb-4">
                  <p className="text-green-300 font-medium text-sm mb-1">📐 Règle des 2 et 4</p>
                  <p className="text-gray-300 text-sm">Outs × 4 = équité sur 2 streets · Outs × 2 = équité sur 1 street</p>
                  <p className="text-gray-400 text-xs mt-1">C&apos;est une approximation rapide utilisée par tous les pros en live.</p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5 text-gray-400 text-xs">
                        <th className="text-left py-3 px-4">Outs</th>
                        <th className="text-left py-3 px-4">Turn+River</th>
                        <th className="text-left py-3 px-4">River seul</th>
                        <th className="text-left py-3 px-4">Exemple</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OUTS_TABLE.map((row, i) => (
                        <tr key={i} className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-white/2' : ''}`}>
                          <td className="py-3 px-4">
                            <span className="w-8 h-8 rounded-full bg-green-700/30 text-green-300 font-bold text-sm flex items-center justify-center">
                              {row.outs}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-green-400 font-bold">{row.turnAndRiver}</td>
                          <td className="py-3 px-4 text-blue-400">{row.river}</td>
                          <td className="py-3 px-4 text-gray-500 text-xs">{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[
                    { label: 'Flush draw', outs: 9, color: 'text-blue-400' },
                    { label: 'OESD', outs: 8, color: 'text-green-400' },
                    { label: 'Gutshot', outs: 4, color: 'text-yellow-400' },
                    { label: 'OESD + Flush', outs: 15, color: 'text-red-400' },
                  ].map((item, i) => {
                    const row = OUTS_TABLE.find(r => r.outs === item.outs) || OUTS_TABLE[0];
                    return (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className={`font-bold ${item.color}`}>{item.label}</div>
                        <div className="text-white text-lg font-bold">{row.turnAndRiver}</div>
                        <div className="text-gray-500 text-xs">{item.outs} outs sur 2 streets</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* POT ODDS TAB */}
            {tab === 'odds' && <PotOddsCalculator />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function PotOddsCalculator() {
  const [pot, setPot] = useState(100);
  const [bet, setBet] = useState(50);
  const [equity, setEquity] = useState(30);

  const callTotal = pot + bet;
  const potOdds = Math.round((bet / callTotal) * 100);
  const profitable = equity >= potOdds;
  const evPerBB = ((equity / 100) * callTotal - ((100 - equity) / 100) * bet).toFixed(1);

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl bg-blue-900/15 border border-blue-600/20">
        <h3 className="font-bold text-blue-300 mb-4">Calculateur Pot Odds</h3>
        <div className="space-y-4">
          {[
            { label: 'Taille du pot', value: pot, setter: setPot, min: 10, max: 1000, color: '#3498db', suffix: '€' },
            { label: 'Mise adverse à caller', value: bet, setter: setBet, min: 5, max: Math.max(pot, 5), color: '#e74c3c', suffix: '€' },
            { label: 'Votre équité estimée', value: equity, setter: setEquity, min: 1, max: 99, color: '#27ae60', suffix: '%' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{item.label}</span>
                <span className="font-bold" style={{ color: item.color }}>{item.value}{item.suffix}</span>
              </div>
              <input type="range" min={item.min} max={item.max} value={item.value}
                onChange={e => item.setter(+e.target.value)}
                className="w-full" style={{ accentColor: item.color }} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <div className="text-gray-500 text-xs mb-1">Pot total</div>
          <div className="text-white font-bold text-xl">{callTotal}€</div>
        </div>
        <div className={`p-4 rounded-xl border text-center ${profitable ? 'bg-green-900/20 border-green-600/30' : 'bg-red-900/20 border-red-600/30'}`}>
          <div className="text-gray-500 text-xs mb-1">Pot Odds</div>
          <div className={`font-bold text-xl ${profitable ? 'text-green-400' : 'text-red-400'}`}>{potOdds}%</div>
        </div>
        <div className={`p-4 rounded-xl border text-center ${profitable ? 'bg-green-900/20 border-green-600/30' : 'bg-red-900/20 border-red-600/30'}`}>
          <div className="text-gray-500 text-xs mb-1">EV du call</div>
          <div className={`font-bold text-xl ${+evPerBB > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {+evPerBB > 0 ? '+' : ''}{evPerBB}€
          </div>
        </div>
      </div>

      <motion.div
        key={profitable ? 'good' : 'bad'}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border ${profitable ? 'bg-green-900/20 border-green-600/30' : 'bg-red-900/20 border-red-600/30'}`}
      >
        <div className={`font-bold mb-1 ${profitable ? 'text-green-400' : 'text-red-400'}`}>
          {profitable ? '✅ Call rentable à long terme' : '❌ Call non rentable à long terme'}
        </div>
        <p className="text-gray-300 text-sm">
          {profitable
            ? `Votre équité (${equity}%) est supérieure aux pot odds (${potOdds}%). Chaque call vaut en moyenne +${evPerBB}€.`
            : `Votre équité (${equity}%) est inférieure aux pot odds requis (${potOdds}%). Call coûte ${Math.abs(+evPerBB)}€ en moyenne.`}
        </p>
      </motion.div>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400">
        <p className="text-white font-medium mb-1">Comment estimer votre équité ?</p>
        <p>Comptez vos outs, puis appliquez la règle des 2 et 4 :</p>
        <ul className="mt-1 space-y-0.5 text-xs">
          <li>• Flush draw (9 outs) → ~36% sur 2 streets, ~18% sur 1 street</li>
          <li>• OESD (8 outs) → ~32% sur 2 streets, ~16% sur 1 street</li>
          <li>• Gutshot (4 outs) → ~16% sur 2 streets, ~8% sur 1 street</li>
        </ul>
      </div>
    </div>
  );
}
