'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RANKS, getHand } from '@/lib/range-challenges';

interface Props {
  correctRange: string[];
  explanation: string;
  resetKey?: number;
}

function cellLabel(hand: string): { main: string; sup: string } {
  if (hand.length === 2) return { main: hand, sup: '' };
  return { main: hand.slice(0, 2), sup: hand[2] };
}

export default function RangeGrid({ correctRange, explanation, resetKey }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);

  // Reset when resetKey changes (challenge switch)
  const [prevKey, setPrevKey] = useState(resetKey);
  if (resetKey !== prevKey) {
    setSelected(new Set());
    setRevealed(false);
    setPrevKey(resetKey);
  }

  const correctSet = new Set(correctRange);

  const toggle = useCallback((hand: string) => {
    if (revealed) return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(hand) ? next.delete(hand) : next.add(hand);
      return next;
    });
  }, [revealed]);

  const handleReset = () => {
    setSelected(new Set());
    setRevealed(false);
  };

  // Score after reveal
  let tp = 0, tn = 0, fp = 0, fn = 0;
  for (let r = 0; r < 13; r++) {
    for (let c = 0; c < 13; c++) {
      const hand = getHand(r, c);
      const userIn = selected.has(hand);
      const ok = correctSet.has(hand);
      if (userIn && ok)   tp++;
      else if (!userIn && !ok) tn++;
      else if (userIn && !ok)  fp++;
      else                     fn++;
    }
  }
  const score = Math.round(((tp + tn) / 169) * 100);

  return (
    <div>
      {/* Grid */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: 440 }}>
          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '18px repeat(13, 1fr)', gap: 2, marginBottom: 2, paddingLeft: 0 }}>
            <div />
            {RANKS.map(r => (
              <div key={r} style={{ textAlign: 'center', fontSize: 10, color: '#6b7280', fontFamily: 'monospace' }}>{r}</div>
            ))}
          </div>

          {/* Rows */}
          {RANKS.map((_, ri) => (
            <div key={ri} style={{ display: 'grid', gridTemplateColumns: '18px repeat(13, 1fr)', gap: 2, marginBottom: 2 }}>
              <div style={{ fontSize: 10, color: '#6b7280', fontFamily: 'monospace', display: 'flex', alignItems: 'center' }}>
                {RANKS[ri]}
              </div>
              {RANKS.map((__, ci) => {
                const hand = getHand(ri, ci);
                const userIn = selected.has(hand);
                const ok = correctSet.has(hand);
                const isPair = ri === ci;
                const isSuited = ri < ci;
                const { main, sup } = cellLabel(hand);

                let bg: string;
                let border: string;
                let color: string;

                if (!revealed) {
                  if (userIn) {
                    bg = 'rgba(34,197,94,0.28)';
                    border = 'rgba(34,197,94,0.55)';
                    color = '#86efac';
                  } else {
                    bg = isPair
                      ? 'rgba(255,255,255,0.07)'
                      : isSuited
                      ? 'rgba(255,255,255,0.04)'
                      : 'rgba(255,255,255,0.025)';
                    border = 'rgba(255,255,255,0.07)';
                    color = '#374151';
                  }
                } else {
                  if (userIn && ok) {
                    bg = 'rgba(34,197,94,0.30)'; border = 'rgba(34,197,94,0.6)'; color = '#86efac'; // TP green
                  } else if (!userIn && !ok) {
                    bg = 'rgba(255,255,255,0.03)'; border = 'rgba(255,255,255,0.06)'; color = '#374151'; // TN dark
                  } else if (userIn && !ok) {
                    bg = 'rgba(239,68,68,0.25)'; border = 'rgba(239,68,68,0.55)'; color = '#fca5a5'; // FP red
                  } else {
                    bg = 'rgba(251,146,60,0.22)'; border = 'rgba(251,146,60,0.45)'; color = '#fdba74'; // FN orange (missed)
                  }
                }

                return (
                  <button
                    key={hand}
                    onClick={() => toggle(hand)}
                    title={hand}
                    style={{
                      background: bg,
                      border: `1px solid ${border}`,
                      borderRadius: 3,
                      cursor: revealed ? 'default' : 'pointer',
                      color,
                      fontSize: 9,
                      fontFamily: 'monospace',
                      fontWeight: isPair ? 700 : 400,
                      lineHeight: 1,
                      textAlign: 'center',
                      minHeight: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0,
                      transition: revealed ? 'none' : 'background 0.08s, border 0.08s',
                    }}
                  >
                    <span>{main}</span>
                    {sup && <span style={{ fontSize: 7, marginLeft: 1, opacity: 0.8 }}>{sup}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(34,197,94,0.28)', border: '1px solid rgba(34,197,94,0.55)' }} />
          Inclus
        </div>
        {revealed && (
          <>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.55)' }} />
              Hors range (erreur)
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(251,146,60,0.22)', border: '1px solid rgba(251,146,60,0.45)' }} />
              Oublié (erreur)
            </div>
          </>
        )}
        <div className="ml-auto text-xs text-gray-600">
          {selected.size} main{selected.size > 1 ? 's' : ''} sélectionnée{selected.size > 1 ? 's' : ''}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-4 flex-wrap">
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            disabled={selected.size === 0}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-30"
            style={{ background: '#eab308', color: '#000' }}
          >
            Voir la réponse GTO
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-white">{score}%</div>
            <div>
              <div className="text-sm font-medium" style={{
                color: score >= 85 ? '#4ade80' : score >= 65 ? '#fbbf24' : '#f87171'
              }}>
                {score >= 85 ? '🎯 Excellent !' : score >= 65 ? '👍 Bon travail' : score >= 45 ? '📚 Continue à apprendre' : '💡 Révise cette range'}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {tp} correctes · {fp} en trop · {fn} oubliées
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-400 hover:text-white"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Réinitialiser
        </button>
      </div>

      {/* Explanation */}
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 p-4 rounded-xl text-sm text-gray-300 leading-relaxed"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {explanation}
        </motion.div>
      )}
    </div>
  );
}
