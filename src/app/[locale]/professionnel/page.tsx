'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, Lock, ChevronRight, Star } from 'lucide-react';
import PokerCard from '@/components/PokerCard';
import { MultiHandPlayer } from '@/components/HandPlayer';
import { XpToast } from '@/components/XpToast';
import { ALL_HAND_SCRIPTS } from '@/lib/hand-scripts';
import { FAMOUS_HANDS, FamousHand } from '@/lib/poker-data';
import { useProgress } from '@/hooks/useProgress';
import { useLocale } from 'next-intl';

const SECTIONS_FR = [
  { id: 'legends', title: 'Mains Légendaires', icon: '🏆', desc: "6 coups qui ont changé l'histoire du poker" },
  { id: 'pros', title: 'Stratégies des Pros', icon: '🎯', desc: 'Les secrets des meilleurs joueurs au monde' },
  { id: 'wsop', title: 'WSOP & High Stakes', icon: '💰', desc: 'Les plus grands tournois et les plus hauts enjeux' },
  { id: 'mindset', title: 'Jeu Mental Elite', icon: '🧠', desc: 'La psychologie des champions du monde' },
  { id: 'cashvstourney', title: 'Cash vs Tournois', icon: '⚡', desc: 'Différences stratégiques au sommet' },
  { id: 'secrets', title: 'Les Grands Secrets', icon: '🔑', desc: 'Ce que les meilleurs ne vous diront jamais' },
  { id: 'main-guidee', title: 'Main Guidée', icon: '🃏', desc: 'Jouez un overbet river polarisé au niveau pro' },
];

const SECTIONS_EN = [
  { id: 'legends', title: 'Legendary Hands', icon: '🏆', desc: '6 plays that changed poker history' },
  { id: 'pros', title: 'Pro Strategies', icon: '🎯', desc: "The secrets of the world's best players" },
  { id: 'wsop', title: 'WSOP & High Stakes', icon: '💰', desc: 'The biggest tournaments and highest stakes' },
  { id: 'mindset', title: 'Elite Mental Game', icon: '🧠', desc: 'The psychology of world champions' },
  { id: 'cashvstourney', title: 'Cash vs Tournaments', icon: '⚡', desc: 'Strategic differences at the top' },
  { id: 'secrets', title: 'The Big Secrets', icon: '🔑', desc: 'What the best will never tell you' },
  { id: 'main-guidee', title: 'Guided Hand', icon: '🃏', desc: 'Play a polarized river overbet at pro level' },
];

