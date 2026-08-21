'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: 'As-tu déjà joué au Texas Hold\'em ?',
    options: [
      { label: 'Jamais, je découvre', points: 0 },
      { label: 'Quelques parties entre amis', points: 1 },
      { label: 'Régulièrement, en ligne ou en club', points: 2 },
    ],
  },
  {
    id: 2,
    question: 'Sais-tu ce que sont les "pot odds" ?',
    options: [
      { label: 'Aucune idée', points: 0 },
      { label: 'J\'en ai entendu parler', points: 1 },
      { label: 'Je les calcule automatiquement', points: 2 },
    ],
  },
  {
    id: 3,
    question: 'Connais-tu le concept de "GTO" ?',
    options: [
      { label: 'Non, c\'est quoi ?', points: 0 },
      { label: 'Game Theory Optimal, vaguement', points: 1 },
      { label: 'Je l\'applique dans mon jeu', points: 2 },
    ],
  },
  {
    id: 4,
    question: 'As-tu déjà utilisé un solver poker (Pio, GTO+...) ?',
    options: [
      { label: 'Jamais', points: 0 },
      { label: 'J\'ai testé rapidement', points: 1 },
      { label: 'Oui, régulièrement pour analyser', points: 2 },
    ],
  },
  {
    id: 5,
    question: 'En tournoi, ajustes-tu ta stratégie selon l\'ICM ?',
    options: [
      { label: 'Je ne sais pas ce que c\'est', points: 0 },
      { label: 'Je connais le concept', points: 1 },
      { label: 'Oui, c\'est intégré dans mes décisions', points: 2 },
    ],
  },
];

type Result = {
  level: string;
  label: string;
  emoji: string;
  color: string;
  href: string;
  description: string;
};

function getResult(total: number): Result {
  if (total <= 2) return {
    level: 'debutant',
    label: 'Débutant',
    emoji: '🌱',
    color: '#27ae60',
    href: '/debutant',
    description: 'Les fondamentaux du poker t\'attendent. Tu vas construire une base solide, étape par étape.',
  };
  if (total <= 4) return {
    level: 'intermediaire',
    label: 'Intermédiaire',
    emoji: '🎯',
    color: '#2980b9',
    href: '/intermediaire',
    description: 'Tu connais les bases, il est temps de passer à la stratégie : pot odds, EV, c-bets.',
  };
  if (total <= 6) return {
    level: 'avance',
    label: 'Avancé',
    emoji: '🔮',
    color: '#8e44ad',
    href: '/avance',
    description: 'Tu es prêt pour le GTO, les ranges et les concepts avancés qui font la différence.',
  };
  if (total <= 8) return {
    level: 'expert',
    label: 'Expert',
    emoji: '⚡',
    color: '#c9a84c',
    href: '/expert',
    description: 'Solver thinking, ranges balancées, exploitation avancée. Tu joues au plus haut niveau.',
  };
  return {
    level: 'expert',
    label: 'Expert',
    emoji: '👑',
    color: '#e74c3c',
    href: '/expert',
    description: 'Ton niveau est exceptionnel. Commence par Expert pour affiner tes lacunes, puis passe au Professionnel.',
  };
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const question = questions[step];
  const totalScore = answers.reduce((sum, a) => sum + a, 0);
  const result = getResult(totalScore);

  function handleSelect(points: number) {
    setSelected(points);
    setTimeout(() => {
      const newAnswers = [...answers, points];
      if (step + 1 >= questions.length) {
        setAnswers(newAnswers);
        setDone(true);
      } else {
        setAnswers(newAnswers);
        setStep(s => s + 1);
        setSelected(null);
      }
    }, 350);
  }

  function handleBack() {
    if (step === 0) return;
    setAnswers(answers.slice(0, -1));
    setStep(s => s - 1);
    setSelected(null);
  }

  function handleRestart() {
    setStep(0);
    setAnswers([]);
    setSelected(null);
    setDone(false);
  }

  return (
    <div className="min-h-screen bg-[#060d08] flex flex-col items-center justify-center px-4 py-24">
      <div className="w-full max-w-lg">

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 disabled:opacity-0 disabled:pointer-events-none transition-all"
                  aria-label="Question précédente"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Question {step + 1} / {questions.length}</p>
                  <div className="flex gap-1.5 mt-2 justify-center">
                    {questions.map((_, i) => (
                      <div
                        key={i}
                        className="h-1 rounded-full transition-all duration-300"
                        style={{
                          width: i === step ? 24 : 8,
                          background: i < step ? '#27ae60' : i === step ? '#c9a84c' : 'rgba(255,255,255,0.1)',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <Link href="/" className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all text-xs">
                  Passer
                </Link>
              </div>

              {/* Question */}
              <h1
                className="text-2xl md:text-3xl font-bold text-white text-center mb-10 leading-snug"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {question.question}
              </h1>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleSelect(opt.points)}
                    disabled={selected !== null}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all text-sm font-medium ${
                      selected === opt.points
                        ? 'bg-yellow-500/20 border-yellow-500/60 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span className="text-gray-500 mr-3">{String.fromCharCode(65 + i)}.</span>
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">{result.emoji}</div>
              <p className="text-gray-500 text-sm mb-2 uppercase tracking-widest">Niveau recommandé</p>
              <h2
                className="text-4xl font-bold text-white mb-4"
                style={{ fontFamily: 'var(--font-playfair)', color: result.color }}
              >
                {result.label}
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-sm mx-auto">
                {result.description}
              </p>

              <div className="flex flex-col gap-3 items-center">
                <Link
                  href={result.href}
                  className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl text-white transition-all text-base hover:opacity-90"
                  style={{ background: result.color }}
                >
                  Commencer le niveau {result.label}
                  <ChevronRight size={20} />
                </Link>
                <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  Voir tous les niveaux
                </Link>
                <button onClick={handleRestart} className="text-gray-600 hover:text-gray-400 text-xs transition-colors mt-1">
                  Recommencer le quiz
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
