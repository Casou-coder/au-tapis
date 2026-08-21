'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { RANGE_CHALLENGES, type RangeChallenge } from '@/lib/range-challenges';

const RangeGrid = dynamic(() => import('@/components/RangeGrid'), { ssr: false });

const DIFF_LABEL: Record<number, string> = { 1: 'Débutant', 2: 'Intermédiaire', 3: 'Avancé' };
const DIFF_COLOR: Record<number, string> = { 1: '#22c55e', 2: '#3b82f6', 3: '#a855f7' };

export default function RangesPage() {
  const [active, setActive]   = useState<RangeChallenge>(RANGE_CHALLENGES[0]);
  const [resetKey, setResetKey] = useState(0);

  function selectChallenge(c: RangeChallenge) {
    setActive(c);
    setResetKey(k => k + 1);
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <main id="main-content" className="max-w-5xl mx-auto px-4 pt-28 pb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Range Builder
          </h1>
          <p className="text-gray-400 max-w-xl">
            Construis la range GTO pour chaque scénario, puis compare à la réponse. Clique les mains à inclure sur la grille.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* Scenario selector */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Scénarios</p>
            {RANGE_CHALLENGES.map((c, i) => {
              const isActive = c.id === active.id;
              return (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => selectChallenge(c)}
                  className="w-full text-left rounded-xl p-4 transition-all"
                  style={{
                    background: isActive ? 'rgba(234,179,8,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isActive ? 'rgba(234,179,8,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`font-semibold text-sm ${isActive ? 'text-yellow-400' : 'text-white'}`}>
                      {c.title}
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0"
                      style={{ background: DIFF_COLOR[c.difficulty] + '20', color: DIFF_COLOR[c.difficulty] }}
                    >
                      {DIFF_LABEL[c.difficulty]}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{c.tag}</div>
                </motion.button>
              );
            })}

            {/* Legend */}
            <div className="rounded-xl p-4 mt-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Lire la grille</p>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded-sm flex items-center justify-center font-bold text-white/60" style={{ background: 'rgba(255,255,255,0.07)', fontSize: 9 }}>AA</div>
                  <span>Diagonale = paires</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded-sm flex items-center justify-center font-mono text-white/40" style={{ background: 'rgba(255,255,255,0.04)', fontSize: 8 }}>AK<span style={{fontSize:6}}>s</span></div>
                  <span>Triangle haut = suited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded-sm flex items-center justify-center font-mono text-white/30" style={{ background: 'rgba(255,255,255,0.025)', fontSize: 8 }}>AK<span style={{fontSize:6}}>o</span></div>
                  <span>Triangle bas = offsuit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid area */}
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Scenario header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: DIFF_COLOR[active.difficulty] + '20', color: DIFF_COLOR[active.difficulty] }}
                >
                  {active.tag}
                </span>
              </div>
              <h2 className="text-white font-bold text-lg mb-1">{active.title}</h2>
              <p className="text-gray-400 text-sm mb-3">{active.context}</p>
              <div
                className="inline-block px-3 py-1.5 rounded-lg text-sm text-yellow-300"
                style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}
              >
                {active.instruction}
              </div>
            </div>

            {/* The grid */}
            <RangeGrid
              correctRange={active.correctRange}
              explanation={active.explanation}
              resetKey={resetKey}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