export default function ProfessionnelPage() {
  const locale = useLocale();
  const isEn = locale === 'en';
  const SECTIONS = isEn ? SECTIONS_EN : SECTIONS_FR;

  const { isLevelUnlocked, progress, completeModule, completeLevel, addXp } = useProgress();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedHand, setSelectedHand] = useState<FamousHand | null>(null);
  const [xpToast, setXpToast] = useState<number | null>(null);
  const unlocked = isLevelUnlocked('professionnel');

  const isDone = (secId: string) => !!progress.completedModules[`professionnel-${secId}`];
  const completedCount = SECTIONS.filter(s => isDone(s.id)).length;
  const progressPct = (completedCount / SECTIONS.length) * 100;

  const completeSection = (id: string) => {
    if (!isDone(id)) {
      completeModule(`professionnel-${id}`);
      addXp(80);
      setXpToast(80);
      if (SECTIONS.every(s => s.id === id || isDone(s.id))) completeLevel('professionnel');
    }
    setActiveSection(null);
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#060d08] flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 pt-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg">
            <div className="w-24 h-24 rounded-full border-2 border-red-500/50 flex items-center justify-center mx-auto mb-6 bg-red-900/20">
              <Lock size={40} className="text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'Professional Level' : 'Niveau Professionnel'}</h1>
            <p className="text-gray-400 mb-6">{isEn ? <>This level is reserved for experts. Complete all modules of the <strong className="text-yellow-400">Expert</strong> level to access it.</> : <>Ce niveau est réservé aux experts. Complétez tous les modules du niveau <strong className="text-yellow-400">Expert</strong> pour y accéder.</>}</p>
            <Link href="/expert" className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-700 to-yellow-600 text-white font-bold px-6 py-3 rounded-xl">
              {isEn ? 'Go to Expert Level' : 'Aller au niveau Expert'} <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (selectedHand) {
    return <HandDetail hand={selectedHand} onBack={() => setSelectedHand(null)} />;
  }

  if (activeSection === 'legends') {
    return <LegendsSection onBack={() => completeSection('legends')} onSelectHand={setSelectedHand} />;
  }
  if (activeSection === 'pros') return <ProsSection onBack={() => completeSection('pros')} />;
  if (activeSection === 'wsop') return <WSOPSection onBack={() => completeSection('wsop')} />;
  if (activeSection === 'mindset') return <MindsetSection onBack={() => completeSection('mindset')} />;
  if (activeSection === 'cashvstourney') return <CashVsTourneySection onBack={() => completeSection('cashvstourney')} />;
  if (activeSection === 'secrets') return <SecretsSection onBack={() => completeSection('secrets')} />;
  if (activeSection === 'main-guidee') return (
    <div className="min-h-screen bg-[#060d08]">
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => completeSection('main-guidee')} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">
            <ChevronLeft size={16} /> {isEn ? 'Back' : 'Retour'}
          </button>
          <MultiHandPlayer scripts={ALL_HAND_SCRIPTS['professionnel']} onComplete={() => completeSection('main-guidee')} onBack={() => completeSection('main-guidee')} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060d08]">
      <AnimatePresence>{xpToast !== null && <XpToast amount={xpToast} onDone={() => setXpToast(null)} />}</AnimatePresence>
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 relative overflow-hidden rounded-3xl p-8 border border-red-500/30" style={{ background: 'linear-gradient(135deg, rgba(100,20,20,0.4) 0%, rgba(20,5,5,0.8) 100%)' }}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(231,76,60,0.1),transparent_70%)]" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">👑</span>
                <div>
                  <p className="text-red-400 text-sm font-medium">{isEn ? 'Level 5: Exclusive' : 'Niveau 5 : Exclusif'}</p>
                  <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'Professional' : 'Professionnel'}</h1>
                </div>
              </div>
              <p className="text-gray-300 max-w-2xl">
                {isEn ? 'Welcome to the summit. Analyze the legendary hands of the greatest champions, discover their secret strategies, and understand what separates the world\'s best from merely good players.' : "Bienvenue au sommet. Analysez les mains légendaires des plus grands champions, découvrez leurs stratégies secrètes et comprenez ce qui sépare les meilleurs du monde des simples bons joueurs."}
              </p>
            </div>
          </motion.div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{completedCount}/{SECTIONS.length} {isEn ? 'sections' : 'sections'}</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #7f1d1d, #ef4444)' }} initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.8 }} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SECTIONS.map((section, i) => {
              const done = isDone(section.id);
              return (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setActiveSection(section.id)}
                  className={`text-left p-5 rounded-2xl border transition-all cursor-pointer group ${done ? 'border-red-500/50 bg-red-900/20' : 'border-red-600/20 bg-red-900/10 hover:border-red-500/40 hover:bg-red-900/20'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-3xl">{section.icon}</div>
                    {done && <span className="text-red-400 text-xs font-bold">✓</span>}
                  </div>
                  <h3 className="font-bold text-white text-lg mb-1 group-hover:text-red-300 transition-colors">{section.title}</h3>
                  <p className="text-gray-500 text-sm">{section.desc}</p>
                  <div className="flex items-center gap-1 text-red-400 text-sm mt-3">
                    {done ? (isEn ? 'Review' : 'Revoir') : (isEn ? 'Discover' : 'Découvrir')} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendsSection({ onBack, onSelectHand }: { onBack: () => void; onSelectHand: (h: FamousHand) => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  return (
    <div className="min-h-screen bg-[#060d08]">
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">
            <ChevronLeft size={16} /> {isEn ? 'Back' : 'Retour'}
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'Legendary Hands' : 'Mains Légendaires'}</h1>
            <p className="text-gray-400 mb-8">{isEn ? 'These hands marked poker history. Analyze each decision like a pro.' : "Ces mains ont marqué l'histoire du poker. Analysez chaque décision comme un pro."}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {FAMOUS_HANDS.map((hand, i) => (
                <motion.button
                  key={hand.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => onSelectHand(hand)}
                  className="text-left p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-red-500/30 hover:bg-red-900/10 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">{hand.year} · {hand.tournament.split(',')[0].trim()}</div>
                      <h3 className="font-bold text-white text-lg leading-tight">{hand.title}</h3>
                      <p className="text-red-400 text-sm mt-0.5">{hand.players.join(' vs ')}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{isEn ? 'Pot' : 'Pot'}</div>
                      <div className="text-white font-bold text-sm">{hand.potSize}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: hand.epicness }).map((_, j) => (
                      <Star key={j} size={10} className="fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">{hand.description}</p>
                  <div className="flex items-center gap-1 text-red-400 text-sm mt-3">
                    {isEn ? 'Analyze this hand' : 'Analyser cette main'} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function HandDetail({ hand, onBack }: { hand: FamousHand; onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [reveal, setReveal] = useState(false);
  const [showLesson, setShowLesson] = useState(false);

  return (
    <div className="min-h-screen bg-[#060d08]">
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6">
            <ChevronLeft size={16} /> {isEn ? 'Back to hands' : 'Retour aux mains'}
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: hand.epicness }).map((_, i) => (
                <Star key={i} size={12} className="fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>{hand.title}</h1>
            <p className="text-gray-500 text-sm mb-1">{hand.year} · {hand.tournament}</p>
            <p className="text-red-400 font-medium mb-6">{hand.players.join(' vs ')}</p>

            <p className="text-gray-300 leading-relaxed mb-6">{hand.description}</p>

            <div className="p-5 rounded-2xl felt-bg border border-green-700/30 mb-5">
              <div className="text-green-400 text-xs font-medium mb-3 uppercase tracking-wide">{isEn ? 'The Board' : 'Le Board'}</div>
              <div className="flex gap-1.5 flex-wrap">
                {hand.board.map((card, i) => (
                  <PokerCard key={i} card={card} size="md" delay={i * 0.1} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-900/20">
                <div className="text-blue-400 text-xs font-medium mb-2">🦸 {hand.players[0]} (Hero)</div>
                <div className="flex gap-1 mb-2">
                  {hand.heroHand.map((card, i) => (
                    <PokerCard key={i} card={card} size="sm" delay={i * 0.1} />
                  ))}
                </div>
                <p className="text-gray-300 text-xs">{hand.heroAction}</p>
              </div>
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-900/20">
                <div className="text-red-400 text-xs font-medium mb-2">🎭 {hand.players[1]} (Villain)</div>
                <div className="flex gap-1 mb-2">
                  {reveal ? (
                    hand.villainHand.map((card, i) => (
                      <PokerCard key={i} card={card} size="sm" delay={i * 0.1} />
                    ))
                  ) : (
                    hand.villainHand.map((_, i) => (
                      <PokerCard key={i} card={{ rank: '2', suit: '♠', isRed: false }} faceDown size="sm" delay={0} />
                    ))
                  )}
                </div>
                {!reveal && (
                  <button onClick={() => setReveal(true)} className="text-red-400 text-xs hover:text-red-300 transition-colors">
                    → {isEn ? 'Reveal hand' : 'Révéler la main'}
                  </button>
                )}
              </div>
            </div>

            {reveal && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-900/20 mb-4">
                <div className="text-yellow-400 text-sm font-bold mb-1">🏆 {isEn ? 'Result' : 'Résultat'}</div>
                <p className="text-gray-300 text-sm">{hand.result}</p>
              </motion.div>
            )}

            {reveal && !showLesson && (
              <button onClick={() => setShowLesson(true)} className="w-full py-3 rounded-xl border border-green-500/30 bg-green-900/20 text-green-400 font-medium hover:bg-green-900/30 transition-colors mb-4">
                📚 {isEn ? 'What lesson to draw from this hand?' : 'Quelle leçon tirer de cette main ?'}
              </button>
            )}

            {showLesson && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl border border-green-500/30 bg-green-900/20 mb-4">
                <div className="text-green-400 font-bold mb-2">💡 {isEn ? 'The Lesson' : 'La Leçon'}</div>
                <p className="text-gray-300 leading-relaxed">{hand.lesson}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ProsSection({ onBack }: { onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const pros = isEn
    ? [
      { name: 'Phil Ivey', title: 'The Tiger', wins: '10 WSOP bracelets', style: 'Balanced, unreadable, perfect live reads', quote: '"You cannot beat someone who never makes a mistake."', tip: 'Ivey observes every opponent before playing a single chip. His live reads are legendary: he reads you before you\'ve even seen your cards.', color: '#c9a84c' },
      { name: 'Daniel Negreanu', title: 'Kid Poker', wins: '6 WSOP bracelets, $50M+ live', style: 'Reads and live tells, small ball poker', quote: '"Think about what the opponent can have, not what you have."', tip: 'Negreanu is famous for calling the opponent\'s hand before showdown. His method: observe behavioral patterns over several hands before acting.', color: '#27ae60' },
      { name: 'Viktor "Isildur1" Blom', title: 'The Mad Viking', wins: 'Record-holder for the biggest online pots', style: 'Ultra-aggressive, constant pressure, massive pot sizes', quote: '"If you can\'t read them, press. Always."', tip: 'Blom plays at speeds and stakes most can\'t even imagine. His strategy: put opponents in constantly uncomfortable situations.', color: '#3498db' },
      { name: 'Chris Moneymaker', title: 'The Story', wins: 'WSOP Champion 2003, triggered the poker boom', style: 'Selective aggression, pattern-based reads', quote: '"Anyone can be a champion. That\'s the beauty of it."', tip: 'Moneymaker proved an amateur can beat the pros with preparation and courage. His legendary bluff against Sam Farha remains the most analyzed moment in poker history.', color: '#e74c3c' },
      { name: 'Phil Hellmuth', title: 'Poker Brat', wins: '17 WSOP bracelets (absolute record)', style: 'Maximal exploitation, psychological reads', quote: '"If it weren\'t for luck, they could never beat me."', tip: 'Behind the media persona lies a player of formidable precision. Hellmuth exploits opponent tendencies with surgical efficiency in tournaments.', color: '#8e44ad' },
      { name: 'Tom "Durrrr" Dwan', title: 'The Online Pioneer', wins: 'Online high stakes domination', style: 'GTO-adjacent, constant pressure, frequent triple barrels', quote: '"I play what I think is optimal, not what others think is correct."', tip: "Dwan was one of the first to integrate GTO concepts into his live and online game at very high stakes. His ability to maintain pressure over multiple streets is legendary.", color: '#e67e22' },
    ]
    : [
      { name: 'Phil Ivey', title: 'Le Tigre', wins: '10 bracelets WSOP', style: 'Équilibré, impossible à lire, parfait reads live', quote: '"Vous ne pouvez pas battre quelqu\'un qui ne fait jamais d\'erreur."', tip: 'Ivey observe chaque adversaire avant de jouer le moindre jeton. Ses reads live sont légendaires : il vous lit avant même que vous n\'ayez vu vos cartes.', color: '#c9a84c' },
      { name: 'Daniel Negreanu', title: 'Kid Poker', wins: '6 bracelets WSOP, $50M+ live', style: 'Reads et live tells, small ball poker', quote: '"Pensez à ce que l\'adversaire peut avoir, pas à ce que vous avez."', tip: 'Negreanu est célèbre pour annoncer la main adverse avant le showdown. Sa méthode : observer les patterns comportementaux sur plusieurs mains avant d\'agir.', color: '#27ae60' },
      { name: 'Viktor "Isildur1" Blom', title: 'Le Viking Fou', wins: 'Recordman des plus gros pots en ligne', style: 'Ultra-agressif, pressures constantes, taille de pot massive', quote: '"Si vous ne pouvez pas les lire, pressez. Toujours."', tip: 'Blom joue à des vitesses et des stakes que la plupart ne peuvent même pas imaginer. Sa stratégie : mettre les adversaires dans des situations constamment inconfortables.', color: '#3498db' },
      { name: 'Chris Moneymaker', title: "L'Histoire", wins: 'Champion WSOP 2003, déclencheur du boom poker', style: 'Aggression sélective, reads basés sur les patterns', quote: '"Chacun peut être champion. C\'est ça qui est beau."', tip: "Moneymaker a prouvé qu'un amateur peut battre les pros avec de la préparation et du courage. Son bluff légendaire contre Sam Farha reste le moment le plus analysé de l'histoire.", color: '#e74c3c' },
      { name: 'Phil Hellmuth', title: 'Poker Brat', wins: '17 bracelets WSOP (record absolu)', style: 'Exploitative maximal, reads psychologiques', quote: '"Si ce n\'était pas la chance, ils ne pourraient jamais me battre."', tip: 'Derrière le personnage médiatique se cache un joueur d\'une précision redoutable. Hellmuth exploite les tendances adverses avec une efficacité chirurgicale en tournoi.', color: '#8e44ad' },
      { name: 'Tom "Durrrr" Dwan', title: 'Le Pionnier Online', wins: 'Domination des high stakes online', style: 'GTO-proche, pression constante, triple barrels fréquents', quote: '"Je joue ce que je pense être optimal, pas ce que les autres pensent être correct."', tip: "Dwan a été l'un des premiers à intégrer les concepts GTO dans son jeu live et online à très hauts stakes. Sa capacité à maintenir la pression sur plusieurs streets est légendaire.", color: '#e67e22' },
    ];

  return (
    <div className="min-h-screen bg-[#060d08]">
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6"><ChevronLeft size={16} /> {isEn ? 'Back' : 'Retour'}</button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'Pro Strategies' : 'Stratégies des Pros'}</h1>
            <p className="text-gray-400 mb-8">{isEn ? "Styles and playing secrets of the world's best." : 'Les styles et secrets de jeu des meilleurs du monde.'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pros.map((pro, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="p-5 rounded-2xl border bg-white/3" style={{ borderColor: pro.color + '30' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg">{pro.name}</h3>
                      <p className="text-sm" style={{ color: pro.color }}>{pro.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{pro.wins}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: pro.color + '20' }}>
                      {['🃏', '🎯', '⚡', '🏆', '👑', '🚀'][i]}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 mb-3">
                    <p className="text-gray-300 text-xs italic">{pro.quote}</p>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{pro.tip}</p>
                  <div className="mt-2 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-500">Style: {pro.style}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function WSOPSection({ onBack }: { onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const records = isEn
    ? [
      { record: 'Biggest online poker pot', holder: 'Isildur1 vs Dwan', amount: '$1,356,946 (PLO)' },
      { record: 'Biggest live cash pot', holder: 'Wesley vs Robbi (HCL)', amount: '$1,100,000' },
      { record: 'Biggest WSOP prize', holder: 'Jamie Gold (2006)', amount: '$12,000,000' },
      { record: 'Most WSOP bracelets', holder: 'Phil Hellmuth', amount: '17 bracelets' },
    ]
    : [
      { record: 'Plus gros pot poker en ligne', holder: 'Isildur1 vs Dwan', amount: '$1,356,946 (PLO)' },
      { record: 'Plus gros pot cash live', holder: 'Wesley vs Robbi (HCL)', amount: '$1,100,000' },
      { record: 'Plus gros prize WSOP', holder: 'Jamie Gold (2006)', amount: '$12,000,000' },
      { record: 'Plus de bracelets WSOP', holder: 'Phil Hellmuth', amount: '17 bracelets' },
    ];

  return (
    <ProfModuleLayout title="WSOP & High Stakes" icon="💰" onBack={onBack}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'The Summit of Poker' : 'Le Sommet du Poker'}</h2>
      <p className="text-gray-400 text-sm mb-5">{isEn ? 'The World Series of Poker and high stakes cash games represent the pinnacle of the game.' : 'Les World Series of Poker et les high stakes cash games représentent le sommet du jeu.'}</p>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-600/30">
          <h3 className="text-yellow-400 font-bold mb-2">{isEn ? 'WSOP Main Event: The Holy Grail' : 'WSOP Main Event : Le Saint Graal'}</h3>
          <ul className="text-gray-300 text-sm space-y-1.5">
            <li>🏆 {isEn ? 'Buy-in: $10,000 (about 8,000+ participants)' : 'Buy-in : $10,000 (environ 8 000+ participants)'}</li>
            <li>💰 {isEn ? 'Prize pool: often $70M-$90M' : 'Prize pool : souvent $70M-$90M'}</li>
            <li>⏰ {isEn ? 'Duration: 10+ tournament days' : 'Durée : 10+ jours de tournoi'}</li>
            <li>👑 {isEn ? 'Recent champions: Espen Jorstad (2022), Koray Aldemir (2021)' : 'Champions récents : Espen Jorstad (2022), Koray Aldemir (2021)'}</li>
            <li>📺 {isEn ? 'Broadcast on ESPN/PokerGO' : 'Diffusé sur ESPN/PokerGO'}</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-red-900/20 border border-red-600/30">
          <h3 className="text-red-400 font-bold mb-2">{isEn ? 'High Stakes Cash Games' : 'High Stakes Cash Games'}</h3>
          <ul className="text-gray-300 text-sm space-y-1.5">
            <li>💸 {isEn ? 'Stakes: from $25/$50 to $2000/$4000' : 'Stakes : de $25/$50 à $2000/$4000'}</li>
            <li>🎮 {isEn ? 'Biggest online pots: over $2M (PLO)' : 'Les plus gros pots online : plus de $2M (PLO)'}</li>
            <li>🏠 Hustler Casino Live, Live at the Bike, MrBeast games</li>
            <li>🌐 Run It Once Poker, GGPoker nosebleeds</li>
            <li>📊 {isEn ? 'Public tracking: HighstakesDB for online' : 'Tracking public : HighstakesDB pour l\'online'}</li>
          </ul>
        </div>

        <h3 className="font-bold text-white">{isEn ? 'Absolute Records' : 'Records Absolus'}</h3>
        {records.map((r, i) => (
          <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
            <div>
              <div className="text-white text-sm font-medium">{r.record}</div>
              <div className="text-gray-500 text-xs">{r.holder}</div>
            </div>
            <div className="text-yellow-400 font-bold text-sm">{r.amount}</div>
          </div>
        ))}
      </div>
    </ProfModuleLayout>
  );
}

function MindsetSection({ onBack }: { onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const principles = isEn
    ? [
      { principle: 'Indifference to results', detail: 'Champions evaluate only the quality of their decisions. A bad beat doesn\'t affect them: they know they played well. The result is variance.', pro: 'Phil Ivey', color: '#c9a84c' },
      { principle: 'Obsessive preparation', detail: 'Champions study hundreds of hours per month. They know their ranges by heart, have analyzed all important spots, and arrive at the table prepared.', pro: 'Viktor Blom', color: '#3498db' },
      { principle: 'Instant adaptability', detail: 'In a few hands, the best identify opponent tendencies and adapt their strategy. They don\'t play GTO on autopilot: they actively listen.', pro: 'Daniel Negreanu', color: '#27ae60' },
      { principle: 'Managing adversity', detail: 'All pros have experienced devastating downswings. Resilience (the ability to keep playing well despite bad results) is a crucial skill.', pro: 'Tom Dwan', color: '#8e44ad' },
    ]
    : [
      { principle: "L'indifférence au résultat", detail: "Les champions évaluent uniquement la qualité de leurs décisions. Un bad beat ne les affecte pas : ils savent qu'ils ont bien joué. Le résultat est de la variance.", pro: 'Phil Ivey', color: '#c9a84c' },
      { principle: 'La préparation obsessionnelle', detail: 'Les champions étudient des centaines d\'heures par mois. Ils connaissent leurs ranges par cœur, ont analysé tous les spots importants, et arrivent à la table préparés.', pro: 'Viktor Blom', color: '#3498db' },
      { principle: "L'adaptabilité instantanée", detail: "En quelques mains, les meilleurs identifient les tendances adverses et adaptent leur stratégie. Ils ne jouent pas le GTO en mode automatique : ils écoutent activement.", pro: 'Daniel Negreanu', color: '#27ae60' },
      { principle: "La gestion de l'adversité", detail: "Tous les pros ont vécu des downswings dévastateurs. La résilience, la capacité à continuer à bien jouer malgré les mauvais résultats, est une compétence cruciale.", pro: 'Tom Dwan', color: '#8e44ad' },
    ];

  return (
    <ProfModuleLayout title={isEn ? 'Elite Mental Game' : 'Mental Game Elite'} icon="🧠" onBack={onBack}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'The Psychology of Champions' : 'La Psychologie des Champions'}</h2>
      <p className="text-gray-400 text-sm mb-5">{isEn ? "At this level, everyone is technically excellent. What differentiates champions is mentality." : "À ce niveau, tout le monde est techniquement excellent. Ce qui différencie les champions, c'est le mental."}</p>

      <div className="space-y-4">
        {principles.map((item, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-white">{item.principle}</h4>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: item.color + '20', color: item.color }}>{isEn ? 'Embodied by' : 'Incarné par'} {item.pro}</span>
            </div>
            <p className="text-gray-400 text-sm">{item.detail}</p>
          </div>
        ))}
      </div>
    </ProfModuleLayout>
  );
}

function CashVsTourneySection({ onBack }: { onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const adjustments = isEn
    ? [
      { aspect: 'Bluff frequency', cash: 'Calibrated on pot odds and equity', tourney: 'Reduced near bubble, increases with big stack' },
      { aspect: 'Hand selection', cash: 'Stable, always the same ranges', tourney: 'Varies with stack depth: push/fold at the end' },
      { aspect: 'Set mining', cash: 'Profitable with 15:1 implied odds', tourney: 'Less profitable if stack too short' },
      { aspect: 'Slow play', cash: 'Valid with good implied odds', tourney: 'Risky: losing all chips = elimination' },
    ]
    : [
      { aspect: 'Bluff frequency', cash: 'Calibré sur pot odds et équité', tourney: 'Réduit proche de la bulle, augmente avec gros stack' },
      { aspect: 'Hand selection', cash: 'Stable, toujours les mêmes ranges', tourney: 'Varie avec stack depth : push/fold en fin' },
      { aspect: 'Set mining', cash: 'Rentable avec 15:1 implied odds', tourney: 'Moins rentable si stack trop court' },
      { aspect: 'Slow play', cash: 'Valide avec bonnes implied odds', tourney: 'Risqué : perdre tous ses jetons = élimination' },
    ];

  return (
    <ProfModuleLayout title={isEn ? 'Cash vs Tournaments' : 'Cash vs Tournois'} icon="⚡" onBack={onBack}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? 'Two Different Sports' : 'Deux Sports Différents'}</h2>
      <p className="text-gray-400 text-sm mb-5">{isEn ? 'Cash game and tournament share the same basic rules but involve radically different strategies.' : 'Cash game et tournoi partagent les mêmes règles de base mais impliquent des stratégies radicalement différentes.'}</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="p-4 rounded-xl bg-green-900/20 border border-green-600/30">
          <h3 className="text-green-400 font-bold mb-3">Cash Game</h3>
          <ul className="text-gray-300 text-xs space-y-2">
            <li>✓ {isEn ? 'Chips = real money' : 'Jetons = argent réel'}</li>
            <li>✓ {isEn ? 'Re-buy at any time' : 'Re-buy à tout moment'}</li>
            <li>✓ {isEn ? 'Fixed blinds' : 'Blinds fixes'}</li>
            <li>✓ {isEn ? 'Leave when you want' : 'Quitter quand vous voulez'}</li>
            <li>✓ {isEn ? 'Short-term EV measurable' : 'EV à court terme mesurable'}</li>
            <li>✓ {isEn ? 'Less variance per hour' : 'Moins de variance par heure'}</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-600/30">
          <h3 className="text-yellow-400 font-bold mb-3">{isEn ? 'Tournaments' : 'Tournois'}</h3>
          <ul className="text-gray-300 text-xs space-y-2">
            <li>✓ {isEn ? 'Chips with no intrinsic value (ICM)' : 'Jetons sans valeur intrinsèque (ICM)'}</li>
            <li>✗ {isEn ? 'No re-buy (usually)' : 'Pas de re-buy (en général)'}</li>
            <li>✓ {isEn ? 'Blinds increase' : 'Blinds augmentent'}</li>
            <li>✗ {isEn ? 'Must finish the game' : 'Doit finir la partie'}</li>
            <li>✓ {isEn ? 'Skill: survival + push/fold' : 'Skill: survie + push/fold'}</li>
            <li>✓ {isEn ? 'Big upside (satellite, final table)' : 'Gros upside (satellite, final table)'}</li>
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-white">{isEn ? 'Key strategic adjustments' : 'Ajustements stratégiques clés'}</h3>
        {adjustments.map((item, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-yellow-400 font-medium p-2 rounded-lg bg-white/5 flex items-center">{item.aspect}</div>
            <div className="text-gray-300 p-2 rounded-lg bg-green-900/10 border border-green-900/30">{item.cash}</div>
            <div className="text-gray-300 p-2 rounded-lg bg-yellow-900/10 border border-yellow-900/30">{item.tourney}</div>
          </div>
        ))}
      </div>
    </ProfModuleLayout>
  );
}

function SecretsSection({ onBack }: { onBack: () => void }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const secrets = isEn
    ? [
      { secret: 'Table selection beats skill', detail: 'An average player seated with fish will earn more than an excellent player seated with regs. Table selection is the #1 skill for profitability, and the least glamorous.', icon: '🪑' },
      { secret: 'Nobody truly plays GTO', detail: 'Perfect GTO is computationally impossible for a human. The best "approximate" GTO in key spots and exploit the rest. It\'s a guide, not a religion.', icon: '🤖' },
      { secret: 'Pros make constant mistakes', detail: 'The difference is they make less costly mistakes and correct them faster. Accepting error as inevitable is a crucial mental leap toward excellence.', icon: '⚠️' },
      { secret: 'Happiness is in the right play, not the result', detail: 'Pros who last are those who find satisfaction in the right decision, even when they lose. Those who play for the adrenaline of results end up on tilt.', icon: '🧘' },
      { secret: 'Studying > Playing to improve', detail: 'After a certain level, 1 hour of targeted study improves you more than 5 hours of play. But ego resists: we prefer to "be in the action".', icon: '📚' },
      { secret: 'Variance lasts longer than you think', detail: 'In poker, statistically, you need 100,000+ hands to have representative results in cash. A 3-month downswing can be pure variance even for an excellent player.', icon: '📉' },
    ]
    : [
      { secret: 'La sélection de table bat le skill', detail: 'Un joueur moyen assis avec des fish gagnera plus qu\'un excellent joueur assis avec des regs. La table selection est la compétence n°1 pour la rentabilité, et la moins sexy.', icon: '🪑' },
      { secret: 'Personne ne joue vraiment le GTO', detail: 'Le GTO parfait est computationnellement impossible pour un humain. Les meilleurs "approximent" le GTO dans les spots clés et exploitent le reste. C\'est un guide, pas une religion.', icon: '🤖' },
      { secret: 'Les pros font des erreurs constamment', detail: 'La différence, c\'est qu\'ils font des erreurs moins coûteuses et les corrigent plus vite. Accepter l\'erreur comme inévitable est un bond mental crucial vers l\'excellence.', icon: '⚠️' },
      { secret: 'Le bonheur est dans le jeu correct, pas le résultat', detail: 'Les pros qui durent sont ceux qui trouvent de la satisfaction dans la décision juste, même quand ils perdent. Ceux qui jouent pour l\'adrénaline du résultat finissent par tilt.', icon: '🧘' },
      { secret: 'Étudier > Jouer pour progresser', detail: 'Après un certain niveau, 1 heure d\'étude ciblée vous fait plus progresser que 5 heures de jeu. Mais l\'ego résiste : on préfère "être dans l\'action".', icon: '📚' },
      { secret: 'La variance dure plus longtemps que vous ne pensez', detail: 'Au poker, statistiquement, il faut 100 000+ mains pour avoir des résultats représentatifs en cash. Un downswing de 3 mois peut être de la pure variance même pour un excellent joueur.', icon: '📉' },
    ];

  return (
    <ProfModuleLayout title={isEn ? 'The Big Secrets' : 'Les Grands Secrets'} icon="🔑" onBack={onBack}>
      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{isEn ? "What the Pros Don't Say" : 'Ce que les Pros ne Disent Pas'}</h2>
      <p className="text-gray-400 text-sm mb-5">{isEn ? 'The truths that separate very good players from the best in the world.' : 'Les vérités qui séparent les très bons joueurs des meilleurs au monde.'}</p>

      <div className="space-y-4">
        {secrets.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="p-4 rounded-xl bg-gradient-to-r from-red-900/20 to-transparent border border-red-800/30">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <h4 className="font-bold text-white mb-1">{item.secret}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </ProfModuleLayout>
  );
}

function ProfModuleLayout({ children, title, icon, onBack }: { children: React.ReactNode; title: string; icon: string; onBack: () => void; }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  return (
    <div className="min-h-screen bg-[#060d08]">
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-sm mb-6"><ChevronLeft size={16} /> {isEn ? 'Back' : 'Retour'}</button>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">{icon}</span>
              <h1 className="text-xl font-bold text-red-400">{title}</h1>
            </div>
            <div className="bg-[#0d0608] border border-red-900/30 rounded-2xl p-6 min-h-[400px]">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
