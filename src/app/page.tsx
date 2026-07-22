'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

const MotionLink = motion.create(Link);
import { Lock, ChevronRight, Star, Zap, Trophy, Target, BookOpen, Play } from 'lucide-react';
import { LEVELS } from '@/lib/poker-data';
import { useProgress } from '@/hooks/useProgress';
import { useRef, useState } from 'react';
import { DailyChallengeCard, DailyChallengeModal } from '@/components/DailyChallenge';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';

function FloatingCard({ suit, delay, x, y, size }: { suit: string; delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: x, top: y, fontSize: size }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.15, 0.08, 0.15],
        scale: [0.8, 1, 0.9, 1],
        y: [0, -20, 0, -10, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span className={suit === '♥' || suit === '♦' ? 'text-red-500' : 'text-white'}>{suit}</span>
    </motion.div>
  );
}

const floatingCards = [
  { suit: '♠', delay: 0, x: '5%', y: '15%', size: 80 },
  { suit: '♥', delay: 1.5, x: '90%', y: '10%', size: 60 },
  { suit: '♦', delay: 0.8, x: '88%', y: '70%', size: 90 },
  { suit: '♣', delay: 2.2, x: '3%', y: '75%', size: 70 },
  { suit: '♠', delay: 3, x: '45%', y: '5%', size: 50 },
  { suit: '♥', delay: 1, x: '15%', y: '45%', size: 40 },
  { suit: '♦', delay: 2.5, x: '75%', y: '40%', size: 55 },
  { suit: '♣', delay: 0.5, x: '60%', y: '85%', size: 65 },
];

const statsData = [
  { icon: BookOpen, value: '35+', label: 'Modules de cours' },
  { icon: Play, value: '50+', label: 'Mains interactives' },
  { icon: Trophy, value: '6', label: 'Mains légendaires' },
  { icon: Star, value: '5', label: 'Niveaux de maîtrise' },
];

