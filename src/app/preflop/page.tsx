'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// ─── Grid helpers ─────────────────────────────────────────────────────────────

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

function getHand(i: number, j: number): string {
  if (i === j) return RANKS[i] + RANKS[i];
  if (i < j) return RANKS[i] + RANKS[j] + 's';   // upper triangle = suited
  return RANKS[j] + RANKS[i] + 'o';               // lower triangle = offsuit
}

function handCombos(hand: string): number {
  if (!hand.endsWith('s') && !hand.endsWith('o')) return 6; // pair
  return hand.endsWith('s') ? 4 : 12;
}

// ─── Range data ───────────────────────────────────────────────────────────────

type RangeStatus = 'raise' | 'mixed' | 'fold';

interface PositionData {
  label: string;
  fullLabel: string;
  situation: string;
  color: string;
  pct: string;
  note: string;
  keyRule: string;
  raise: Set<string>;
  mixed: Set<string>;
}

const POSITIONS: Record<string, PositionData> = {
  UTG: {
    label: 'UTG', fullLabel: 'Under the Gun', situation: 'Raise First In',
    color: '#ef4444', pct: '~14%',
    note: 'Première position à parler après les blinds. 5 joueurs derrière = range très tight. Ne jouez que des mains premium et quelques broadways suited.',
    keyRule: 'Règle : si vous hésitez, c\'est probablement un fold en UTG.',
    raise: new Set(['AA','KK','QQ','JJ','TT','AKs','AQs','AJs','KQs','AKo','AQo']),
    mixed: new Set(['99','88','ATs','A9s','KJs','AJo','KQo']),
  },
  HJ: {
    label: 'HJ', fullLabel: 'Hijack', situation: 'Raise First In',
    color: '#f97316', pct: '~18%',
    note: 'Une position devant CO et BTN. Élargissez légèrement vs UTG : quelques suited connectors et paires moyennes entrent.',
    keyRule: 'Ajout par rapport à UTG : 88+, ATs, KTs, QJs, JTs comme raise ; 77, A9s, A8s comme mixed.',
    raise: new Set(['AA','KK','QQ','JJ','TT','99','88','AKs','AQs','AJs','ATs','KQs','KJs','QJs','AKo','AQo','AJo','KQo']),
    mixed: new Set(['77','A9s','A8s','KTs','JTs','ATo','KJo']),
  },
  CO: {
    label: 'CO', fullLabel: 'Cutoff', situation: 'Raise First In',
    color: '#eab308', pct: '~26%',
    note: 'Seulement BTN et les blinds derrière. Ajoutez les suited connectors, les petites paires et les broadways offsuit.',
    keyRule: 'Le CO est la position charnière : on commence à ouvrir les suited connectors (T9s, 98s) et petites paires (66).',
    raise: new Set(['AA','KK','QQ','JJ','TT','99','88','77','66','AKs','AQs','AJs','ATs','A9s','A8s','KQs','KJs','KTs','QJs','QTs','JTs','T9s','98s','AKo','AQo','AJo','ATo','KQo','KJo']),
    mixed: new Set(['55','A7s','A6s','A5s','K9s','Q9s','J9s','T8s','87s','76s','QJo']),
  },
  BTN: {
    label: 'BTN', fullLabel: 'Button', situation: 'Raise First In',
    color: '#22c55e', pct: '~40%',
    note: 'Position la plus avantageuse : seulement les blinds derrière. Ouvrez très large incluant toutes les suited aces, suited connectors et la plupart des broadways.',
    keyRule: 'BTN : si la main a une certaine logique (suited, connectée, ou broadways), ouvrez-la. La position compense les mains moyennes.',
    raise: new Set([
      'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
      'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
      'KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s',
      'QJs','QTs','Q9s','Q8s',
      'JTs','J9s','J8s',
      'T9s','T8s',
      '98s','97s','87s','86s','76s','75s','65s',
      'AKo','AQo','AJo','ATo','A9o',
      'KQo','KJo','KTo','QJo','QTo','JTo',
    ]),
    mixed: new Set(['K4s','K3s','K2s','Q7s','Q6s','J7s','T7s','96s','85s','74s','64s','54s','K9o','Q9o','J9o','T9o']),
  },
  SB: {
    label: 'SB', fullLabel: 'Small Blind', situation: 'Raise First In (vs fold)',
    color: '#3b82f6', pct: '~35%',
    note: 'Vous agissez en dernier preflop mais OOP postflop sur toutes les streets. Ouvrez large mais attention : vous jouerez hors position contre la BB.',
    keyRule: 'SB vs fold : ouvrez 2.5x (pas 3x) pour réduire le risque. Limité par le fait de jouer OOP postflop.',
    raise: new Set([
      'AA','KK','QQ','JJ','TT','99','88','77','66','55','44',
      'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
      'KQs','KJs','KTs','K9s','K8s','K7s',
      'QJs','QTs','Q9s',
      'JTs','J9s',
      'T9s','98s',
      'AKo','AQo','AJo','ATo','A9o','A8o',
      'KQo','KJo','QJo',
    ]),
    mixed: new Set(['33','22','K6s','Q8s','J8s','T8s','87s','76s','KTo','A7o','QTo']),
  },
  BB: {
    label: 'BB', fullLabel: 'Big Blind', situation: 'Défense vs BTN open',
    color: '#a855f7', pct: '~45%',
    note: 'La BB investit déjà 1BB donc doit défendre large. Vs BTN open, la plupart des mains playables sont défendables (call ou 3-bet). Vous avez les meilleures cotes du jeu.',
    keyRule: 'BB : défendez tout ce qui a de l\'equity (suited, connecté, broadways). Foldez seulement les mains absolument sans valeur (72o, 83o…).',
    raise: new Set([
      'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
      'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
      'KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s',
      'QJs','QTs','Q9s','Q8s',
      'JTs','J9s','J8s',
      'T9s','T8s','T7s',
      '98s','97s','87s','86s','76s','75s','65s','54s',
      'AKo','AQo','AJo','ATo','A9o','A8o','A7o',
      'KQo','KJo','KTo','K9o',
      'QJo','QTo','JTo','J9o','T9o',
    ]),
    mixed: new Set(['K4s','K3s','Q7s','Q6s','J7s','T6s','96s','85s','74s','64s','53s','A6o','K8o','Q9o','J8o','T8o']),
  },
};

