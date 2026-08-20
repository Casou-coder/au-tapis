'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MODULE_QUIZZES } from '@/lib/poker-data';

interface Props {
  moduleKey: string;
}

export default function InlineQuiz({ moduleKey }: Props) {
  const questions = MODULE_QUIZZES[moduleKey];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!questions || questions.length === 0) return null;

  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correctIndex) setScore(s => s + 1);
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  const pct = Math.round((score / questions.length) * 100);

  return (
    <div className="mt-8 border-t border-white/10 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🧠</span>
        <h3 className="font-bold text-white text-sm">Vérifiez vos acquis</h3>
        <span className="ml-auto text-gray-600 text-xs">{current + 1}/{questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={current} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            <p className="text-gray-200 text-sm font-medium mb-3 leading-relaxed">{q.question}</p>
            <div className="space-y-2 mb-3">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = i === q.correctIndex;
                const revealed = selected !== null;
                let bg = 'rgba(255,255,255,0.04)';
                let border = 'rgba(255,255,255,0.08)';
                let textColor = '#9ca3af';
                if (revealed && isCorrect) { bg = 'rgba(34,197,94,0.12)'; border = '#22c55e50'; textColor = '#86efac'; }
                else if (revealed && isSelected && !isCorrect) { bg = 'rgba(239,68,68,0.12)'; border = '#ef444450'; textColor = '#fca5a5'; }
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={revealed}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all"
                    style={{ background: bg, border: `1px solid ${border}`, color: textColor, cursor: revealed ? 'default' : 'pointer' }}
                  >
                    <span className="font-mono text-xs mr-2 opacity-50">{['A', 'B', 'C', 'D'][i]}</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mb-3 p-3 rounded-xl text-xs leading-relaxed" style={{ background: selected === q.correctIndex ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${selected === q.correctIndex ? '#22c55e30' : '#ef444430'}` }}>
                  <span className="font-semibold" style={{ color: selected === q.correctIndex ? '#4ade80' : '#f87171' }}>
                    {selected === q.correctIndex ? '✓ Correct, ' : '✗ Incorrect, '}
                  </span>
                  <span className="text-gray-400">{q.explanation}</span>
                </motion.div>
              </AnimatePresence>
            )}

            {selected !== null && (
              <button onClick={next} className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                {current < questions.length - 1 ? 'Question suivante →' : 'Voir mon score'}
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
            <div className="text-3xl mb-2">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📖'}</div>
            <p className="text-white font-bold text-lg">{score}/{questions.length}</p>
            <p className="text-gray-400 text-sm mt-1">
              {pct >= 80 ? 'Excellent ! Module bien maîtrisé.' : pct >= 50 ? 'Bien. Relisez les points manqués.' : 'Revoyez le contenu avant de continuer.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