export default function HomePage() {
  const { isLevelUnlocked } = useProgress();
  const { challenge, isCompleted, wasCorrect, streak, loading, completeChallenge } = useDailyChallenge();
  const [challengeOpen, setChallengeOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main id="main-content" className="min-h-screen bg-[#060d08] overflow-hidden">
      {/* HERO */}
      <section ref={heroRef} aria-label="Introduction" className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(26,74,46,0.4)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,168,76,0.08)_0%,transparent_50%)]" />
        {floatingCards.map((c, i) => <FloatingCard key={i} {...c} />)}

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-yellow-900/30 border border-yellow-600/30 rounded-full px-4 py-2 text-yellow-400 text-sm font-medium mb-8"
          >
            <Zap size={14} />
            Du débutant au niveau professionnel
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-4 leading-none"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            <span className="text-gradient-gold">Au Tapis.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-2xl md:text-3xl text-white/60 font-light mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Maîtrisez le poker.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-gray-400 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed"
          >
            De la première main jusqu&apos;aux stratégies des champions du monde.
            5 niveaux, des cours interactifs, des mains légendaires.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <MotionLink
              href="/debutant"
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold px-8 py-4 rounded-xl transition-all glow-green"
            >
              Commencer gratuitement
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </MotionLink>
            <motion.a
              href="#levels"
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl transition-all hover:bg-white/5"
            >
              Voir les niveaux
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600"
        >
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-3 bg-gray-600 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section aria-label="Statistiques" className="py-16 border-y border-white/5 bg-black/30">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon size={24} className="mx-auto mb-3 text-yellow-500" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DÉFI DU JOUR */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <DailyChallengeCard
            challenge={challenge}
            isCompleted={isCompleted}
            wasCorrect={wasCorrect}
            streak={streak}
            loading={loading}
            onOpen={() => setChallengeOpen(true)}
          />
        </div>
      </section>

      {/* LEVELS */}
      <section id="levels" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Votre parcours
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              5 niveaux progressifs pour transformer un débutant en joueur de haut niveau.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEVELS.map((level, i) => {
              const unlocked = isLevelUnlocked(level.id);
              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={i === 4 ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' : ''}
                >
                  <LevelCard level={level} unlocked={unlocked} index={i} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-24 px-4 bg-black/20">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-white mb-16"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Pourquoi Au Tapis ?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎯', title: 'Progressif & Structuré', desc: 'Chaque niveau s\'appuie sur le précédent. Pas de jargon inutile — uniquement ce dont vous avez besoin à chaque étape.' },
              { icon: '🧮', title: 'Basé sur les Maths', desc: 'Apprenez à calculer les pot odds, l\'équité, l\'EV. Le poker est un jeu de décisions mathématiques à long terme.' },
              { icon: '🎮', title: 'Interactif & Pratique', desc: 'Jouez des mains réelles, répondez à des quiz, analysez des situations emblématiques des plus grands pros.' },
              { icon: '🏆', title: 'Mains Légendaires', desc: 'Étudiez les coups extraordinaires de Phil Ivey, Moneymaker, Isildur1. Comprenez le pourquoi de chaque décision.' },
              { icon: '🔒', title: 'Gratuit & Sans Argent', desc: 'Aucune mise d\'argent réelle. Apprenez en toute sérénité, sans risque, uniquement pour la maîtrise du jeu.' },
              { icon: '🧠', title: 'GTO & Psychologie', desc: 'Du game theory optimal au mental game de champion — tous les aspects d\'un joueur de haut niveau.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.25)' }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-colors"
              >
                <div className="text-3xl mb-3 text-center">{item.icon}</div>
                <h3 className="font-bold text-white mb-2 text-center">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed text-center">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(26,74,46,0.3)_0%,transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <div className="text-5xl mb-6">♠ ♥ ♦ ♣</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Prêt à jouer ?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            Rejoignez des milliers de joueurs qui ont maîtrisé le poker grâce à nos cours.
          </p>
          <MotionLink
            href="/debutant"
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-700 to-yellow-500 hover:from-yellow-600 hover:to-yellow-400 text-white font-bold px-10 py-5 rounded-xl text-lg transition-all pulse-gold"
          >
            Démarrer le niveau Débutant
            <ChevronRight size={22} />
          </MotionLink>
        </motion.div>
      </section>

      {/* Challenge Modal */}
      {challengeOpen && challenge && (
        <DailyChallengeModal
          challenge={challenge}
          streak={streak}
          onComplete={(correct) => { completeChallenge(correct); }}
          onClose={() => setChallengeOpen(false)}
        />
      )}

      <footer className="border-t border-white/10 py-8 text-center text-gray-600 text-sm">
        <p className="mb-1 font-medium text-gray-500">Au Tapis ♠ autapis.fr</p>
        <p>Apprenez le jeu, pas l&apos;addiction. Pas de jeux d&apos;argent réels.</p>
      </footer>
    </main>
  );
}

function LevelCard({ level, unlocked, index }: { level: typeof LEVELS[0]; unlocked: boolean; index: number }) {
  return (
    <MotionLink
      href={unlocked ? `/${level.id}` : '#levels'}
      whileHover={unlocked ? { y: -4 } : {}}
      whileTap={unlocked ? { scale: 0.97 } : {}}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`block relative rounded-2xl border overflow-hidden transition-all duration-300 group ${
        unlocked ? 'hover:shadow-2xl cursor-pointer' : 'cursor-not-allowed opacity-70'
      }`}
      style={{ borderColor: unlocked ? level.color + '50' : '#333' }}
    >
      <div
        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ background: `radial-gradient(ellipse at 30% 30%, ${level.color}, transparent 70%)` }}
      />
      {!unlocked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
          <Lock size={32} className="text-gray-400 mb-2" />
          <p className="text-gray-400 text-sm font-medium">Terminez Expert pour débloquer</p>
        </div>
      )}
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{level.icon}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: level.color + '20', color: level.color }}>
                Niveau {index + 1}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>{level.name}</h3>
            <p className="text-sm" style={{ color: level.color }}>{level.subtitle}</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{level.description}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          {level.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="text-xs bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-gray-400">{topic}</span>
          ))}
          {level.topics.length > 3 && <span className="text-xs text-gray-500">+{level.topics.length - 3} autres</span>}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{level.modules} modules</span>
            <span>·</span>
            <span>{level.estimatedHours}</span>
          </div>
          {unlocked && (
            <div className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all" style={{ color: level.color }}>
              Commencer <ChevronRight size={16} />
            </div>
          )}
        </div>
      </div>
    </MotionLink>
  );
}