const POSITION_ORDER = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

// ─── Grid cell ────────────────────────────────────────────────────────────────

function GridCell({ hand, status, size }: { hand: string; status: RangeStatus; size: number }) {
  const [hovered, setHovered] = useState(false);
  const bgColor = status === 'raise' ? '#16a34a' : status === 'mixed' ? '#b45309' : '#111827';
  const textColor = status === 'fold' ? '#374151' : '#fff';
  const isPair = hand.length === 2;
  const displayRank = isPair ? hand[0] : (hand.length === 3 ? hand[0] + hand[1] : hand.slice(0, -1));

  return (
    <div
      className="relative flex items-center justify-center rounded-sm font-mono font-bold transition-all duration-75 cursor-default select-none"
      style={{
        width: size, height: size,
        background: hovered && status !== 'fold' ? (status === 'raise' ? '#15803d' : '#92400e') : bgColor,
        color: textColor,
        fontSize: size <= 24 ? 7 : size <= 30 ? 8 : 9,
        border: `1px solid ${status === 'fold' ? '#1f2937' : status === 'raise' ? '#22c55e40' : '#f59e0b40'}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {status !== 'fold' ? hand : <span style={{ fontSize: 6, opacity: 0.3 }}>{displayRank}</span>}
      {hovered && status !== 'fold' && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-20 pointer-events-none">
          <div className="bg-gray-900 border border-white/20 rounded px-2 py-1 text-white whitespace-nowrap" style={{ fontSize: 11 }}>
            {hand}, {status === 'raise' ? 'Toujours ouvrir' : 'Parfois ouvrir'}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PreflopPage() {
  const [activePos, setActivePos] = useState('BTN');
  const pos = POSITIONS[activePos];

  const { totalCombos, raiseCount, mixedCount } = useMemo(() => {
    let raise = 0, mixed = 0;
    for (let i = 0; i < 13; i++) {
      for (let j = 0; j < 13; j++) {
        const h = getHand(i, j);
        const c = handCombos(h);
        if (pos.raise.has(h)) raise += c;
        else if (pos.mixed.has(h)) mixed += c;
      }
    }
    return { totalCombos: raise + mixed, raiseCount: raise, mixedCount: mixed };
  }, [pos]);

  const pctTotal = ((totalCombos / 1326) * 100).toFixed(1);
  const pctRaise = ((raiseCount / 1326) * 100).toFixed(1);
  const pctMixed = ((mixedCount / 1326) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium">Référence</span>
            <span className="text-xs text-gray-500">6-max Cash · 100BB</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Ranges Préflop
          </h1>
          <p className="text-gray-400">Ranges d'ouverture GTO par position. Vert = toujours ouvrir, ambre = mixte, noir = fold.</p>
        </motion.div>

        {/* Position tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {POSITION_ORDER.map(posKey => {
            const p = POSITIONS[posKey];
            const isActive = activePos === posKey;
            return (
              <button
                key={posKey}
                onClick={() => setActivePos(posKey)}
                className="px-4 py-2 rounded-xl font-bold text-sm transition-all"
                style={{
                  background: isActive ? p.color + '20' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isActive ? p.color + '60' : 'rgba(255,255,255,0.1)'}`,
                  color: isActive ? p.color : '#6b7280',
                }}
              >
                {posKey}
                {isActive && <span className="ml-1.5 text-xs opacity-70">{p.pct}</span>}
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr,280px] gap-6">

          {/* Grid */}
          <motion.div
            key={activePos}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {/* Rank headers */}
            <div className="flex gap-px mb-1 pl-[22px]">
              {RANKS.map(r => (
                <div key={r} className="text-gray-500 font-mono font-bold text-center flex-1" style={{ fontSize: 9 }}>{r}</div>
              ))}
            </div>

            {/* Grid rows */}
            {RANKS.map((rowRank, i) => (
              <div key={i} className="flex items-center gap-px mb-px">
                {/* Row label */}
                <div className="text-gray-500 font-mono font-bold w-5 text-right pr-1 shrink-0" style={{ fontSize: 9 }}>
                  {rowRank}
                </div>
                {RANKS.map((_, j) => {
                  const hand = getHand(i, j);
                  const status: RangeStatus = pos.raise.has(hand) ? 'raise' : pos.mixed.has(hand) ? 'mixed' : 'fold';
                  return (
                    <div key={j} className="flex-1 aspect-square min-w-0">
                      <GridCell hand={hand} status={status} size={36} />
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-sm bg-green-700" />
                <span className="text-gray-400 text-xs">Toujours ouvrir</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-sm bg-yellow-800" />
                <span className="text-gray-400 text-xs">Mixte (parfois)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-sm bg-gray-900 border border-gray-700" />
                <span className="text-gray-400 text-xs">Fold</span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-gray-500 text-xs">Haut-gauche = pairs | ↗ = suited | ↙ = offsuit</span>
              </div>
            </div>
          </motion.div>

          {/* Sidebar: info */}
          <div className="space-y-4">

            {/* Position info */}
            <motion.div
              key={activePos + '-info'}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl p-5"
              style={{ background: pos.color + '10', border: `1px solid ${pos.color}30` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-lg" style={{ color: pos.color }}>{pos.label}</span>
                <span className="text-gray-400 text-sm">· {pos.fullLabel}</span>
              </div>
              <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider font-semibold">{pos.situation}</p>
              <p className="text-gray-300 text-sm leading-relaxed">{pos.note}</p>
            </motion.div>

            {/* Stats */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">Statistiques</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Range totale</span>
                  <span className="text-white font-bold">{pctTotal}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-3">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(parseFloat(pctTotal) * 2, 100)}%`, background: pos.color }} />
                </div>
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-green-700" />
                    <span className="text-gray-400">Toujours</span>
                  </div>
                  <span className="text-green-400 font-mono">{pctRaise}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-yellow-800" />
                    <span className="text-gray-400">Mixte</span>
                  </div>
                  <span className="text-yellow-500 font-mono">{pctMixed}%</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-white/5">
                  <span className="text-gray-500">Combos totaux</span>
                  <span className="text-gray-300 font-mono">{totalCombos} / 1326</span>
                </div>
              </div>
            </div>

            {/* Key rule */}
            <div className="rounded-2xl p-4" style={{ background: '#1a3a8f15', border: '1px solid #3b82f620' }}>
              <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Règle clé</p>
              <p className="text-gray-300 text-sm leading-relaxed">{pos.keyRule}</p>
            </div>

            {/* BB special note */}
            {activePos === 'BB' && (
              <div className="rounded-2xl p-4 bg-purple-500/10 border border-purple-500/20">
                <p className="text-purple-400 text-xs font-semibold mb-1">Note BB</p>
                <p className="text-gray-400 text-xs leading-relaxed">Ce chart montre la défense vs BTN open. Vs UTG ou HJ, défendez plus tight. Vs SB, défendez encore plus large.</p>
              </div>
            )}

            {/* Position order reminder */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Ordre des positions (6-max)</p>
              <div className="flex items-center gap-1 flex-wrap">
                {POSITION_ORDER.map((p, i) => (
                  <div key={p} className="flex items-center gap-1">
                    <button
                      onClick={() => setActivePos(p)}
                      className="text-xs font-bold px-1.5 py-0.5 rounded transition-all"
                      style={{ color: POSITIONS[p].color, background: activePos === p ? POSITIONS[p].color + '20' : 'transparent' }}
                    >
                      {p}
                    </button>
                    {i < POSITION_ORDER.length - 1 && <span className="text-gray-700 text-xs">→</span>}
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-xs mt-1">Plus vous êtes à droite, plus vous pouvez ouvrir large.</p>
            </div>
          </div>
        </div>

        {/* All positions overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h2 className="text-white font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Récapitulatif rapide par position</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {POSITION_ORDER.map(posKey => {
              const p = POSITIONS[posKey];
              return (
                <button
                  key={posKey}
                  onClick={() => { setActivePos(posKey); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-left p-4 rounded-xl transition-all hover:scale-[1.01]"
                  style={{ background: p.color + '08', border: `1px solid ${p.color}25` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold" style={{ color: p.color }}>{posKey}</span>
                    <span className="text-xs text-gray-500">{p.pct}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{p.fullLabel}</p>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2">{p.keyRule.replace('Règle : ', '').replace(/^[A-Z]+ : /, '')}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

      </main>
    </div>
  );
}
